/**
 * CLI: computes the thesis metrics over every stored run and emits tables.
 *
 *   bun scripts/benchmark/evaluate.ts
 *
 * Runs recorded on the unversioned v1 dataset are scored against
 * data/dataset.v1.json, excluding the items whose v1 key was wrong (listed in
 * dataset-diff-v1-v2.json); runs recorded on v2 are scored against dataset.json.
 *
 * Metrics
 *  1. accuracy overall and per reporting category (categories.ts)
 *  2. errors by misconception type, per model and language, plus a "frontier"
 *     column summing the four remote models
 *  3. inter-model agreement on shared wrong answers (random baseline 1/3)
 *  4. per-item error list for models with ≤ 5 errors
 *  5. non-conforming answers and median latency
 *  integrityCheck: share of wrong answers that landed on an option with a
 *  misconception id. With 3 diagnosed distractors out of 4 options it is 100%
 *  by construction, so it is a sanity check, not a result.
 *
 * Outputs: data/report.md and LaTeX tabularx snippets in reports/latex/.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { BenchmarkDataset, BenchmarkItem, LegacyDataset, LegacyItem, OptionLabel } from "./dataset";
import { CATEGORY_IDS, categoryOf, type ReportingCategory } from "../../src/services/combinatorics/categories";
import { MISCONCEPTION_TYPES } from "../../src/services/combinatorics/types";

interface RunAnswer {
  itemId: string;
  archetype: string;
  correct: OptionLabel;
  choice: OptionLabel | null;
  error?: string;
  latencyMs: number;
}

interface RunFile {
  modelId: string;
  modelLabel: string;
  locale: string;
  datasetSeed: number;
  datasetVersion?: number;
  answers: RunAnswer[];
}

function argStr(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  const value = i === -1 ? undefined : process.argv[i + 1];
  return value ?? fallback;
}

const dataDir = resolve(argStr("data", "scripts/benchmark/data"));
const resultsDir = resolve(argStr("results", join(dataDir, "results")));
const latexDir = resolve(argStr("latex", "reports/latex"));
const v2Path = join(dataDir, "dataset.json");
const v1Path = join(dataDir, "dataset.v1.json");
const diffPath = join(dataDir, "dataset-diff-v1-v2.json");

if (!existsSync(v2Path) || !existsSync(resultsDir)) {
  console.error("dataset or results directory missing — generate and run first");
  process.exit(1);
}

const v2 = JSON.parse(readFileSync(v2Path, "utf8")) as BenchmarkDataset;
const v2ById = new Map(v2.items.map((i) => [i.id, i]));
const v1: LegacyDataset | null = existsSync(v1Path) ? (JSON.parse(readFileSync(v1Path, "utf8")) as LegacyDataset) : null;
const v1ById = new Map((v1?.items ?? []).map((i) => [i.id, i]));
const invalidInV1 = new Set<string>(
  existsSync(diffPath)
    ? (JSON.parse(readFileSync(diffPath, "utf8")) as { changes: { id: string; invalidInV1: boolean }[] }).changes
        .filter((c) => c.invalidInV1)
        .map((c) => c.id)
    : [],
);

const FRONTIER = ["claude-opus-5", "gpt-61-sol", "deepseek-reasoner", "deepseek-flash"];
const UNTYPED = "untyped";
type TypeKey = (typeof MISCONCEPTION_TYPES)[number] | typeof UNTYPED;
const TYPE_KEYS: TypeKey[] = [...MISCONCEPTION_TYPES, UNTYPED];

const warnings: string[] = [];

/** Normalised view of one scored item, independent of the dataset version. */
interface ScoredItem {
  id: string;
  archetype: string;
  correct: OptionLabel;
  options: Record<OptionLabel, string>;
  /** misconception id/type for each wrong label, when known */
  miss: Partial<Record<OptionLabel, { id: string; type: TypeKey }>>;
}

function fromV2(item: BenchmarkItem): ScoredItem {
  return { id: item.id, archetype: item.archetype, correct: item.correct, options: item.options, miss: item.misconceptions };
}

/**
 * v1 items carry only diagnoses. The misconception type is recovered from the
 * v2 item with the same id and statement, by matching the option value against
 * the v2 candidate pool; unmatched (old fallback) values stay "untyped".
 */
