import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Flag, Lightbulb, SkipForward } from "lucide-react";

import { ScopeBadge } from "@/components/simulation/scope-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/context/i18n-context";
import { useRunKeyboard } from "@/hooks/use-run-keyboard";
import { useSimulationRun, formatClock } from "@/hooks/use-simulation-run";
import { contentScopeService } from "@/services/content-scope.service";
import { buildRecord, historyService } from "@/services/history.service";
import type { RunPlan } from "@/services/simulation.service";
import type { SimulationSettings, SimulationTarget } from "@/types/settings";

export interface RunSessionProps {
  /** null = review/practice-only session: it is not recorded in history */
  target: SimulationTarget | null;
  plan: RunPlan;
  settings: SimulationSettings;
  onRetry?: (() => void) | undefined;
}

export function RunSession({ target, plan, settings, onRetry }: RunSessionProps) {
  const [runKey, setRunKey] = useState(0);
  return (
    <RunInner
      key={runKey}
      target={target}
      plan={plan}
      settings={settings}
      onRetry={onRetry}
      onRetake={() => setRunKey((k) => k + 1)}
    />
  );
}

interface RunInnerProps {
  target: SimulationTarget | null;
  plan: RunPlan;
  settings: SimulationSettings;
  onRetry?: (() => void) | undefined;
  onRetake: () => void;
}

