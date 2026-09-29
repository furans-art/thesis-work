import type { Question } from "@/services/questionService";
import type { SimulationMode, SimulationTarget } from "@/types/settings";
import type { PracticeSectionId } from "@/types/tolc";

export interface SectionResult {
  sectionId: PracticeSectionId;
  correct: number;
  wrong: number;
  blank: number;
  total: number;
}

/**
 * The exact questions a session used, stored so the session can be retaken
 * identically — including questions generated live by the Logic API, which are
 * not part of any local pool.
 */
export interface SessionSnapshotBlock {
  sectionId: PracticeSectionId;
  questions: Question[];
}

export interface SessionRecord {
  id: string;
  /** ISO timestamp */
  date: string;
  target: SimulationTarget;
  mode: SimulationMode;
  durationSeconds: number;
  sections: SectionResult[];
  /** ids of questions answered wrong or left blank */
  wrongQuestionIds: string[];
  /** TOLC score: +1 correct, -0.25 wrong, 0 blank */
  score: number;
  /** Questions exactly as served; absent on sessions recorded before this feature. */
  snapshot?: SessionSnapshotBlock[];
}
