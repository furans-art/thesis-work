import type { Locale } from "@/types/i18n";

export type Localized = Record<Locale, string>;

export type CombinatoricsDifficulty = "base" | "intermediate" | "advanced";

/** Thesis taxonomy of combinatorial misconceptions (Chapter 4). */
export const MISCONCEPTION_TYPES = [
  "order-irrelevant",
  "repetition",
  "labelled-groups",
  "constraint-ignored",
  "constraint-applied-once",
  "additive-union",
  "inclusion-exclusion-truncated",
  "complement-ignored",
  "conditioning-inverted",
  "circular-as-linear",
  "other",
] as const;

export type MisconceptionType = (typeof MISCONCEPTION_TYPES)[number];

/**
 * One wrong answer produced by applying a named misconception. Every field is
 * required: a distractor without id, type or bilingual diagnosis does not compile.
 */
export interface DistractorCandidate {
  /** stable misconception id, unique within the archetype */
  id: string;
  type: MisconceptionType;
  /** rendered value: positive integer or reduced fraction */
  value: string;
  diagnosis: Localized;
}

/** Parameters actually drawn, re-read by the brute-force oracle. */
export type ExerciseParams = Record<string, number | string>;

/** Raw archetype output, before the engine selects the three distractors. */
export interface GeneratedExercise {
  /** archetype that produced it, kept for traceability in the thesis */
  archetype: string;
  difficulty: CombinatoricsDifficulty;
  /** count → positive integer answers; probability → fractions in (0,1) */
  kind: "count" | "probability";
  params: ExerciseParams;
  text: Localized;
  /** rendered correct answer */
  correct: string;
  /** ordered misconception candidates, most typical first (≥ 4 where possible) */
  candidates: DistractorCandidate[];
  explanation: Localized;
}

/** Engine output: exactly three valid, distinct, diagnosed distractors. */
export interface ResolvedExercise extends Omit<GeneratedExercise, "candidates"> {
  distractors: [DistractorCandidate, DistractorCandidate, DistractorCandidate];
  /** full candidate pool, kept for traceability and benchmark analysis */
  pool: DistractorCandidate[];
}

export interface Archetype {
  id: string;
  difficulty: CombinatoricsDifficulty;
  generate(rng: import("./math-utils").Rng): GeneratedExercise;
}
