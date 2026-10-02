/**
 * CLI: writes the reproducible benchmark dataset (format v2) to disk.
 *
 *   bun scripts/benchmark/generate-dataset.ts --seed 20261001 --per-archetype 4
 *
 * Before writing, every item is re-checked against the brute-force oracle;
 * any failure aborts without touching the files.
 *
 * Outputs (scripts/benchmark/data/):
 *   dataset.json              v2 dataset (version, engineVersion)
 *   dataset.v1.json           the previous unversioned dataset, kept as-is
 *   dataset-diff-v1-v2.json   items whose key or option set changed
 */

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { buildDatasetWithExercises, ALL_ARCHETYPES, OPTION_LABELS, type LegacyDataset } from "./dataset";
import { checkExercise } from "../../src/services/combinatorics/oracle";

function arg(name: string, fallback: number): number {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const value = Number(process.argv[i + 1]);
  return Number.isFinite(value) ? value : fallback;
}

function argStr(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  const value = i === -1 ? undefined : process.argv[i + 1];
  return value ?? fallback;
}

const seed = arg("seed", 20261001);
const perArchetype = arg("per-archetype", 4);
const out = resolve(argStr("out", "scripts/benchmark/data/dataset.json"));
const dir = dirname(out);
const v1Path = join(dir, "dataset.v1.json");
const diffPath = join(dir, "dataset-diff-v1-v2.json");

const { dataset, built } = buildDatasetWithExercises(seed, perArchetype);

// 1. oracle gate: refuse to write anything if a single item is unsound
const failures = built.flatMap(({ item, exercise }) =>
  checkExercise(exercise).map((p) => `${item.id}: ${p}`),
);
if (failures.length) {
  console.error(`oracle check FAILED on ${failures.length} point(s); dataset NOT written:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

// 2. preserve the unversioned v1 dataset
mkdirSync(dir, { recursive: true });
if (existsSync(out) && !existsSync(v1Path)) {
  const current = JSON.parse(readFileSync(out, "utf8")) as { version?: number };
  if (current.version === undefined) renameSync(out, v1Path);
}

// 3. diff against v1
interface DiffEntry {
  id: string;
  archetype: string;
  keyChanged: boolean;
  optionsChanged: boolean;
  old: { key: string; value: string; options: Record<string, string> };
  new: { key: string; value: string; options: Record<string, string> };
}
const diff: DiffEntry[] = [];
if (existsSync(v1Path)) {
  const v1 = JSON.parse(readFileSync(v1Path, "utf8")) as LegacyDataset;
  const newById = new Map(dataset.items.map((i) => [i.id, i]));
  for (const old of v1.items) {
    const now = newById.get(old.id);
    if (!now) continue;
    const oldValue = old.options[old.correct];
    const newValue = now.options[now.correct];
    const sorted = (o: Record<string, string>) => OPTION_LABELS.map((l) => o[l]).sort().join("|");
    const keyChanged = oldValue !== newValue;
    const optionsChanged = sorted(old.options) !== sorted(now.options);
    if (!keyChanged && !optionsChanged) continue;
    diff.push({
      id: old.id,
      archetype: old.archetype,
      keyChanged,
      optionsChanged,
      old: { key: old.correct, value: oldValue, options: old.options },
      new: { key: now.correct, value: newValue, options: now.options },
    });
  }
  writeFileSync(diffPath, `${JSON.stringify({ from: 1, to: 2, seed, changes: diff }, null, 2)}\n`, "utf8");
}

writeFileSync(out, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");

console.log(`seed ................ ${seed}`);
console.log(`engine version ...... ${dataset.engineVersion}`);
console.log(`archetypes .......... ${ALL_ARCHETYPES.length}`);
console.log(`items ............... ${dataset.items.length} (${perArchetype} per archetype)`);
console.log(`oracle checks ....... all passed`);
console.log(`written ............. ${out}`);
if (existsSync(v1Path)) {
  console.log(`v1 kept ............. ${v1Path}`);
  console.log(`diff ................ ${diffPath}`);
  console.log(`  key changed ....... ${diff.filter((d) => d.keyChanged).length}`);
  console.log(`  options changed ... ${diff.filter((d) => d.optionsChanged).length}`);
}
