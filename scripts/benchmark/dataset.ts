/**
 * Deterministic benchmark dataset builder (format v2).
 *
 * Samples exercises from the 24 procedural archetypes of the Combinatorics &
 * Probability engine and serialises them with their ground truth: correct
 * option, exact step-by-step explanation and, for every wrong option, the
 * misconception (id + taxonomy type + bilingual diagnosis) that produces it.
 * Options come from the engine's distractor invariant: there is no
 * numeric-perturbation fallback, so every wrong option is diagnosed.
 *
 * The RNG is seeded, so the same seed always yields byte-identical items.
 */

import { createRng, type Rng } from "../../src/services/combinatorics/math-utils";
import { ARCHETYPES } from "../../src/services/combinatorics/combinatorics.service";
import { ENGINE_VERSION, resolveExercise } from "../../src/services/combinatorics/engine";
import {
  CATEGORY_IDS,
  categoryOf,
  type ReportingCategory,
} from "../../src/services/combinatorics/categories";
import type {
  Archetype,
  ExerciseParams,
  Localized,
  MisconceptionType,
  ResolvedExercise,
} from "../../src/services/combinatorics/types";

export const OPTION_LABELS = ["A", "B", "C", "D"] as const;
export type OptionLabel = (typeof OPTION_LABELS)[number];

export const DATASET_VERSION = 2;
export const CATEGORIES = CATEGORY_IDS;
export type Category = ReportingCategory;
/** @deprecated kept for older imports; categories are the reporting unit. */
export type Family = Category;

export const ALL_ARCHETYPES: Archetype[] = ARCHETYPES;

export interface ItemMisconception {
  id: string;
  type: MisconceptionType;
}

export interface BenchmarkItem {
  id: string;
  archetype: string;
  /** reporting category (single source of truth: categories.ts) */
  category: Category;
  /** same as category, kept so older runners keep writing a `family` field */
  family: Category;
  difficulty: string;
  params: ExerciseParams;
  text: Localized;
  options: Record<OptionLabel, string>;
  correct: OptionLabel;
  explanation: Localized;
  /** diagnosis for every wrong label (always three entries in v2) */
  diagnoses: Partial<Record<OptionLabel, Localized>>;
  misconceptions: Partial<Record<OptionLabel, ItemMisconception>>;
  /** every candidate the archetype proposed, picked or not, for traceability */
  pool: (ItemMisconception & { value: string })[];
}

export interface BenchmarkDataset {
  version: number;
  engineVersion: number;
  seed: number;
  createdAt: string;
  archetypeCount: number;
  items: BenchmarkItem[];
}

/** v1 items (no version field): only the fields the tooling still reads. */
export interface LegacyItem {
  id: string;
  archetype: string;
  text: Localized;
  options: Record<OptionLabel, string>;
  correct: OptionLabel;
  diagnoses: Partial<Record<OptionLabel, Localized>>;
}

export interface LegacyDataset {
  seed: number;
  items: LegacyItem[];
}

export interface BuiltItem {
  item: BenchmarkItem;
  exercise: ResolvedExercise;
}

function buildItem(archetype: Archetype, index: number, rng: Rng): BuiltItem {
  const ex = resolveExercise(archetype, rng);
  const shuffled = rng.shuffle([
    { value: ex.correct, miss: null as ResolvedExercise["distractors"][number] | null },
    ...ex.distractors.map((d) => ({ value: d.value, miss: d })),
  ]);

  const options = {} as Record<OptionLabel, string>;
  const diagnoses: Partial<Record<OptionLabel, Localized>> = {};
  const misconceptions: Partial<Record<OptionLabel, ItemMisconception>> = {};
  let correct: OptionLabel = "A";
  shuffled.forEach((entry, i) => {
    const label = OPTION_LABELS[i]!;
    options[label] = entry.value;
    if (!entry.miss) {
      correct = label;
      return;
    }
    diagnoses[label] = entry.miss.diagnosis;
    misconceptions[label] = { id: entry.miss.id, type: entry.miss.type };
  });

  const category = categoryOf(archetype.id);
  return {
    exercise: ex,
    item: {
      id: `${archetype.id}-${String(index).padStart(3, "0")}`,
      archetype: archetype.id,
      category,
      family: category,
      difficulty: ex.difficulty,
      params: ex.params,
      text: ex.text,
      options,
      correct,
      explanation: ex.explanation,
      diagnoses,
      misconceptions,
      pool: ex.pool.map((c) => ({ id: c.id, type: c.type, value: c.value })),
    },
  };
}

/** Builds `perArchetype` items for each of the 24 archetypes, equal weight per archetype. */
export function buildDatasetWithExercises(
  seed: number,
  perArchetype: number,
): { dataset: BenchmarkDataset; built: BuiltItem[] } {
  const rng = createRng(seed);
  const built: BuiltItem[] = [];
  ALL_ARCHETYPES.forEach((archetype) => {
    for (let i = 0; i < perArchetype; i += 1) built.push(buildItem(archetype, built.length, rng));
  });
  return {
    built,
    dataset: {
      version: DATASET_VERSION,
      engineVersion: ENGINE_VERSION,
      seed,
      createdAt: new Date().toISOString(),
      archetypeCount: ALL_ARCHETYPES.length,
      items: built.map((b) => b.item),
    },
  };
}

export function buildDataset(seed: number, perArchetype: number): BenchmarkDataset {
  return buildDatasetWithExercises(seed, perArchetype).dataset;
}
