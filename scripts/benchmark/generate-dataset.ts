/**
 * CLI: writes a reproducible benchmark dataset to disk.
 *
 *   bun scripts/benchmark/generate-dataset.ts --seed 20261001 --per-archetype 4
 *
 * Output: scripts/benchmark/data/dataset.json
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { buildDataset, ALL_ARCHETYPES } from "./dataset";

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

const dataset = buildDataset(seed, perArchetype);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");

const withDiagnosis = dataset.items.filter((i) => Object.keys(i.diagnoses).length > 0).length;
console.log(`seed ................ ${seed}`);
console.log(`archetypes .......... ${ALL_ARCHETYPES.length}`);
console.log(`items ............... ${dataset.items.length} (${perArchetype} per archetype)`);
console.log(`items with diagnoses  ${withDiagnosis}`);
console.log(`written ............. ${out}`);
