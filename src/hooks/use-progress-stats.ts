import { useMemo } from "react";

import { tolcSections } from "@/data/tolc-sections";
import { mathematicsTopics } from "@/data/mathematics-topics";
import { accuracy } from "@/services/history.service";
import type { SessionRecord } from "@/types/history";
import type { PracticeSectionId } from "@/types/tolc";

export const WEAK_THRESHOLD = 60;

/** Derived chart data for the progress dashboard. */
export function useProgressStats(sessions: SessionRecord[]) {
  return useMemo(() => {
    const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));

    const line = sorted.map((s, i) => {
      const correct = s.sections.reduce((n, r) => n + r.correct, 0);
      const total = s.sections.reduce((n, r) => n + r.total, 0);
      const row: Record<string, number | string> = { n: i + 1, date: s.date, overall: accuracy({ correct, total }) };
      for (const r of s.sections) row[r.sectionId] = accuracy(r);
      return row;
    });

    const latest = sorted.at(-1);
    const bar = (latest?.sections ?? []).map((r) => ({ sectionId: r.sectionId, accuracy: accuracy(r) }));

    const agg = new Map<PracticeSectionId, { correct: number; total: number }>();
    for (const s of sorted)
      for (const r of s.sections) {
        const a = agg.get(r.sectionId) ?? { correct: 0, total: 0 };
        agg.set(r.sectionId, { correct: a.correct + r.correct, total: a.total + r.total });
      }
    const allSections = [...tolcSections, ...mathematicsTopics];
    const weak = allSections
      .filter((sec) => agg.has(sec.id))
      .map((sec) => ({ section: sec, accuracy: accuracy(agg.get(sec.id)!) }))
      .filter((w) => w.accuracy < WEAK_THRESHOLD);

    const practisedSections = allSections.filter((sec) => agg.has(sec.id));

    return { line, bar, weak, practisedSections, newestFirst: [...sorted].reverse() };
  }, [sessions]);
}
