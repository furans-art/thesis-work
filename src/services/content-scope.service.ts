import type { SimulationTarget } from "@/types/settings";

/**
 * Targets whose question bank is developed in full for this thesis.
 * Every other target only carries illustrative sample questions used to
 * reproduce the structure of the official TOLC-S exam.
 */
const THESIS_MODULES = new Set<string>(["matematica-ragionare", "matematica-combinatoria-probabilita"]);

export const contentScopeService = {
  isThesisModule(target: SimulationTarget): boolean {
    return THESIS_MODULES.has(target);
  },
  isSampleOnly(target: SimulationTarget): boolean {
    return !THESIS_MODULES.has(target);
  },
};
