import type { TolcSection } from "@/types/tolc";

/**
 * CISIA TOLC-S structure (to be verified against the current official syllabus).
 */
export const tolcSections: TolcSection[] = [
  {
    id: "matematica",
    labelKey: "matematica",
    questionCount: 20,
    durationMinutes: 50,
    order: 1,
  },
  {
    id: "comprensione-testo",
    labelKey: "comprensioneTesto",
    questionCount: 10,
    durationMinutes: 20,
    order: 2,
  },
  {
    id: "ragionamento-problemi",
    labelKey: "ragionamentoProblemi",
    questionCount: 10,
    durationMinutes: 20,
    order: 3,
  },
  {
    id: "scienze-base",
    labelKey: "scienzeBase",
    questionCount: 10,
    durationMinutes: 20,
    order: 4,
  },
  {
    id: "inglese",
    labelKey: "inglese",
    questionCount: 30,
    durationMinutes: 15,
    order: 5,
  },
];
