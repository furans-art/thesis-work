import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, Clock, Flag, MessageCircleQuestion, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";
import { useSectionLabel } from "@/hooks/use-section-label";
import { useSettingsStore } from "@/hooks/use-settings-store";
import { formatClock, useSimulationRun } from "@/hooks/use-simulation-run";
import { cn } from "@/lib/utils";
import { isSimulationTarget } from "@/services/settings.service";
import { simulationService, type RunPlan } from "@/services/simulation.service";
import type { SimulationSettings, SimulationTarget } from "@/types/settings";

export const Route = createFileRoute("/simulation/run/$sectionId")({
  loader: ({ params }) => {
    if (!isSimulationTarget(params.sectionId)) throw notFound();
    return { target: params.sectionId };
  },
  head: () => ({
    meta: [
      { title: "Simulazione in corso — TOLC-S Trainer" },
      { name: "description", content: "Rispondi alle domande della sezione TOLC-S." },
      { property: "og:title", content: "Simulazione in corso — TOLC-S Trainer" },
      { property: "og:description", content: "Fac-simile di una sessione di domande TOLC-S." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: RunNotFound,
  component: RunPage,
});

function RunNotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-14">
      <p>{t.run.notFound}</p>
      <Button variant="outline" asChild>
        <Link to="/simulation">{t.run.backToSimulation}</Link>
      </Button>
    </div>
  );
}

const LETTERS = ["A", "B", "C", "D"];

function RunPage() {
  const { target } = Route.useLoaderData();
  const { t } = useI18n();
  const { hydrated, getSettings } = useSettingsStore();
  const [attempt, setAttempt] = useState(0);

  // Shuffling uses Math.random, so the plan is only built on the client after settings load.
  const settings = hydrated ? getSettings(target) : null;
  const plan = useMemo(
    () => (settings ? simulationService.buildPlan(target, settings) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hydrated, target, attempt],
  );

  if (!settings || !plan) {
    return <p className="mx-auto max-w-3xl px-4 py-14 text-muted-foreground">{t.run.loading}</p>;
  }
  return (
    <RunSession
      key={attempt}
      target={target}
      plan={plan}
      settings={settings}
      onRetry={() => setAttempt((a) => a + 1)}
    />
  );
}

function RunSession(props: {
  target: SimulationTarget;
  plan: RunPlan;
  settings: SimulationSettings;
  onRetry: () => void;
}) {
  const { plan, settings } = props;
  const { t, locale } = useI18n();
  const label = useSectionLabel();
  const run = useSimulationRun(plan, settings);
  const { q, index, total, selected, confirmed } = run;
  const isCorrect = confirmed && selected === q.correctIndex;
  const multiBlock = plan.blocks.length > 1;
  const block = plan.blocks[run.blockIndex]!;

  if (run.finished) {
    return <RunReview {...props} answers={run.answers} correctCount={run.correctCount} timedOut={run.timedOut} />;
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
          <h1 className="font-serif text-lg font-semibold">{label(block.section.labelKey)}</h1>
        </div>
        <div className="flex items-center gap-4">
          {settings.showTimer && (
            <span
              className="inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums"
              aria-label={`${t.run.timeLeft}: ${formatClock(run.secondsLeft)}`}
            >
              <Clock aria-hidden="true" className="size-4" />
              {formatClock(run.secondsLeft)}
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
          >
            <Flag aria-hidden="true" />
            {run.flagged ? t.run.flagged : t.run.flag}
          </Button>
        </div>
      </div>

      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={index + 1}
      >
        <div className="h-full bg-primary transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <section className="mt-8">
        <p className="text-xl leading-relaxed">{q.text[locale]}</p>

        <div role="radiogroup" className="mt-6 grid gap-3">
          {q.options.map((opt, i) => {
            const isSel = selected === i;
            const showCorrect = confirmed && i === q.correctIndex;
            const showWrong = confirmed && isSel && i !== q.correctIndex;
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
                  !confirmed && isSel && "border-primary bg-primary/10",
                  !confirmed && !isSel && "border-border",
                  showCorrect && "border-success bg-success/10",
                  showWrong && "border-destructive bg-destructive/10",
                  confirmed && !showCorrect && !showWrong && "border-border opacity-70",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border font-semibold",
                    isSel && !confirmed && "border-primary bg-primary text-primary-foreground",
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
          <p role="status" className={cn("mt-5 font-semibold", isCorrect ? "text-success" : "text-destructive")}>
            {isCorrect ? t.run.correct : t.run.wrong}
          </p>
        )}

        {confirmed && !isCorrect && run.feedbackOpen && settings.explanationMode === "after-each" && (
          <Card className="mt-4 border-accent/40">
            <CardContent className="space-y-3 p-5">
              <h2 className="font-semibold">{t.run.feedbackTitle}</h2>
              <p className="leading-relaxed">{q.explanation[locale]}</p>
              <Button variant="ghost" size="sm" onClick={() => run.setFeedbackOpen(false)}>
                {t.run.close}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {!confirmed && selected !== null && (
            <Button size="lg" onClick={run.confirm}>
              {t.run.confirm}
            </Button>
          )}
          {confirmed && !isCorrect && !run.feedbackOpen && settings.explanationMode === "after-each" && (
            <Button size="lg" variant="outline" onClick={() => run.setFeedbackOpen(true)}>
              <MessageCircleQuestion aria-hidden="true" />
              {t.run.askFeedback}
            </Button>
          )}
          {confirmed && (
            <Button size="lg" variant="accent" onClick={run.next}>
              {run.isLast ? t.run.finish : t.run.next}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function RunReview(props: {
  target: SimulationTarget;
  plan: RunPlan;
  settings: SimulationSettings;
  answers: (number | null)[];
  correctCount: number;
  timedOut: boolean;
  onRetry: () => void;
}) {
  const { t, locale } = useI18n();
  const label = useSectionLabel();
  const showExplanations = props.settings.explanationMode !== "never";

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-14">
      <Card>
        <CardContent className="space-y-4 p-8">
          <h1 className="text-3xl font-semibold">{t.run.done}</h1>
          {props.timedOut && <p className="text-destructive">{t.run.timeUp}</p>}
          <p className="text-lg">
            {t.run.score}: <strong>{props.correctCount} / {props.plan.questions.length}</strong>
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="accent" onClick={props.onRetry}>{t.run.retry}</Button>
            <Button variant="outline" asChild>
              <Link to="/simulation/settings/$sectionId" params={{ sectionId: props.target }}>
                {t.run.editSettings}
              </Link>
            </Button>
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
            <li key={q.id}>
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
