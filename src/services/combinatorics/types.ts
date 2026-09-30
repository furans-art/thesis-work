import type { Locale } from "@/types/i18n";

export type Localized = Record<Locale, string>;

export type CombinatoricsDifficulty = "base" | "intermediate" | "advanced";

/** One generated exercise, before options are shuffled into a Question. */
export interface GeneratedExercise {
  /** archetype that produced it, kept for traceability in the thesis */
  archetype: string;
  difficulty: CombinatoricsDifficulty;
  text: Localized;
  /** rendered correct answer */
  correct: string;
  /** exactly three plausible wrong answers, each modelling a typical mistake */
  distractors: string[];
  explanation: Localized;
}

export interface Archetype {
  id: string;
  difficulty: CombinatoricsDifficulty;
  generate(rng: import("./math-utils").Rng): GeneratedExercise;
}
