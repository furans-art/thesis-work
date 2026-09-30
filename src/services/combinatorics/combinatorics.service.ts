import { createRng, type Rng } from "./math-utils";
import { dispositionArchetypes } from "./archetypes/dispositions";
import { permutationArchetypes } from "./archetypes/permutations";
import { combinationArchetypes } from "./archetypes/combinations";
import { urnArchetypes } from "./archetypes/urns";
import { probabilityArchetypes } from "./archetypes/probability";
import type { Archetype, GeneratedExercise } from "./types";
import type { PracticeSectionId } from "@/types/tolc";
import type { Question } from "@/services/questionService";

export const COMBINATORICS_SECTION: PracticeSectionId = "matematica-combinatoria-probabilita";

const ARCHETYPES: Archetype[] = [
  ...dispositionArchetypes,
  ...permutationArchetypes,
  ...combinationArchetypes,
  ...urnArchetypes,
  ...probabilityArchetypes,
];

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
  while (y) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

/**
 * Backup distractors used when an archetype accidentally produces a value
 * equal to the correct answer or to another distractor. They stay plausible:
 * small perturbations of the correct value, always positive.
 */
function fallbackDistractors(correct: string): string[] {
  const { a, b } = parseValue(correct);
  if (b > 1) {
    return [a + 1, a - 1, a + 2, Math.max(a - 2, 0)]
      .filter((n) => n >= 0 && n < b)
      .map((n) => (n === 0 ? "0" : `${n / gcd2(n, b)}/${b / gcd2(n, b)}`));
  }
  return [a + 1, a - 1 > 0 ? a - 1 : a + 2, 2 * a, a + 3].map(String);
}

function uniqueDistractors(exercise: GeneratedExercise): string[] {
  const seen = new Set<string>([exercise.correct]);
  const out: string[] = [];
  for (const raw of exercise.distractors) {
    let value = raw;
    const { a, b } = parseValue(value);
    // a probability can never exceed 1: sums of probabilities may, so replace them
    if (b > 1 && a > b) {
      value = fallbackDistractors(exercise.correct).find((c) => !seen.has(c)) ?? value;
    }
    if (seen.has(value)) {
      const fallback = fallbackDistractors(exercise.correct).find((c) => !seen.has(c));
      if (!fallback) continue; // extremely unlikely: skip rather than duplicate
      value = fallback;
    }
    seen.add(value);
    out.push(value);
    if (out.length === 3) break;
  }
  // top-up if the archetype provided fewer than three usable distractors
  let index = 0;
  while (out.length < 3) {
    const fallback = fallbackDistractors(exercise.correct)[index];
    if (fallback === undefined || seen.has(fallback)) {
      index += 1;
      if (index > 20) break;
      continue;
    }
    seen.add(fallback);
    out.push(fallback);
    index += 1;
  }
  return out;
}

function toQuestion(exercise: GeneratedExercise, index: number, rng: Rng): Question {
  const distractors = uniqueDistractors(exercise);
  const entries = rng.shuffle([
    { label: exercise.correct, correct: true },
    ...distractors.map((label) => ({ label, correct: false })),
  ]);
  return {
    id: `combinatoria-${exercise.archetype}-${index}-${rng.int(1000, 9999)}`,
    sectionId: COMBINATORICS_SECTION,
    text: exercise.text,
    options: entries.map((e) => ({ it: e.label, en: e.label })),
    correctIndex: entries.findIndex((e) => e.correct),
    explanation: exercise.explanation,
  };
}

export const combinatoricsService = {
  isEnabled(sectionId: PracticeSectionId): boolean {
    return sectionId === COMBINATORICS_SECTION;
  },
  /** Fully randomized questions for the thesis module, archetype round-robin. */
  generateQuestions(sectionId: PracticeSectionId, count: number): Question[] {
    if (!combinatoricsService.isEnabled(sectionId) || count <= 0) return [];
    const rng = createRng();
    const order = rng.shuffle(ARCHETYPES);
    const out: Question[] = [];
    let index = 0;
    while (out.length < count) {
      const archetype = order[index % order.length]!;
      out.push(toQuestion(archetype.generate(rng), out.length, rng));
      index += 1;
    }
    return out;
  },
};
