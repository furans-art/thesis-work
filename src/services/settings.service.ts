import { tolcSections } from "@/data/tolc-sections";
import { storage } from "@/services/storage";
import type { SimulationSettings, SimulationTarget } from "@/types/settings";

const key = (target: SimulationTarget) => `settings:${target}`;

export const MIN_QUESTIONS = 5;
export const MAX_SECTION_QUESTIONS = 30;

export function isSimulationTarget(value: string): value is SimulationTarget {
  return value === "full" || tolcSections.some((s) => s.id === value);
}

/** Upper bound for the question slider: 30 per section, official total for the full exam. */
export function maxQuestions(target: SimulationTarget): number {
  if (target === "full") return tolcSections.reduce((n, s) => n + s.questionCount, 0);
  return MAX_SECTION_QUESTIONS;
}

function officialQuestions(target: SimulationTarget): number {
  if (target === "full") return tolcSections.reduce((n, s) => n + s.questionCount, 0);
  return tolcSections.find((s) => s.id === target)?.questionCount ?? 20;
}

export function defaultSettings(target: SimulationTarget): SimulationSettings {
  const minutes =
    target === "full"
      ? tolcSections.reduce((n, s) => n + s.durationMinutes, 0)
      : (tolcSections.find((s) => s.id === target)?.durationMinutes ?? 20);
  return {
    questionCount: Math.max(MIN_QUESTIONS, officialQuestions(target)),
    timeLimitMinutes: minutes,
    shuffleQuestions: false,
    shuffleAnswers: false,
    explanationMode: "after-each",
    showTimer: true,
    difficulty: "all",
  };
}

// Tiny external store so every component re-renders after a save.
const listeners = new Set<() => void>();
let version = 0;
const emit = () => {
  version += 1;
  listeners.forEach((l) => l());
};

export const settingsService = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  version: () => version,

  hasSaved(target: SimulationTarget): boolean {
    return storage.getRaw(key(target)) !== null;
  },

  get(target: SimulationTarget): SimulationSettings {
    const s = storage.get(key(target), defaultSettings(target));
    const max = maxQuestions(target);
    return { ...s, questionCount: Math.min(Math.max(s.questionCount, MIN_QUESTIONS), max) };
  },

  save(target: SimulationTarget, patch: Partial<SimulationSettings>): SimulationSettings {
    const next = { ...settingsService.get(target), ...patch };
    storage.set(key(target), next);
    emit();
    return next;
  },

  reset(target: SimulationTarget): void {
    storage.remove(key(target));
    emit();
  },
};
