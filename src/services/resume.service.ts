import { storage } from "@/services/storage";
import type { RunPlan } from "@/services/simulation.service";
import type { SimulationSettings, SimulationTarget } from "@/types/settings";

/** Progress of an unfinished run, saved after every change so it can be resumed. */
export interface ResumeState {
  version: 1;
  target: SimulationTarget;
  plan: RunPlan;
  settings: SimulationSettings;
  index: number;
  answers: (number | null)[];
  flags: string[];
  minBlock: number;
  elapsed: number;
  blockSecondsLeft: number;
  savedAt: string;
}

const key = (target: SimulationTarget) => `tolcs.resume.${target}`;

export const resumeService = {
  load(target: SimulationTarget): ResumeState | null {
    const raw = storage.getRaw(key(target));
    if (!raw) return null;
    try {
      const s = JSON.parse(raw) as ResumeState;
      if (s.version !== 1 || !s.plan?.questions?.length) return null;
      return s;
    } catch {
      return null;
    }
  },
  save(state: ResumeState): void {
    storage.set(key(state.target), state);
  },
  clear(target: SimulationTarget): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key(target));
    } catch {
      /* ignore */
    }
  },
};
