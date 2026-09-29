import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, FlaskConical } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-context";
import { lessons } from "@/data/lessons";

export const Route = createFileRoute("/lessons/$lessonId")({
  head: () => ({
    meta: [
      { title: "Lezione di logica — TOLC-S Trainer" },
      { name: "description", content: "Lezione di teoria della logica propedeutica al modulo di Logica matematica." },
      { property: "og:title", content: "Lezione di logica — TOLC-S Trainer" },
      { property: "og:description", content: "Lezione di teoria della logica propedeutica al modulo di Logica matematica." },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { t } = useI18n();
  const { lessonId } = Route.useParams();
  const lesson = lessons.find((l) => l.id === Number(lessonId));

  if (!lesson) {
    return (
      <PageShell title={t.lessons.title}>
        <p className="text-muted-foreground">{t.lessons.notFound}</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/lessons">
            <ArrowLeft aria-hidden="true" />
            {t.lessons.backToLessons}
          </Link>
        </Button>
      </PageShell>
    );
  }

  const lessonKey = (key: string): string => (t.lesson as Record<string, string>)[key] ?? "";

  return (
    <PageShell title={lessonKey(lesson.titleKey)}>
      <article className="max-w-3xl space-y-6">
        <p className="font-serif text-lg leading-relaxed">{lessonKey(lesson.summaryKey)}</p>
        <p className="leading-relaxed text-foreground/90">{lessonKey(lesson.bodyKey)}</p>
        <div className="flex flex-wrap gap-3 border-t pt-6">
          <Button asChild>
            <Link to="/simulation/settings/$sectionId" params={{ sectionId: "matematica-ragionare" }}>
              <BookOpen aria-hidden="true" />
              {t.lessons.practice}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/playground">
              <FlaskConical aria-hidden="true" />
              {t.lessons.playground}
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/lessons">
              <ArrowLeft aria-hidden="true" />
              {t.lessons.backToLessons}
            </Link>
          </Button>
        </div>
      </article>
    </PageShell>
  );
}
