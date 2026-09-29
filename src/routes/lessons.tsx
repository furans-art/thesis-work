import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";
import { lessons } from "@/data/lessons";

export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "Lezioni di logica — TOLC-S Trainer" },
      {
        name: "description",
        content:
          "La teoria del modulo di Logica matematica: proposizioni, operatori, tabelle di verità, equivalenze e quantificatori.",
      },
      { property: "og:title", content: "Lezioni di logica — TOLC-S Trainer" },
      {
        property: "og:description",
        content: "Proposizioni, operatori logici, tabelle di verità, equivalenze e quantificatori.",
      },
    ],
  }),
  component: LessonsPage,
});

function LessonsPage() {
  const { t } = useI18n();

  return (
    <PageShell title={t.lessons.title} subtitle={t.lessons.subtitle}>
      <ol className="grid gap-6 md:grid-cols-2">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link to="/lessons/$lessonId" params={{ lessonId: String(lesson.id) }} className="group block h-full rounded-lg">
              <Card className="h-full border-border transition-shadow group-hover:shadow-[var(--shadow-raised)]">
                <CardContent className="flex h-full flex-col gap-3 p-6">
                  <h2 className="font-serif text-xl font-semibold">{t.lesson[lesson.titleKey]}</h2>
                  <p className="text-muted-foreground">{t.lesson[lesson.summaryKey]}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-primary">
                    {t.lessons.openLesson}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
