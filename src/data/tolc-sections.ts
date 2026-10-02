import type { TolcSection } from "@/types/tolc";

/**
 * Official CISIA TOLC-S structure: 55 questions in 6 sections (120 min),
 * followed by a 30-question English section (15 min) — 85 questions, 135 min total.
 */
export const tolcSections: TolcSection[] = [
  { id: "matematica", labelKey: "matematica", questionCount: 20, durationMinutes: 50, order: 1 },
  { id: "ragionamento", labelKey: "ragionamento", questionCount: 15, durationMinutes: 30, order: 2 },
  { id: "biologia", labelKey: "biologia", questionCount: 5, durationMinutes: 10, order: 3 },
  { id: "chimica", labelKey: "chimica", questionCount: 5, durationMinutes: 10, order: 4 },
  { id: "fisica", labelKey: "fisica", questionCount: 5, durationMinutes: 10, order: 5 },
  { id: "scienze-terra", labelKey: "scienzeTerra", questionCount: 5, durationMinutes: 10, order: 6 },
  { id: "inglese", labelKey: "inglese", questionCount: 30, durationMinutes: 15, order: 7 },
];
