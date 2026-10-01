/**
 * CLI: runs one model over the dataset and stores raw answers.
 *
 *   bun scripts/benchmark/run-benchmark.ts --model mock
 *   bun scripts/benchmark/run-benchmark.ts --model llama32-3b --locale it
 *   bun scripts/benchmark/run-benchmark.ts --model gpt-61-sol --limit 24 --concurrency 4
 *
 * Output: scripts/benchmark/data/results/<model>-<locale>.json
 * Runs are resumable: existing answers for the same item are kept unless
 * --fresh is passed, so an interrupted or rate-limited run can be continued.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { BenchmarkDataset, OptionLabel } from "./dataset";
import { MODELS, complete, type ModelConfig } from "./providers";
import { SYSTEM_PROMPT, buildUserPrompt, parseChoice, type PromptLocale } from "./prompt";

function argStr(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  const value = i === -1 ? undefined : process.argv[i + 1];
  return value ?? fallback;
}

function argNum(name: string, fallback: number): number {
  const value = Number(argStr(name, String(fallback)));
  return Number.isFinite(value) ? value : fallback;
}

const modelId = argStr("model", "mock");
const locale = argStr("locale", "it") as PromptLocale;
const datasetPath = resolve(argStr("dataset", "scripts/benchmark/data/dataset.json"));
const limit = argNum("limit", Number.POSITIVE_INFINITY);
const concurrency = Math.max(1, argNum("concurrency", 2));
const fresh = process.argv.includes("--fresh");

const config: ModelConfig | undefined = MODELS.find((m) => m.id === modelId);
if (!config) {
  console.error(`unknown model "${modelId}". available: ${MODELS.map((m) => m.id).join(", ")}`);
  process.exit(1);
}

if (!existsSync(datasetPath)) {
  console.error(`dataset not found: ${datasetPath} — run generate-dataset.ts first`);
  process.exit(1);
}

export interface RunAnswer {
  itemId: string;
  archetype: string;
  family: string;
  correct: OptionLabel;
  choice: OptionLabel | null;
  raw: string;
  error?: string;
  latencyMs: number;
}

export interface RunFile {
  modelId: string;
  modelLabel: string;
  model: string;
  transport: string;
  locale: PromptLocale;
  datasetSeed: number;
  startedAt: string;
  answers: RunAnswer[];
}

const dataset = JSON.parse(readFileSync(datasetPath, "utf8")) as BenchmarkDataset;
const items = dataset.items.slice(0, Number.isFinite(limit) ? limit : undefined);
const outPath = resolve(
  argStr("out", `scripts/benchmark/data/results/${modelId}-${locale}.json`),
);

let run: RunFile = {
  modelId: config.id,
  modelLabel: config.label,
  model: config.model,
  transport: config.transport,
  locale,
  datasetSeed: dataset.seed,
  startedAt: new Date().toISOString(),
  answers: [],
};
if (!fresh && existsSync(outPath)) {
  const previous = JSON.parse(readFileSync(outPath, "utf8")) as RunFile;
  if (previous.datasetSeed === dataset.seed && previous.modelId === config.id) {
    run = { ...previous, answers: previous.answers.filter((a) => !a.error) };
  }
}

const done = new Set(run.answers.map((a) => a.itemId));
const pending = items.filter((i) => !done.has(i.id));
console.log(`model ....... ${config.label} (${config.transport})`);
console.log(`items ....... ${pending.length} pending of ${items.length}`);

function save(): void {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(run, null, 2)}\n`, "utf8");
}

let cursor = 0;
let completed = 0;

async function worker(): Promise<void> {
  while (cursor < pending.length) {
    const item = pending[cursor];
    cursor += 1;
    if (!item) return;
    const started = Date.now();
    const result = await complete(
      config,
      SYSTEM_PROMPT[locale],
      buildUserPrompt(item, locale),
    );
    run.answers.push({
      itemId: item.id,
      archetype: item.archetype,
      family: item.family,
      correct: item.correct,
      choice: result.error ? null : parseChoice(result.raw),
      raw: result.raw.slice(0, 4000),
      ...(result.error ? { error: result.error } : {}),
      latencyMs: Date.now() - started,
    });
    completed += 1;
    if (completed % 5 === 0 || completed === pending.length) {
      save();
      console.log(`  ${completed}/${pending.length}`);
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
save();

const errors = run.answers.filter((a) => a.error).length;
const unparsed = run.answers.filter((a) => !a.error && a.choice === null).length;
const right = run.answers.filter((a) => a.choice === a.correct).length;
console.log(`answers ..... ${run.answers.length}`);
console.log(`errors ...... ${errors}`);
console.log(`unparsable .. ${unparsed}`);
console.log(`accuracy .... ${((right / Math.max(run.answers.length, 1)) * 100).toFixed(1)}%`);
console.log(`written ..... ${outPath}`);
