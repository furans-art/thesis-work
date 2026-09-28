import { useCallback, useEffect, useState } from "react";

import type { RunPlan } from "@/services/simulation.service";
import type { SimulationSettings } from "@/types/settings";

/** State machine for a running simulation: answers, flags, timer, finish. */
export function useSimulationRun(plan: RunPlan, settings: SimulationSettings) {
  const total = plan.questions.length;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [finished, setFinished] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(settings.timeLimitMinutes * 60);

  useEffect(() => {
    if (finished) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setTimedOut(true);
          setFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [finished]);

  const q = plan.questions[index]!;
  const isLast = index === total - 1;

  const confirm = useCallback(() => {
    if (selected === null) return;
    setConfirmed(true);
    setAnswers((prev) => prev.map((a, i) => (i === index ? selected : a)));
  }, [selected, index]);

  const next = useCallback(() => {
    if (isLast) return setFinished(true);
    setIndex((i) => i + 1);
    setSelected(null);
    setConfirmed(false);
    setFeedbackOpen(false);
  }, [isLast]);

  const toggleFlag = useCallback(
    () =>
      setFlags((prev) => {
        const n = new Set(prev);
        if (n.has(q.id)) n.delete(q.id);
        else n.add(q.id);
        return n;
      }),
    [q.id],
  );

  const correctCount = plan.questions.filter((qq, i) => answers[i] === qq.correctIndex).length;

  return {
    q,
    index,
    total,
    isLast,
    selected,
    select: setSelected,
    confirmed,
    confirm,
    next,
    feedbackOpen,
    setFeedbackOpen,
    flagged: flags.has(q.id),
    toggleFlag,
    answers,
    correctCount,
    finished,
    timedOut,
    secondsLeft,
    blockIndex: q.blockIndex,
  };
}

export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
