import { useCallback, useEffect, useRef, useState } from "react";

import type { RunPlan } from "@/services/simulation.service";
import type { SimulationSettings } from "@/types/settings";

export const AUTO_ADVANCE_SECONDS = 10;

/**
 * State machine for a running simulation.
 * - practice: free navigation, elapsed-time clock, no time pressure.
 * - exam: per-section countdown, sections lock once left, auto-advance on timeout.
 */
export interface RunProgress {
  index: number;
  answers: (number | null)[];
  flags: string[];
  minBlock: number;
  elapsed: number;
  blockSecondsLeft: number;
}

export function useSimulationRun(
  plan: RunPlan,
  settings: SimulationSettings,
  onFinish?: (answers: (number | null)[], elapsedSeconds: number) => void,
  persistence?: { initial?: RunProgress | null; save: (p: RunProgress) => void; clear: () => void },
) {
  const exam = settings.mode === "exam";
  const total = plan.questions.length;
  const blockDuration = useCallback(
    (b: number) =>
      (plan.blocks.length > 1 ? plan.blocks[b]!.section.durationMinutes : settings.timeLimitMinutes) * 60,
    [plan.blocks, settings.timeLimitMinutes],
  );
  const init = persistence?.initial ?? null;

  const [index, setIndex] = useState(init?.index ?? 0);
  const [draft, setDraft] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(() => init?.answers ?? Array(total).fill(null));
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [flags, setFlags] = useState<Set<string>>(() => new Set(init?.flags ?? []));
  const [finished, setFinished] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [minBlock, setMinBlock] = useState(init?.minBlock ?? 0);
  const [elapsed, setElapsed] = useState(init?.elapsed ?? 0);
  const [blockSecondsLeft, setBlockSecondsLeft] = useState(() => init?.blockSecondsLeft ?? blockDuration(0));
  const [timeUpPending, setTimeUpPending] = useState(false);
  const [autoAdvanceIn, setAutoAdvanceIn] = useState(AUTO_ADVANCE_SECONDS);
  const [leavePending, setLeavePending] = useState(false);

  // Persist progress so an interrupted run can be resumed later.
  const persistRef = useRef(persistence);
  persistRef.current = persistence;
  useEffect(() => {
    const p = persistRef.current;
    if (!p) return;
    if (finished) {
      p.clear();
      return;
    }
    p.save({ index, answers, flags: [...flags], minBlock, elapsed, blockSecondsLeft });
  }, [index, answers, flags, minBlock, elapsed, blockSecondsLeft, finished]);

  const q = plan.questions[index]!;
  const blockIndex = q.blockIndex;
  const isLast = index === total - 1;

  const finish = useCallback((byTimeout = false) => {
    if (byTimeout) setTimedOut(true);
    setFinished(true);
  }, []);

  const moveTo = useCallback((i: number) => {
    setIndex(i);
    setDraft(null);
    setFeedbackOpen(false);
  }, []);

  const advanceBlock = useCallback(() => {
    setTimeUpPending(false);
    setLeavePending(false);
    const nb = blockIndex + 1;
    if (nb >= plan.blocks.length) return finish();
    const first = plan.questions.findIndex((qq) => qq.blockIndex === nb);
    setMinBlock(nb);
    setBlockSecondsLeft(blockDuration(nb));
    moveTo(first);
  }, [blockIndex, plan.blocks.length, plan.questions, blockDuration, finish, moveTo]);

  // Main clock
  useEffect(() => {
    if (finished || timeUpPending) return;
    const id = window.setInterval(() => {
      setElapsed((e) => e + 1);
      if (exam) setBlockSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [finished, timeUpPending, exam]);

  // Section time expired
  useEffect(() => {
    if (!exam || finished || blockSecondsLeft > 0) return;
    if (blockIndex >= plan.blocks.length - 1) finish(true);
    else {
      setLeavePending(false);
      setAutoAdvanceIn(AUTO_ADVANCE_SECONDS);
      setTimeUpPending(true);
    }
  }, [exam, finished, blockSecondsLeft, blockIndex, plan.blocks.length, finish]);

  // Auto-advance countdown while the time-up warning is shown
  useEffect(() => {
    if (!timeUpPending) return;
    if (autoAdvanceIn <= 0) {
      advanceBlock();
      return;
    }
    const id = window.setTimeout(() => setAutoAdvanceIn((n) => n - 1), 1000);
    return () => window.clearTimeout(id);
  }, [timeUpPending, autoAdvanceIn, advanceBlock]);

  // Report once
  const reported = useRef(false);
  useEffect(() => {
    if (finished && !reported.current) {
      reported.current = true;
      onFinish?.(answers, elapsed);
    }
  }, [finished, answers, elapsed, onFinish]);

  const confirmed = answers[index] !== null;
  const selected = confirmed ? answers[index]! : draft;

  const confirm = useCallback(() => {
    if (draft === null) return;
    setAnswers((prev) => prev.map((a, i) => (i === index ? draft : a)));
  }, [draft, index]);

  const next = useCallback(() => {
    if (isLast) return finish();
    const nextQ = plan.questions[index + 1]!;
    if (exam && nextQ.blockIndex !== blockIndex) return setLeavePending(true);
    moveTo(index + 1);
  }, [isLast, finish, plan.questions, index, exam, blockIndex, moveTo]);

  const canPrev = index > 0 && (!exam || plan.questions[index - 1]!.blockIndex >= minBlock);
  const prev = useCallback(() => {
    if (canPrev) moveTo(index - 1);
  }, [canPrev, index, moveTo]);

  const toggleFlag = useCallback(
    () =>
      setFlags((p) => {
        const n = new Set(p);
        if (n.has(q.id)) n.delete(q.id);
        else n.add(q.id);
        return n;
      }),
    [q.id],
  );

  const correctCount = plan.questions.filter((qq, i) => answers[i] === qq.correctIndex).length;
  const wrongCount = plan.questions.filter((qq, i) => answers[i] !== null && answers[i] !== qq.correctIndex).length;

  return {
    exam,
    q,
    index,
    total,
    isLast,
    selected,
    select: setDraft,
    confirmed,
    confirm,
    next,
    prev,
    canPrev,
    feedbackOpen,
    setFeedbackOpen,
    flagged: flags.has(q.id),
    toggleFlag,
    answers,
    correctCount,
    wrongCount,
    finished,
    timedOut,
    elapsed,
    blockSecondsLeft,
    blockIndex,
    timeUpPending,
    autoAdvanceIn,
    advanceBlock,
    leavePending,
    cancelLeave: () => setLeavePending(false),
    finish,
  };
}

export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