function fromV1(item: LegacyItem): ScoredItem {
  const twin = v2ById.get(item.id);
  const sameStatement = twin && twin.text.it === item.text.it;
  const miss: ScoredItem["miss"] = {};
  for (const label of Object.keys(item.options) as OptionLabel[]) {
    if (label === item.correct) continue;
    const hit = sameStatement ? twin.pool.find((c) => c.value === item.options[label]) : undefined;
    if (item.diagnoses[label]) miss[label] = { id: hit?.id ?? "v1-diagnosed", type: hit?.type ?? UNTYPED };
  }
  return { id: item.id, archetype: item.archetype, correct: item.correct, options: item.options, miss };
}

interface Summary {
  modelId: string;
  modelLabel: string;
  locale: string;
  version: number;
  scored: number;
  excluded: number;
  correct: number;
  wrong: number;
  nonConforming: number;
  diagnosedWrong: number;
  perCategory: Record<ReportingCategory, { total: number; correct: number }>;
  byType: Record<TypeKey, number>;
  medianLatencyMs: number;
  errors: { itemId: string; archetype: string; choice: OptionLabel; value: string; misconception: string; type: TypeKey }[];
  /** itemId → chosen wrong value, for agreement */
  wrongValues: Map<string, string>;
}

function summarise(run: RunFile): Summary {
  const version = run.datasetVersion ?? 1;
  const perCategory = Object.fromEntries(CATEGORY_IDS.map((c) => [c, { total: 0, correct: 0 }])) as Summary["perCategory"];
  const byType = Object.fromEntries(TYPE_KEYS.map((t) => [t, 0])) as Summary["byType"];
  const s: Summary = {
    modelId: run.modelId,
    modelLabel: run.modelLabel,
    locale: run.locale,
    version,
    scored: 0,
    excluded: 0,
    correct: 0,
    wrong: 0,
    nonConforming: 0,
    diagnosedWrong: 0,
    perCategory,
    byType,
    medianLatencyMs: 0,
    errors: [],
    wrongValues: new Map(),
  };
  const latencies: number[] = [];
  for (const answer of run.answers) {
    let item: ScoredItem | undefined;
    if (version >= 2) {
      const raw = v2ById.get(answer.itemId);
      item = raw && fromV2(raw);
    } else {
      if (invalidInV1.has(answer.itemId)) {
        s.excluded += 1;
        continue;
      }
      const raw = v1ById.get(answer.itemId);
      item = raw && fromV1(raw);
    }
    if (!item) continue;
    s.scored += 1;
    latencies.push(answer.latencyMs);
    const bucket = perCategory[categoryOf(item.archetype)];
    bucket.total += 1;
    if (answer.error || answer.choice === null) {
      s.nonConforming += 1;
      continue;
    }
    if (answer.choice === item.correct) {
      s.correct += 1;
      bucket.correct += 1;
      continue;
    }
    s.wrong += 1;
    const m = item.miss[answer.choice];
    if (m) s.diagnosedWrong += 1;
    const type: TypeKey = m?.type ?? UNTYPED;
    byType[type] += 1;
    const value = item.options[answer.choice];
    s.wrongValues.set(item.id, value);
    s.errors.push({ itemId: item.id, archetype: item.archetype, choice: answer.choice, value, misconception: m?.id ?? "—", type });
  }
  latencies.sort((a, b) => a - b);
  s.medianLatencyMs = latencies[Math.floor(latencies.length / 2)] ?? 0;
  if (s.excluded) warnings.push(`${s.modelLabel} (${s.locale}): v1 run, ${s.excluded} item(s) with a wrong v1 key excluded`);
  if (s.wrong > 0 && s.diagnosedWrong < s.wrong) {
    warnings.push(
      `!!! INTEGRITY CHECK FAILED — ${s.modelLabel} (${s.locale}): ${s.wrong - s.diagnosedWrong} of ${s.wrong} wrong answers landed on an option WITHOUT a misconception id`,
    );
  }
  return s;
}

const pct = (n: number, d: number): string => (d === 0 ? "—" : `${((n / d) * 100).toFixed(1)}%`);

