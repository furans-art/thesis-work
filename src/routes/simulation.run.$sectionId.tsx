import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, Flag, MessageCircleQuestion, XCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";
import { useSectionLabel } from "@/hooks/use-section-label";
import { cn } from "@/lib/utils";
import { questionService } from "@/services/questionService";
import { sectionsService } from "@/services/sections.service";
import type { TolcSectionId } from "@/types/tolc";

export const Route = createFileRoute("/simulation/run/$sectionId")({
  loader: async ({ params }) => {
    const section = await sectionsService.getById(params.sectionId as TolcSectionId);
    if (!section) throw notFound();
    const questions = await questionService.listBySection(section.id);
    return { section, questions };
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
  return <p className="mx-auto max-w-3xl px-4 py-14">{t.run.notFound}</p>;
}

const LETTERS = ["A", "B", "C", "D"];

function RunPage() {
  const { section, questions } = Route.useLoaderData();
  const { t, locale } = useI18n();
  const label = useSectionLabel();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[index]!;
  const isCorrect = confirmed && selected === q.correctIndex;
  const isLast = index === questions.length - 1;
  const flagged = flags.has(q.id);

  const confirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    if (selected === q.correctIndex) setCorrectCount((c) => c + 1);
  };

  const next = () => {
    if (isLast) return setFinished(true);
    setIndex((i) => i + 1);
    setSelected(null);
    setConfirmed(false);
    setFeedbackOpen(false);
  };

  const toggleFlag = () =>
    setFlags((prev) => {
      const n = new Set(prev);
      if (n.has(q.id)) n.delete(q.id);
      else n.add(q.id);
      return n;
    });

  if (finished) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-14">
        <Card>
          <CardContent className="space-y-4 p-8">
            <h1 className="text-3xl font-semibold">{t.run.done}</h1>
            <p className="text-lg">
              {t.run.score}: <strong>{correctCount} / {questions.length}</strong>
            </p>
            <Button variant="outline" asChild>
              <Link to="/simulation">{t.common.back}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3">
        <h1 className="font-serif text-lg font-semibold">{label(section.labelKey)}</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground" aria-live="polite">
            {t.run.progress} {index + 1} / {questions.length}
          </span>
          <Button
            variant={flagged ? "accent" : "outline"}
            size="sm"
            onClick={toggleFlag}
            aria-pressed={flagged}
          >
            <Flag aria-hidden="true" />
            {flagged ? t.run.flagged : t.run.flag}
          </Button>
        </div>
      </div>

      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={index + 1}
      >
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
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
                onClick={() => setSelected(i)}
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
          <p
            role="status"
            className={cn("mt-5 font-semibold", isCorrect ? "text-success" : "text-destructive")}
          >
            {isCorrect ? t.run.correct : t.run.wrong}
          </p>
        )}

        {confirmed && !isCorrect && feedbackOpen && (
          <Card className="mt-4 border-accent/40">
            <CardContent className="space-y-3 p-5">
              <h2 className="font-semibold">{t.run.feedbackTitle}</h2>
              <p className="leading-relaxed">{q.explanation[locale]}</p>
              <Button variant="ghost" size="sm" onClick={() => setFeedbackOpen(false)}>
                {t.run.close}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {!confirmed && selected !== null && (
            <Button size="lg" onClick={confirm}>
              {t.run.confirm}
            </Button>
          )}
          {confirmed && !isCorrect && !feedbackOpen && (
            <Button size="lg" variant="outline" onClick={() => setFeedbackOpen(true)}>
              <MessageCircleQuestion aria-hidden="true" />
              {t.run.askFeedback}
            </Button>
          )}
          {confirmed && (
            <Button size="lg" variant="accent" onClick={next}>
              {isLast ? t.run.finish : t.run.next}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
