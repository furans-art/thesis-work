import { tolcSections } from "@/data/tolc-sections";
import { mathematicsTopics } from "@/data/mathematics-topics";
import { storage } from "@/services/storage";
import type { SimulationSettings, SimulationTarget } from "@/types/settings";

const key = (target: SimulationTarget) => `settings:${target}`;

export const MIN_QUESTIONS = 5;
export const MAX_SECTION_QUESTIONS = 30;
/** Thesis modules (live logic generator / future real banks) allow longer sessions. */
export const MAX_THESIS_QUESTIONS = 50;

export function isSimulationTarget(value: string): value is SimulationTarget {
  return value === "full" || [...tolcSections, ...mathematicsTopics].some((s) => s.id === value);
}

const findTarget = (target: SimulationTarget) =>
  [...tolcSections, ...mathematicsTopics].find((section) => section.id === target);

/** Upper bound for the question slider: 30 per section, 50 for thesis modules, official total for the full exam. */
export function maxQuestions(target: SimulationTarget): number {
  if (target === "full") return tolcSections.reduce((n, s) => n + s.questionCount, 0);
  if (isThesisModule(target)) return MAX_THESIS_QUESTIONS;
  return MAX_SECTION_QUESTIONS;
}

function officialQuestions(target: SimulationTarget): number {
  if (target === "full") return tolcSections.reduce((n, s) => n + s.questionCount, 0);
  return findTarget(target)?.questionCount ?? 20;
}

export function defaultSettings(target: SimulationTarget): SimulationSettings {
  const minutes =
    target === "full"
      ? tolcSections.reduce((n, s) => n + s.durationMinutes, 0)
      : (findTarget(target)?.durationMinutes ?? 20);
  return {
    mode: "practice",
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
