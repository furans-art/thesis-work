import { tolcSections } from "@/data/tolc-sections";
import type { TolcSection, TolcSectionId } from "@/types/tolc";

/**
 * Data-access layer for TOLC-S structure. Currently reads local seed data;
 * swap the body for a fetch call when a backend is added.
 */
export const sectionsService = {
  async list(): Promise<TolcSection[]> {
    return [...tolcSections].sort((a, b) => a.order - b.order);
  },

  async getById(id: TolcSectionId): Promise<TolcSection | undefined> {
    return tolcSections.find((s) => s.id === id);
  },

  totalQuestions(): number {
    return tolcSections.reduce((sum, s) => sum + s.questionCount, 0);
  },

  totalDuration(): number {
    return tolcSections.reduce((sum, s) => sum + s.durationMinutes, 0);
  },
};
