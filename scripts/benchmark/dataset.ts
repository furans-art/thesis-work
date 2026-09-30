/**
 * Deterministic benchmark dataset builder.
 *
 * Samples exercises from the 24 procedural archetypes of the Combinatorics &
 * Probability engine and serialises them with their ground truth: correct
 * option, exact step-by-step explanation and, for every wrong option, the
 * cognitive misconception that produces that exact value.
 *
 * The RNG is seeded, so the same seed always yields byte-identical datasets:
 * the experiment reported in the thesis is fully reproducible.
 */

import { createRng, type Rng } from "../../src/services/combinatorics/math-utils";
import { dispositionArchetypes } from "../../src/services/combinatorics/archetypes/dispositions";
import { permutationArchetypes } from "../../src/services/combinatorics/archetypes/permutations";
import { combinationArchetypes } from "../../src/services/combinatorics/archetypes/combinations";
import { urnArchetypes } from "../../src/services/combinatorics/archetypes/urns";
import { probabilityArchetypes } from "../../src/services/combinatorics/archetypes/probability";
import { advancedArchetypes } from "../../src/services/combinatorics/archetypes/advanced";
import { trombettaArchetypes } from "../../src/services/combinatorics/archetypes/trombetta";
import type { Archetype, Localized } from "../../src/services/combinatorics/types";

export const OPTION_LABELS = ["A", "B", "C", "D"] as const;
export type OptionLabel = (typeof OPTION_LABELS)[number];

/** Macro-categories used to aggregate results per family in Chapter 6. */
export const FAMILIES = {
  disposizioni: dispositionArchetypes,
  permutazioni: permutationArchetypes,
  combinazioni: combinationArchetypes,
  urne: urnArchetypes,
  probabilita: probabilityArchetypes,
  avanzati: advancedArchetypes,
  trombetta: trombettaArchetypes,
} satisfies Record<string, Archetype[]>;

export type Family = keyof typeof FAMILIES;

const FAMILY_OF = new Map<string, Family>();
for (const [family, list] of Object.entries(FAMILIES) as [Family, Archetype[]][]) {
  for (const a of list) FAMILY_OF.set(a.id, family);
}

export const ALL_ARCHETYPES: Archetype[] = Object.values(FAMILIES).flat();

export interface BenchmarkItem {
  id: string;
  archetype: string;
  family: Family;
  difficulty: string;
  /** problem statement, both languages (the runner picks one) */
  text: Localized;
  /** four options keyed A–D, already shuffled */
  options: Record<OptionLabel, string>;
  correct: OptionLabel;
  /** exact derivation produced by the engine */
  explanation: Localized;
  /**
   * For each wrong label, the misconception whose application yields it.
   * Missing entry = the value is a neutral fallback with no known diagnosis.
   */
  diagnoses: Partial<Record<OptionLabel, Localized>>;
}

export interface BenchmarkDataset {
  seed: number;
  createdAt: string;
  archetypeCount: number;
  items: BenchmarkItem[];
}

function parseValue(value: string): { a: number; b: number } {
  if (value.includes("/")) {
    const [a, b] = value.split("/").map(Number);
    return { a: a ?? 0, b: b ?? 1 };
  }
  return { a: Number(value), b: 1 };
}

function gcd2(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

/** Mirrors the app's fallback policy so options stay plausible and distinct. */
function fallbackDistractors(correct: string): string[] {
  const { a, b } = parseValue(correct);
  if (b > 1) {
    return [a + 1, a - 1, a + 2, Math.max(a - 2, 0)]
      .filter((n) => n >= 0 && n < b)
      .map((n) => (n === 0 ? "0" : `${n / gcd2(n, b)}/${b / gcd2(n, b)}`));
  }
  return [a + 1, a - 1 > 0 ? a - 1 : a + 2, 2 * a, a + 3].map(String);
}

function buildItem(archetype: Archetype, index: number, rng: Rng): BenchmarkItem {
  const ex = archetype.generate(rng);
  const seen = new Set<string>([ex.correct]);
  const wrong: { value: string; why: Localized | undefined }[] = [];
  const rawWhys = ex.diagnoses ?? [];

  ex.distractors.forEach((label, i) => {
    if (wrong.length === 3) return;
    let value = label;
    let why = rawWhys[i];
    const { a, b } = parseValue(value);
    const invalidProbability = b > 1 && a > b;
    if (invalidProbability || seen.has(value)) {
      const fb = fallbackDistractors(ex.correct).find((c) => !seen.has(c));
      if (fb === undefined) return;
      value = fb;
      why = undefined;
    }
    seen.add(value);
    wrong.push({ value, why });
  });

  for (const fb of fallbackDistractors(ex.correct)) {
    if (wrong.length === 3) break;
    if (seen.has(fb)) continue;
    seen.add(fb);
    wrong.push({ value: fb, why: undefined });
  }

  const shuffled = rng.shuffle([
    { value: ex.correct, correct: true, why: undefined as Localized | undefined },
    ...wrong.map((w) => ({ value: w.value, correct: false, why: w.why })),
  ]);

  const options = {} as Record<OptionLabel, string>;
  const diagnoses: Partial<Record<OptionLabel, Localized>> = {};
  let correct: OptionLabel = "A";
  shuffled.forEach((entry, i) => {
    const label = OPTION_LABELS[i]!;
    options[label] = entry.value;
    if (entry.correct) correct = label;
    else if (entry.why) diagnoses[label] = entry.why;
  });

  return {
    id: `${archetype.id}-${String(index).padStart(3, "0")}`,
    archetype: archetype.id,
    family: FAMILY_OF.get(archetype.id) ?? "avanzati",
    difficulty: ex.difficulty,
    text: ex.text,
    options,
    correct,
    explanation: ex.explanation,
    diagnoses,
  };
}

/**
 * Builds `perArchetype` items for each of the 24 archetypes, so every family
 * is represented with equal weight and no archetype can dominate the score.
 */
export function buildDataset(seed: number, perArchetype: number): BenchmarkDataset {
  const rng = createRng(seed);
  const items: BenchmarkItem[] = [];
  ALL_ARCHETYPES.forEach((archetype) => {
    for (let i = 0; i < perArchetype; i += 1) {
      items.push(buildItem(archetype, items.length, rng));
    }
  });
  return {
    seed,
    createdAt: new Date().toISOString(),
    archetypeCount: ALL_ARCHETYPES.length,
    items,
  };
}