const runs = readdirSync(resultsDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(resultsDir, f), "utf8")) as RunFile)
  .filter((r) => r.datasetSeed === v2.seed);

if (runs.length === 0) {
  console.error(`no runs for dataset seed ${v2.seed} in ${resultsDir}`);
  process.exit(1);
}

const summaries = runs.map(summarise).sort((a, b) => b.correct / (b.scored || 1) - a.correct / (a.scored || 1));
const locales = [...new Set(summaries.map((s) => s.locale))].sort();

/* ---------- inter-model agreement ---------- */

interface Agreement {
  locale: string;
  a: string;
  b: string;
  shared: number;
  same: number;
}
const agreements: Agreement[] = [];
for (const locale of locales) {
  const group = summaries.filter((s) => s.locale === locale);
  for (let i = 0; i < group.length; i += 1) {
    for (let j = i + 1; j < group.length; j += 1) {
      const A = group[i]!;
      const B = group[j]!;
      let shared = 0;
      let same = 0;
      for (const [id, value] of A.wrongValues) {
        const other = B.wrongValues.get(id);
        if (other === undefined) continue;
        shared += 1;
        if (other === value) same += 1;
      }
      agreements.push({ locale, a: A.modelLabel, b: B.modelLabel, shared, same });
    }
  }
}

/* ---------- rendering ---------- */

interface Table {
  caption: string;
  label: string;
  /** output file name (without .tex) */
  file: string;
  head: string[];
  rows: string[][];
}

/** Italian row/column labels for the thesis tables. */
const TYPE_LABELS_IT: Record<string, string> = {
  "order-irrelevant": "Ordine ignorato",
  repetition: "Ripetizione non gestita",
  "labelled-groups": "Gruppi trattati come etichettati",
  "constraint-ignored": "Vincolo ignorato",
  "constraint-applied-once": "Vincolo applicato una sola volta",
  "additive-union": "Unione additiva",
  "inclusion-exclusion-truncated": "Inclusione-esclusione troncata",
  "complement-ignored": "Complementare errato",
  "conditioning-inverted": "Condizionamento invertito",
  "circular-as-linear": "Disposizione circolare come lineare",
  other: "Altro",
  untyped: "Non diagnosticato",
};
const CATEGORY_LABELS_IT: Record<string, string> = {
  disposizioni: "Disp.",
  permutazioni: "Perm.",
  combinazioni: "Comb.",
  urne: "Urne",
  "probabilita-elementare": "Prob.",
  "probabilita-avanzata": "Avanz.",
  trombetta: "Tromb.",
};

const tables: Table[] = [];

tables.push({
  caption: `Accuratezza complessiva (dataset seed ${v2.seed}; integrità attesa 100\\%).`,
  label: "tab:risultati", file: "benchmark-accuracy",
  head: ["Modello", "Lingua", "Dataset", "Quesiti", "Accuratezza", "Errati", "Non conformi", "Latenza mediana", "Integrità"],
  rows: summaries.map((s) => [
    s.modelLabel,
    s.locale,
    `v${s.version}`,
    `${s.scored}`,
    pct(s.correct, s.scored),
    `${s.wrong}`,
    `${s.nonConforming}`,
    `${s.medianLatencyMs} ms`,
    pct(s.diagnosedWrong, s.wrong),
  ]),
});

tables.push({
  caption: "Accuratezza per categoria di rendicontazione.",
  label: "tab:categorie", file: "benchmark-categories",
  head: ["Modello", "Lingua", ...CATEGORY_IDS.map((c) => CATEGORY_LABELS_IT[c] ?? c)],
  rows: summaries.map((s) => [
    s.modelLabel,
    s.locale,
    ...CATEGORY_IDS.map((c) => pct(s.perCategory[c].correct, s.perCategory[c].total)),
  ]),
});

