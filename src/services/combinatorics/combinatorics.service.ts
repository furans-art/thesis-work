import { createRng, type Rng } from "./math-utils";
import { dispositionArchetypes } from "./archetypes/dispositions";
import { permutationArchetypes } from "./archetypes/permutations";
import { combinationArchetypes } from "./archetypes/combinations";
import { urnArchetypes } from "./archetypes/urns";
import { probabilityArchetypes } from "./archetypes/probability";
import { advancedArchetypes } from "./archetypes/advanced";
import { trombettaArchetypes } from "./archetypes/trombetta";
import type { Archetype, Localized, ResolvedExercise } from "./types";
import { ENGINE_VERSION, resolveExercise } from "./engine";
import type { PracticeSectionId } from "@/types/tolc";
import type { Question } from "@/services/questionService";

export const COMBINATORICS_SECTION: PracticeSectionId = "matematica-combinatoria-probabilita";

export const ARCHETYPES: Archetype[] = [
  ...dispositionArchetypes,
  ...permutationArchetypes,
  ...combinationArchetypes,
  ...urnArchetypes,
  ...probabilityArchetypes,
  ...advancedArchetypes,
  ...trombettaArchetypes,
];

/** Shuffles the correct answer with the three engine-selected, diagnosed distractors. */
function toQuestion(exercise: ResolvedExercise, index: number, rng: Rng): Question {
  const entries = rng.shuffle([
    { label: exercise.correct, correct: true, why: null as Localized | null },
    ...exercise.distractors.map((d) => ({ label: d.value, correct: false, why: d.diagnosis })),
  ]);
  return {
    id: `combinatoria-${exercise.archetype}-${index}-${rng.int(1000, 9999)}`,
    sectionId: COMBINATORICS_SECTION,
    text: exercise.text,
    options: entries.map((e) => ({ it: e.label, en: e.label })),
    correctIndex: entries.findIndex((e) => e.correct),
    explanation: exercise.explanation,
    rationales: entries.map((e) => (e.why ? { it: e.why.it, en: e.why.en } : null)),
    engineVersion: ENGINE_VERSION,
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
      out.push(toQuestion(resolveExercise(archetype, rng), out.length, rng));
      index += 1;
    }
    return out;
  },
};
