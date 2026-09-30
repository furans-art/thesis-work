/**
 * CLI: computes the thesis metrics over every stored run and emits tables.
 *
 *   bun scripts/benchmark/evaluate.ts
 *   bun scripts/benchmark/evaluate.ts --format latex
 *
 * Metrics
 *  1. accuracy               — share of exactly correct answers
 *  2. accuracy per family    — where a model collapses (disposizioni, urne, …)
 *  3. distractor alignment   — of the wrong answers, the share that landed on
 *                              an option carrying a modelled misconception.
 *                              High alignment means the model fails the way
 *                              students fail; low alignment means it fails
 *                              randomly. This is the original metric of the work.
 *  4. unparsable rate        — answers that did not respect the protocol
 */

import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import type { BenchmarkDataset, Family, OptionLabel } from "./dataset";
import { FAMILIES } from "./dataset";

interface RunAnswer {
  itemId: string;
  archetype: string;
  family: Family;
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
  answers: RunAnswer[];
}

function argStr(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  const value = i === -1 ? undefined : process.argv[i + 1];
  return value ?? fallback;
}

const datasetPath = resolve(argStr("dataset", "scripts/benchmark/data/dataset.json"));
const resultsDir = resolve(argStr("results", "scripts/benchmark/data/results"));
const format = argStr("format", "markdown");

if (!existsSync(datasetPath) || !existsSync(resultsDir)) {
  console.error("dataset or results directory missing — generate and run first");
  process.exit(1);
}

const dataset = JSON.parse(readFileSync(datasetPath, "utf8")) as BenchmarkDataset;
const byId = new Map(dataset.items.map((i) => [i.id, i]));
const families = Object.keys(FAMILIES) as Family[];

interface Summary {
  modelLabel: string;
  locale: string;
  total: number;
  answered: number;
  correct: number;
  wrong: number;
  unparsable: number;
  errors: number;
  alignedWrong: number;
  perFamily: Record<Family, { total: number; correct: number }>;
  medianLatencyMs: number;
}

function summarise(run: RunFile): Summary {
  const perFamily = Object.fromEntries(
    families.map((f) => [f, { total: 0, correct: 0 }]),
  ) as Summary["perFamily"];
  let correct = 0;
  let wrong = 0;
  let unparsable = 0;
  let errors = 0;
  let alignedWrong = 0;
  const latencies: number[] = [];

  for (const answer of run.answers) {
    const item = byId.get(answer.itemId);
    if (!item) continue;
    latencies.push(answer.latencyMs);
    const bucket = perFamily[item.family];
    bucket.total += 1;
    if (answer.error) {
      errors += 1;
      continue;
    }
    if (answer.choice === null) {
      unparsable += 1;
      continue;
    }
    if (answer.choice === item.correct) {
      correct += 1;
      bucket.correct += 1;
      continue;
    }
    wrong += 1;
    if (item.diagnoses[answer.choice]) alignedWrong += 1;
  }

  latencies.sort((a, b) => a - b);
  return {
    modelLabel: run.modelLabel,
    locale: run.locale,
    total: run.answers.length,
    answered: correct + wrong,
    correct,
    wrong,
    unparsable,
    errors,
    alignedWrong,
    perFamily,
    medianLatencyMs: latencies[Math.floor(latencies.length / 2)] ?? 0,
  };
}

const pct = (n: number, d: number): string => (d === 0 ? "—" : `${((n / d) * 100).toFixed(1)}%`);

const runs = readdirSync(resultsDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(resultsDir, f), "utf8")) as RunFile)
  .filter((r) => r.datasetSeed === dataset.seed);

if (runs.length === 0) {
  console.error(`no runs for dataset seed ${dataset.seed} in ${resultsDir}`);
  process.exit(1);
}

const summaries = runs.map(summarise).sort((a, b) => b.correct / b.total - a.correct / a.total);

function renderMarkdown(): string {
  const lines: string[] = [];
  lines.push(`# Benchmark LLM — calcolo combinatorio (seed ${dataset.seed})`);
  lines.push("");
  lines.push(
    `Dataset: ${dataset.items.length} quesiti, ${dataset.archetypeCount} archetipi, generazione deterministica.`,
  );
  lines.push("");
  lines.push("## Tabella 6.1 — Accuratezza complessiva e allineamento ai distrattori");
  lines.push("");
  lines.push("| Modello | Lingua | Quesiti | Accuratezza | Errati | Allineamento distrattori | Non conformi | Latenza mediana |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const s of summaries) {
    lines.push(
      `| ${s.modelLabel} | ${s.locale} | ${s.total} | ${pct(s.correct, s.total)} | ${s.wrong} | ${pct(s.alignedWrong, s.wrong)} | ${s.unparsable + s.errors} | ${s.medianLatencyMs} ms |`,
    );
  }
  lines.push("");
  lines.push("## Tabella 6.2 — Accuratezza per macro-categoria");
  lines.push("");
  lines.push(`| Modello | Lingua | ${families.join(" | ")} |`);
  lines.push(`| --- | --- | ${families.map(() => "---").join(" | ")} |`);
  for (const s of summaries) {
    const cells = families.map((f) => pct(s.perFamily[f].correct, s.perFamily[f].total));
    lines.push(`| ${s.modelLabel} | ${s.locale} | ${cells.join(" | ")} |`);
  }

  lines.push("");
  return lines.join("\n");
}

function renderLatex(): string {
  const esc = (v: string) => v.replace(/%/g, "\\%").replace(/&/g, "\\&");
  const lines: string[] = [];
  lines.push("\\begin{table}[ht]\n\\centering");
  lines.push("\\begin{tabular}{llrrrr}\n\\hline");
  lines.push("Modello & Lingua & Quesiti & Accuratezza & Allineamento & Non conformi \\\\\n\\hline");
  for (const s of summaries) {
    lines.push(
      `${esc(s.modelLabel)} & ${esc(s.locale)} & ${s.total} & ${esc(pct(s.correct, s.total))} & ${esc(pct(s.alignedWrong, s.wrong))} & ${s.unparsable + s.errors} \\\\`,
    );
  }

  lines.push("\\hline\n\\end{tabular}");
  lines.push(
    `\\caption{Accuratezza e allineamento ai distrattori cognitivi (dataset seed ${dataset.seed}).}`,
  );
  lines.push("\\label{tab:benchmark-llm}\n\\end{table}");
  return lines.join("\n");
}

const output = format === "latex" ? renderLatex() : renderMarkdown();
console.log(output);

const reportPath = resolve(
  argStr("out", `scripts/benchmark/data/report.${format === "latex" ? "tex" : "md"}`),
);
mkdirSync(resolve(reportPath, ".."), { recursive: true });
writeFileSync(reportPath, `${output}\n`, "utf8");
console.error(`\nreport written to ${reportPath}`);
