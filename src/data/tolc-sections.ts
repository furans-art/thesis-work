import type { TolcSection } from "@/types/tolc";

/**
 * CISIA TOLC-S structure used by the app. Counts/durations for Ragionamento,
 * Biologia, Chimica and Fisica are placeholders to verify against the official syllabus.
 * Inglese runs after the main test.
 */
export const tolcSections: TolcSection[] = [
  { id: "matematica", labelKey: "matematica", questionCount: 20, durationMinutes: 50, order: 1 },
  { id: "ragionamento", labelKey: "ragionamento", questionCount: 10, durationMinutes: 20, order: 2 },
  { id: "biologia", labelKey: "biologia", questionCount: 5, durationMinutes: 10, order: 3 },
  { id: "chimica", labelKey: "chimica", questionCount: 5, durationMinutes: 10, order: 4 },
  { id: "fisica", labelKey: "fisica", questionCount: 5, durationMinutes: 10, order: 5 },
  { id: "scienze-terra", labelKey: "scienzeTerra", questionCount: 5, durationMinutes: 10, order: 6 },
  { id: "inglese", labelKey: "inglese", questionCount: 30, durationMinutes: 15, order: 7 },
];
