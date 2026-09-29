import { useEffect } from "react";

import type { useSimulationRun } from "@/hooks/use-simulation-run";

/**
 * Keyboard interaction for the run screen, as requested in the thesis review:
 * - ArrowUp / ArrowDown (and 1–4 / A–D) move the answer selection;
 * - Enter confirms the selected answer, then moves to the next question.
 * Keys are ignored while a dialog handles them (time-up / leave-section alerts).
 */
export function useRunKeyboard(
  run: ReturnType<typeof useSimulationRun>,
  optionCount: number,
  enabled: boolean,
): void {
  useEffect(() => {
    if (!enabled) return;

    const isTypingTarget = (el: EventTarget | null): boolean =>
      el instanceof HTMLElement &&
      (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (isTypingTarget(e.target)) return;
      if (run.timeUpPending || run.leavePending) return;

      if (e.key === "Enter") {
        e.preventDefault();
        if (run.confirmed) run.next();
        else if (run.selected !== null) run.confirm();
        return;
      }

      if (run.confirmed) return; // options are locked once the answer is confirmed

      const indexByKey: Record<string, number> = {};
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        run.select(run.selected === null ? 0 : (run.selected + 1) % optionCount);
        return;
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        run.select(run.selected === null ? optionCount - 1 : (run.selected - 1 + optionCount) % optionCount);
        return;
      }
      for (let i = 0; i < optionCount; i += 1) {
        indexByKey[String(i + 1)] = i;
        indexByKey["abcd"[i]!] = i;
        indexByKey["ABCD"[i]!] = i;
      }
      const picked = indexByKey[e.key];
      if (picked !== undefined) {
        e.preventDefault();
        run.select(picked);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [run, optionCount, enabled]);
}
