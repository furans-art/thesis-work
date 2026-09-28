import type { TolcSectionId } from "@/types/tolc";

export type SimulationTarget = TolcSectionId | "full";
export type ExplanationMode = "after-each" | "end" | "never";
export type Difficulty = "easy" | "medium" | "hard" | "all";
export type SimulationMode = "practice" | "exam";

export interface SimulationSettings {
  mode: SimulationMode;
  questionCount: number;
  timeLimitMinutes: number;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  explanationMode: ExplanationMode;
  showTimer: boolean;
  difficulty: Difficulty;
}