for (const locale of locales) {
  const group = summaries.filter((s) => s.locale === locale);
  const frontier = group.filter((s) => FRONTIER.includes(s.modelId));
  tables.push({
    caption: `Distribuzione degli errori per tipo di misconcezione (${locale}); «Frontier» somma i quattro modelli remoti.`,
    label: `tab:misconcezioni-${locale}`, file: `benchmark-misconceptions-${locale}`,
    head: ["Tipo", ...group.map((s) => s.modelLabel), "Frontier"],
    rows: TYPE_KEYS.filter((t) => group.some((s) => s.byType[t] > 0)).map((t) => [
      TYPE_LABELS_IT[t] ?? t,
      ...group.map((s) => `${s.byType[t]}`),
      `${frontier.reduce((n, s) => n + s.byType[t], 0)}`,
    ]),
  });
}

tables.push({
  caption: "Accordo inter-modello sugli errori condivisi (baseline casuale 1/3 = 33.3\\%).",
  label: "tab:accordo", file: "benchmark-agreement",
  head: ["Lingua", "Modello A", "Modello B", "Errori condivisi", "Stesso distrattore", "Accordo", "Baseline"],
  rows: agreements.map((g) => [g.locale, g.a, g.b, `${g.shared}`, `${g.same}`, pct(g.same, g.shared), "33.3%"]),
});
for (const locale of locales) {
  const group = agreements.filter((g) => g.locale === locale);
  const shared = group.reduce((n, g) => n + g.shared, 0);
  const same = group.reduce((n, g) => n + g.same, 0);
  tables[tables.length - 1]!.rows.push([locale, "tutte le coppie", "", `${shared}`, `${same}`, pct(same, shared), "33.3%"]);
}

tables.push({
  caption: "Errori quesito per quesito dei modelli con al più 5 errori.",
  label: "tab:errori-quesiti", file: "benchmark-item-errors",
  head: ["Modello", "Lingua", "Quesito", "Archetipo", "Opzione scelta", "Misconcezione"],
  rows: summaries
    .filter((s) => s.wrong <= 5)
    .flatMap((s) =>
      s.errors.map((e) => [s.modelLabel, s.locale, e.itemId, e.archetype, `${e.choice}) ${e.value}`, `${e.misconception} (${e.type})`]),
    ),
});

function markdown(): string {
  const out: string[] = [`# Benchmark LLM — calcolo combinatorio (seed ${v2.seed})`, ""];
  out.push(`Dataset v${v2.version}, motore v${v2.engineVersion}: ${v2.items.length} quesiti, ${v2.archetypeCount} archetipi.`, "");
  if (warnings.length) {
    out.push("## Avvisi", "", ...warnings.map((w) => `- ${w}`), "");
  }
  for (const t of tables) {
    out.push(`## ${t.caption.replace(/\\%/g, "%")}`, "");
    out.push(`| ${t.head.join(" | ")} |`, `| ${t.head.map(() => "---").join(" | ")} |`);
    for (const r of t.rows) out.push(`| ${r.join(" | ")} |`);
    out.push("");
  }
  return out.join("\n");
}

const tex = (v: string) =>
  v
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([%&#_$])/g, "\\$1")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\\textbackslash\\\{\\\}/g, "\\textbackslash{}");

function latex(t: Table): string {
  const cols = `l${"X".repeat(Math.max(1, t.head.length - 1))}`;
  return [
    "% generated by scripts/benchmark/evaluate.ts — requires \\usepackage{tabularx,booktabs}",
    "\\begin{table}[htbp]",
    "\\centering\\small",
    `\\begin{tabularx}{\\textwidth}{${cols}}`,
    "\\toprule",
    `${t.head.map(tex).join(" & ")} \\\\`,
    "\\midrule",
    ...t.rows.map((r) => `${r.map(tex).join(" & ")} \\\\`),
    "\\bottomrule",
    "\\end{tabularx}",
    `\\caption{${t.caption}}`,
    `\\label{${t.label}}`,
    "\\end{table}",
    "",
  ].join("\n");
}

const md = markdown();
console.log(md);
for (const w of warnings) console.error(w);
writeFileSync(join(dataDir, "report.md"), `${md}\n`, "utf8");
mkdirSync(latexDir, { recursive: true });
for (const t of tables) writeFileSync(join(latexDir, `${t.file}.tex`), latex(t), "utf8");
console.error(`\nreport written to ${join(dataDir, "report.md")}; LaTeX tables in ${latexDir}`);
