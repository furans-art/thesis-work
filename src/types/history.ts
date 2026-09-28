import type { SimulationMode, SimulationTarget } from "@/types/settings";
import type { TolcSectionId } from "@/types/tolc";

export interface SectionResult {
  sectionId: TolcSectionId;
  correct: number;
  wrong: number;
  blank: number;
  total: number;
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
}
