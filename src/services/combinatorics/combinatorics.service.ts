import { createRng, type Rng } from "./math-utils";
import { dispositionArchetypes } from "./archetypes/dispositions";
import { permutationArchetypes } from "./archetypes/permutations";
import { combinationArchetypes } from "./archetypes/combinations";
import { urnArchetypes } from "./archetypes/urns";
import { probabilityArchetypes } from "./archetypes/probability";
import { advancedArchetypes } from "./archetypes/advanced";
import { trombettaArchetypes } from "./archetypes/trombetta";
import type { Archetype, GeneratedExercise, Localized } from "./types";
import type { PracticeSectionId } from "@/types/tolc";
import type { Question } from "@/services/questionService";

export const COMBINATORICS_SECTION: PracticeSectionId = "matematica-combinatoria-probabilita";

const ARCHETYPES: Archetype[] = [
  ...dispositionArchetypes,
  ...permutationArchetypes,
  ...combinationArchetypes,
  ...urnArchetypes,
  ...probabilityArchetypes,
  ...advancedArchetypes,
  ...trombettaArchetypes,
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

/**
 * Selects three usable distractors, keeping each one's error diagnosis alive.
 * A distractor replaced by a fallback loses its diagnosis (undefined), because
 * the fallback value no longer corresponds to a known mistake.
 */
function pickDistractors(exercise: GeneratedExercise): {
  labels: string[];
  whys: (Localized | undefined)[];
} {
  const seen = new Set<string>([exercise.correct]);
  const labels: string[] = [];
  const whys: (Localized | undefined)[] = [];
  const rawWhys = exercise.diagnoses ?? [];

  const candidates = exercise.distractors.map((label, i) => ({ label, why: rawWhys[i] }));
  for (const { label, why } of candidates) {
    let value = label;
    let resolvedWhy: Localized | undefined = why;
    const { a, b } = parseValue(value);
    // a probability can never exceed 1: sums of probabilities may, so replace them
    if (b > 1 && a > b) {
      const fb = fallbackDistractors(exercise.correct).find((c) => !seen.has(c));
      if (!fb) continue;
      value = fb;
      resolvedWhy = undefined;
    }
    if (seen.has(value)) {
      const fb = fallbackDistractors(exercise.correct).find((c) => !seen.has(c));
      if (!fb) continue;
      value = fb;
      resolvedWhy = undefined;
    }
    seen.add(value);
    labels.push(value);
    whys.push(resolvedWhy);
    if (labels.length === 3) break;
  }
  // top-up if the archetype provided fewer than three usable distractors
  const fallbacks = fallbackDistractors(exercise.correct);
  let index = 0;
  while (labels.length < 3 && index < 20) {
    const fb = fallbacks[index];
    index += 1;
    if (fb === undefined || seen.has(fb)) continue;
    seen.add(fb);
    labels.push(fb);
    whys.push(undefined);
  }
  return { labels, whys };
}

function toQuestion(exercise: GeneratedExercise, index: number, rng: Rng): Question {
  const { labels, whys } = pickDistractors(exercise);
  const entries = rng.shuffle([
    { label: exercise.correct, correct: true, why: undefined as Localized | undefined },
    ...labels.map((label, i) => ({ label, correct: false, why: whys[i] })),
  ]);
  const hasDiagnoses = whys.some((w) => w !== undefined);
  return {
    id: `combinatoria-${exercise.archetype}-${index}-${rng.int(1000, 9999)}`,
    sectionId: COMBINATORICS_SECTION,
    text: exercise.text,
    options: entries.map((e) => ({ it: e.label, en: e.label })),
    correctIndex: entries.findIndex((e) => e.correct),
    explanation: exercise.explanation,
    ...(hasDiagnoses
      ? { rationales: entries.map((e) => (e.why ? { it: e.why.it, en: e.why.en } : null)) }
      : {}),
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