function RunInner({ target, plan, settings, onRetake }: RunInnerProps) {
  const { t, locale } = useI18n();
  const run = useSimulationRun(plan, settings, (answers, elapsed) => {
    if (target === null) return; // review sessions are never recorded
    historyService.add(
      buildRecord({
        target,
        mode: settings.mode,
        plan,
        answers,
        durationSeconds: elapsed,
      }),
    );
  });
  useRunKeyboard(run, run.q.options.length, !run.finished);

  if (run.finished) {
    return (
      <FinishScreen
        run={run}
        target={target}
        settings={settings}
        onRetake={onRetake}
      />
    );
  }

  const exam = run.exam;
  const showTimer = settings.showTimer || exam;
  const answered = run.confirmed;
  const isCorrect = answered && run.selected === run.q.correctIndex;
  const canAskFeedback = answered && !exam && settings.explanationMode !== "never";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Top bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {target !== null && <ScopeBadge target={target} />}
            <Badge variant="outline">
              {t.run.progress} {run.index + 1} {t.run.of} {run.total}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={run.flagged ? "secondary" : "ghost"}
              size="sm"
              onClick={run.toggleFlag}
              aria-pressed={run.flagged}
              aria-label={run.flagged ? t.run.flagged : t.run.flagAria}
            >
              <Flag aria-hidden="true" className="size-4" />
              <span>{t.run.flag}</span>
            </Button>
            {showTimer && (
              <span
                role="timer"
                aria-live="off"
                className="rounded-md border bg-secondary px-3 py-1.5 font-mono text-sm font-semibold tabular-nums"
              >
                {exam ? formatClock(run.blockSecondsLeft) : formatClock(run.elapsed)}
              </span>
            )}
          </div>
        </div>
        <Progress
          value={((run.index + 1) / run.total) * 100}
          aria-label={`${t.run.progress} ${run.index + 1} ${t.run.of} ${run.total}`}
        />
        <p className="text-xs text-muted-foreground">{t.run.keyboardHint}</p>
      </div>

      {/* Question */}
      <Card>
        <CardContent className="space-y-5 pt-6">
          <p className="font-serif text-lg leading-relaxed">{run.q.text[locale]}</p>
          <div role="radiogroup" aria-label={t.run.section} className="grid gap-3">
            {run.q.options.map((option, i) => {
              const selected = run.selected === i;
              const revealed = answered && !exam;
              const correct = revealed && i === run.q.correctIndex;
              const wrongPick = revealed && selected && !correct;
              let tone = "border-input hover:bg-secondary";
              if (selected && !revealed) tone = "border-primary bg-primary/5";
              if (correct) tone = "border-success bg-success/10";
              else if (wrongPick) tone = "border-destructive bg-destructive/10";
              else if (revealed) tone = "border-input opacity-60";
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={answered}
                  onClick={() => run.select(i)}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring ${tone}`}
                >
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold"
                  >
                    {"ABCD"[i]}
                  </span>
                  <span className="text-base">{option[locale]}</span>
                  {correct && <Check aria-hidden="true" className="ms-auto size-5 text-success" />}
                </button>
              );
            })}
          </div>

          {exam && answered && (
            <p role="status" className="text-sm text-muted-foreground">
              {t.run.recorded}
            </p>
          )}

          {canAskFeedback && (
            <div className="space-y-3">
              {run.feedbackOpen && (
                <Alert variant={isCorrect ? "default" : "destructive"}>
                  <Lightbulb aria-hidden="true" className="size-4" />
                  <AlertTitle>{isCorrect ? t.run.correct : t.run.feedbackTitle}</AlertTitle>
                  <AlertDescription>{run.q.explanation[locale]}</AlertDescription>
                </Alert>
              )}
              {!run.feedbackOpen && (
                <Button type="button" variant="outline" onClick={() => run.setFeedbackOpen(true)}>
                  <Lightbulb aria-hidden="true" className="size-4" />
                  {t.run.askFeedback}
                </Button>
              )}
            </div>
          )}

          {/* Fixed command bar: left = navigation + primary action, right = skip + feedback */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <div className="flex flex-wrap items-center gap-3">
              {run.canPrev && (
                <Button type="button" variant="ghost" onClick={run.prev}>
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  {t.run.previous}
                </Button>
              )}
              {!answered ? (
                <Button type="button" onClick={run.confirm} disabled={run.selected === null}>
                  {t.run.confirm}
                </Button>
              ) : (
                <Button type="button" onClick={run.next}>
                  {run.isLast ? t.run.finish : t.run.next}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={run.next}
                aria-label={`${t.run.skip} — ${t.run.next}`}
              >
                <SkipForward aria-hidden="true" className="size-4" />
                {t.run.skip}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exam: section locked / auto-advance */}
      <AlertDialog open={run.timeUpPending}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.run.timeUpTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.run.timeUpBody.replace("{n}", String(run.autoAdvanceIn))}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={run.advanceBlock}>{t.run.nextSection}</AlertDialogCancel>
            <AlertDialogAction onClick={run.advanceBlock}>{t.run.continue}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={run.leavePending}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.run.leaveTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.run.leaveBody}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={run.cancelLeave}>{t.run.stay}</AlertDialogCancel>
            <AlertDialogAction onClick={run.advanceBlock}>{t.run.nextSection}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface FinishScreenProps {
  run: ReturnType<typeof useSimulationRun>;
  target: SimulationTarget | null;
  settings: SimulationSettings;
  onRetake: () => void;
}

function FinishScreen({ run, target, settings, onRetake }: FinishScreenProps) {
  const { t } = useI18n();
  const correct = run.correctCount;
  const total = run.total;
  const score = run.exam ? correct - run.wrongCount * 0.25 : correct;

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-center">
      <h1 className="font-serif text-3xl font-semibold">{t.run.done}</h1>
      <div className="mx-auto grid max-w-md gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">{run.exam ? t.run.examScore : t.run.score}</p>
          <p className="font-serif text-4xl font-semibold tabular-nums" aria-live="polite">
            {run.exam ? score.toFixed(2) : `${correct}/${total}`}
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">{t.run.timeTaken}</p>
          <p className="font-serif text-4xl font-semibold tabular-nums">{formatClock(run.elapsed)}</p>
        </div>
      </div>
      {run.exam && <p className="text-sm text-muted-foreground">{t.run.scoringRule}</p>}
      {run.timedOut && <p className="text-sm text-destructive">{t.run.timeUp}</p>}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={onRetake}>
          {t.run.retakeSame}
        </Button>
        {target !== null && (
          <Button type="button" variant="outline" asChild>
            <a href={`/simulation/settings/${target}`}>{t.run.editSettings}</a>
          </Button>
        )}
        <Button type="button" variant="outline" asChild>
          <a href="/simulation">{t.run.backToSimulation}</a>
        </Button>
      </div>
    </div>
  );
}

/** Read-only review of a past session: shows correct answers and explanations. */
export function RunReview({
  plan,
  onRetry,
  retakeTo,
}: {
  plan: RunPlan;
  onRetry?: () => void;
  retakeTo?: string;
}) {
  const { t, locale } = useI18n();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-serif text-2xl font-semibold">{t.run.reviewTitle}</h1>
      {plan.questions.map((q, i) => (
        <Card key={q.id}>
          <CardContent className="space-y-3 pt-6">
            <p className="font-medium">
              {i + 1}. {q.text[locale]}
            </p>
            <p className="text-sm">
              <span className="font-semibold">{t.run.correctAnswer}: </span>
              {q.options[q.correctIndex]?.[locale]}
            </p>
            <p className="text-sm text-muted-foreground">{q.explanation[locale]}</p>
          </CardContent>
        </Card>
      ))}
      <div className="flex flex-wrap gap-3">
        {onRetry && (
          <Button type="button" variant="outline" onClick={onRetry}>
            {t.run.retry}
          </Button>
        )}
        {retakeTo && (
          <Button type="button" asChild>
            <a href={retakeTo}>{t.run.retakeSame}</a>
          </Button>
        )}
        <Button type="button" variant="ghost" asChild>
          <a href="/history">{t.history.back}</a>
        </Button>
      </div>
    </div>
  );
}
