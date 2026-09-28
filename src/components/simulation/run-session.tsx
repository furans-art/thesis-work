import { Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronLeft, Clock, Flag, MessageCircleQuestion, XCircle } from "lucide-react";
import { useCallback } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";
import { useHistory } from "@/hooks/use-history";
import { useSectionLabel } from "@/hooks/use-section-label";
import { formatClock, useSimulationRun } from "@/hooks/use-simulation-run";
import { cn } from "@/lib/utils";
import { buildRecord, tolcScore } from "@/services/history.service";
import type { RunPlan } from "@/services/simulation.service";
import type { SimulationSettings, SimulationTarget } from "@/types/settings";

const LETTERS = ["A", "B", "C", "D"];

export interface RunSessionProps {
  /** null for a wrong-answers review session (not recorded in history) */
  target: SimulationTarget | null;
  plan: RunPlan;
  settings: SimulationSettings;
  onRetry: () => void;
}

export function RunSession(props: RunSessionProps) {
  const { plan, settings, target } = props;
  const { t, locale } = useI18n();
  const label = useSectionLabel();
  const history = useHistory();

  const onFinish = useCallback(
    (answers: (number | null)[], elapsed: number) => {
      if (target === null) return;
      history.add(buildRecord({ target, mode: settings.mode, plan, answers, durationSeconds: elapsed }));
    },
    [target, settings.mode, plan, history],
  );

  const run = useSimulationRun(plan, settings, onFinish);
  const { q, index, total, selected, confirmed, exam } = run;
  const isCorrect = confirmed && selected === q.correctIndex;
  const multiBlock = plan.blocks.length > 1;
  const block = plan.blocks[run.blockIndex]!;
  const feedbackAllowed = !exam && settings.explanationMode === "after-each";
  const nextIsNewSection = exam && !run.isLast && plan.questions[index + 1]!.blockIndex !== run.blockIndex;
  const clockSeconds = exam ? run.blockSecondsLeft : run.elapsed;

  if (run.finished) {
    return (
      <RunReview
        {...props}
        answers={run.answers}
        correctCount={run.correctCount}
        wrongCount={run.wrongCount}
        elapsed={run.elapsed}
        timedOut={run.timedOut}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
      {plan.available < plan.requested && index === 0 && (
        <p className="mb-3 rounded-md border border-border bg-muted px-4 py-2 text-sm text-muted-foreground">
          {t.run.capped
            .replace("{requested}", String(plan.requested))
            .replace("{available}", String(plan.available))}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3">
        <div>
          {multiBlock && (
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              {t.run.section} {run.blockIndex + 1} {t.run.of} {plan.blocks.length}
            </p>
          )}
          <h1 className="font-serif text-lg font-semibold">
            {target === null ? `${t.run.reviewSession} · ` : ""}
            {label(block.section.labelKey)}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {settings.showTimer && (
            <span
              className="inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums"
              aria-label={`${exam ? t.run.sectionTimeLeft : t.run.elapsed}: ${formatClock(clockSeconds)}`}
              role="timer"
            >
              <Clock aria-hidden="true" className="size-4" />
              {formatClock(clockSeconds)}
            </span>
          )}
          {exam && (
            // Announced once per minute, not every second.
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              {t.run.minutesLeft.replace("{n}", String(Math.ceil(run.blockSecondsLeft / 60)))}
            </span>
          )}
          <span className="text-sm text-muted-foreground" aria-live="polite">
            {t.run.progress} {index + 1} / {total}
          </span>
          <Button
            variant={run.flagged ? "accent" : "outline"}
            size="sm"
            onClick={run.toggleFlag}
            aria-pressed={run.flagged}
            aria-label={t.run.flagAria}
          >
            <Flag aria-hidden="true" />
            {run.flagged ? t.run.flagged : t.run.flag}
          </Button>
        </div>
      </div>

      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={t.run.progress}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={index + 1}
      >
        <div className="h-full bg-primary transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <section className="mt-8" aria-labelledby="question-text">
        <p id="question-text" className="text-xl leading-relaxed">{q.text[locale]}</p>

        <div role="radiogroup" aria-labelledby="question-text" className="mt-6 grid gap-3">
          {q.options.map((opt, i) => {
            const isSel = selected === i;
            const reveal = confirmed && !exam;
            const showCorrect = reveal && i === q.correctIndex;
            const showWrong = reveal && isSel && i !== q.correctIndex;
            const lockedSel = confirmed && exam && isSel;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={isSel}
                disabled={confirmed}
                onClick={() => run.select(i)}
                className={cn(
                  "flex items-center gap-4 rounded-md border-2 bg-card p-4 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  !confirmed && "hover:border-primary/60",
                  (!confirmed || lockedSel) && isSel && "border-primary bg-primary/10",
                  !confirmed && !isSel && "border-border",
                  showCorrect && "border-success bg-success/10",
                  showWrong && "border-destructive bg-destructive/10",
                  confirmed && !showCorrect && !showWrong && !lockedSel && "border-border opacity-70",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border font-semibold",
                    isSel && (!confirmed || lockedSel) && "border-primary bg-primary text-primary-foreground",
                    showCorrect && "border-success bg-success text-success-foreground",
                    showWrong && "border-destructive bg-destructive text-destructive-foreground",
                  )}
                >
                  {LETTERS[i]}
                </span>
                <span className="flex-1">{opt[locale]}</span>
                {showCorrect && <CheckCircle2 aria-label={t.run.correct} className="text-success" />}
                {showWrong && <XCircle aria-label={t.run.wrong} className="text-destructive" />}
              </button>
            );
          })}
        </div>

        {confirmed && (
          <p
            role="status"
            className={cn(
              "mt-5 font-semibold",
              exam ? "text-foreground" : isCorrect ? "text-success" : "text-destructive",
            )}
          >
            {exam ? t.run.recorded : isCorrect ? t.run.correct : t.run.wrong}
          </p>
        )}

        {confirmed && !isCorrect && run.feedbackOpen && feedbackAllowed && (
          <Card className="mt-4 border-accent/40" role="region" aria-labelledby="feedback-title">
            <CardContent className="space-y-3 p-5">
              <h2 id="feedback-title" className="font-semibold">{t.run.feedbackTitle}</h2>
              <p className="leading-relaxed">{q.explanation[locale]}</p>
              <Button variant="ghost" size="sm" onClick={() => run.setFeedbackOpen(false)}>
                {t.run.close}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {run.canPrev && (
            <Button size="lg" variant="ghost" onClick={run.prev}>
              <ChevronLeft aria-hidden="true" />
              {t.run.previous}
            </Button>
          )}
          {!confirmed && selected !== null && (
            <Button size="lg" onClick={run.confirm}>
              {t.run.confirm}
            </Button>
          )}
          {confirmed && !isCorrect && !run.feedbackOpen && feedbackAllowed && (
            <Button size="lg" variant="outline" onClick={() => run.setFeedbackOpen(true)}>
              <MessageCircleQuestion aria-hidden="true" />
              {t.run.askFeedback}
            </Button>
          )}
          <Button size="lg" variant={confirmed ? "accent" : "outline"} onClick={run.next}>
            {run.isLast ? t.run.finish : nextIsNewSection ? t.run.nextSection : confirmed ? t.run.next : t.run.skip}
          </Button>
        </div>
      </section>

      <AlertDialog open={run.leavePending} onOpenChange={(o) => !o && run.cancelLeave()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.run.leaveTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.run.leaveBody}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.run.stay}</AlertDialogCancel>
            <AlertDialogAction onClick={run.advanceBlock}>{t.run.continue}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={run.timeUpPending}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.run.timeUpTitle}</AlertDialogTitle>
            <AlertDialogDescription aria-live="polite">
              {t.run.timeUpBody.replace("{n}", String(run.autoAdvanceIn))}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={run.advanceBlock}>{t.run.continue}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RunReview(
  props: RunSessionProps & {
    answers: (number | null)[];
    correctCount: number;
    wrongCount: number;
    elapsed: number;
    timedOut: boolean;
  },
) {
  const { t, locale } = useI18n();
  const label = useSectionLabel();
  const showExplanations = props.settings.explanationMode !== "never";
  const exam = props.settings.mode === "exam";
  const score = tolcScore(props.correctCount, props.wrongCount);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-14">
      <Card>
        <CardContent className="space-y-4 p-8">
          <h1 className="text-3xl font-semibold">{t.run.done}</h1>
          <div role="status" aria-live="polite" className="space-y-2">
            {props.timedOut && <p className="text-destructive">{t.run.timeUp}</p>}
            <p className="text-lg">
              {t.run.score}: <strong>{props.correctCount} / {props.plan.questions.length}</strong>
            </p>
            {exam && (
              <p className="text-lg">
                {t.run.examScore}: <strong>{score.toLocaleString(locale)}</strong>{" "}
                <span className="text-sm text-muted-foreground">({t.run.scoringRule})</span>
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {t.run.timeTaken}: {formatClock(props.elapsed)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="accent" onClick={props.onRetry}>{t.run.retry}</Button>
            {props.target !== null ? (
              <Button variant="outline" asChild>
                <Link to="/simulation/settings/$sectionId" params={{ sectionId: props.target }}>
                  {t.run.editSettings}
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/history">{t.history.back}</Link>
              </Button>
            )}
            <Button variant="ghost" asChild>
              <Link to="/simulation">{t.run.backToSimulation}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold">{t.run.reviewTitle}</h2>
      <ol className="space-y-4">
        {props.plan.questions.map((q, i) => {
          const answer = props.answers[i] ?? null;
          const ok = answer === q.correctIndex;
          return (
            <li key={`${q.id}-${i}`}>
              <Card className={cn("border-2", ok ? "border-success/60" : "border-destructive/60")}>
                <CardContent className="space-y-2 p-5">
                  {props.plan.blocks.length > 1 && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {label(props.plan.blocks[q.blockIndex]!.section.labelKey)}
                    </p>
                  )}
                  <p className="font-medium">
                    {i + 1}. {q.text[locale]}
                  </p>
                  <p className={ok ? "text-success" : "text-destructive"}>
                    {ok ? <CheckCircle2 aria-label={t.run.correct} className="me-1 inline size-4" /> : <XCircle aria-label={t.run.wrong} className="me-1 inline size-4" />}
                    {t.run.yourAnswer}:{" "}
                    {answer === null ? t.run.noAnswer : `${LETTERS[answer]} — ${q.options[answer]![locale]}`}
                  </p>
                  {!ok && (
                    <p>
                      {t.run.correctAnswer}: {LETTERS[q.correctIndex]} — {q.options[q.correctIndex]![locale]}
                    </p>
                  )}
                  {showExplanations && (
                    <p className="text-sm text-muted-foreground">
                      <strong>{t.run.explanation}:</strong> {q.explanation[locale]}
                    </p>
                  )}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
