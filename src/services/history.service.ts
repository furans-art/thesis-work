import { STORAGE_KEYS, storage } from "@/services/storage";
import type { RunPlan } from "@/services/simulation.service";
import type { SectionResult, SessionRecord } from "@/types/history";
import type { SimulationMode, SimulationTarget } from "@/types/settings";


const listeners = new Set<() => void>();
let version = 0;
let cache: SessionRecord[] | null = null;

function read(): SessionRecord[] {
  if (cache) return cache;
  const raw = storage.getRaw(STORAGE_KEYS.history);
  try {
    cache = raw ? (JSON.parse(raw) as SessionRecord[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

export function tolcScore(correct: number, wrong: number): number {
  return correct - wrong * 0.25;
}

export function accuracy(r: { correct: number; total: number }): number {
  return r.total === 0 ? 0 : Math.round((r.correct / r.total) * 100);
}

/** Summarise a finished run into a session record. */
export function buildRecord(input: {
  target: SimulationTarget;
  mode: SimulationMode;
  plan: RunPlan;
  answers: (number | null)[];
  durationSeconds: number;
}): SessionRecord {
  const sections: SectionResult[] = input.plan.blocks.map((b) => ({
    sectionId: b.section.id,
    correct: 0,
    wrong: 0,
    blank: 0,
    total: b.questions.length,
  }));
  const wrongQuestionIds: string[] = [];
  input.plan.questions.forEach((q, i) => {
    const a = input.answers[i] ?? null;
    const s = sections[q.blockIndex]!;
    if (a === null) {
      s.blank += 1;
      wrongQuestionIds.push(q.id);
    } else if (a === q.correctIndex) s.correct += 1;
    else {
      s.wrong += 1;
      wrongQuestionIds.push(q.id);
    }
  });
  const correct = sections.reduce((n, s) => n + s.correct, 0);
  const wrong = sections.reduce((n, s) => n + s.wrong, 0);
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
    target: input.target,
    mode: input.mode,
    durationSeconds: input.durationSeconds,
    sections,
    wrongQuestionIds: Array.from(new Set(wrongQuestionIds)),
    score: tolcScore(correct, wrong),
    snapshot: input.plan.blocks.map((b) => ({
      sectionId: b.section.id,
      questions: b.questions,
    })),
  };
}

export const historyService = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  version: () => version,
  list(): SessionRecord[] {
    return read();
  },
  get(id: string): SessionRecord | undefined {
    return read().find((r) => r.id === id);
  },
  add(record: SessionRecord): void {
    cache = [...read(), record];
    storage.set(STORAGE_KEYS.history, cache);
    version += 1;
    listeners.forEach((l) => l());
  },
};
