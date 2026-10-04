import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, FlaskConical } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-context";
import { lessonContentEn } from "@/data/lesson-content.en";
import { lessonContentIt } from "@/data/lesson-content.it";
import { lessons } from "@/data/lessons";
import { LessonBody } from "@/components/lessons/lesson-body";

export const Route = createFileRoute("/lessons_/$lessonId")({
  head: () => ({
    meta: [
      { title: "Lezione — TOLC-S Trainer" },
      { name: "description", content: "Lezione di teoria per la preparazione al test CISIA TOLC-S." },
      { property: "og:title", content: "Lezione — TOLC-S Trainer" },
      { property: "og:description", content: "Lezione di teoria per la preparazione al test CISIA TOLC-S." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { t, locale } = useI18n();
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

  const sorted = [...lessons].sort((a, b) => a.id - b.id);
  const index = sorted.findIndex((l) => l.id === lesson.id);
  const prevLesson = index > 0 ? sorted[index - 1] : undefined;
  const nextLesson = index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : undefined;

  return (
    <PageShell title={lessonKey(lesson.titleKey)}>
      <article className="max-w-3xl space-y-6">
        <p className="font-serif text-lg leading-relaxed">{lessonKey(lesson.summaryKey)}</p>
        {(() => {
          const blocks = (locale === "en" ? lessonContentEn : lessonContentIt)[lesson.id];
          return blocks && blocks.length > 0 ? (
            <LessonBody blocks={blocks} />
          ) : (
            <p className="leading-relaxed text-foreground/90">{lessonKey(lesson.bodyKey)}</p>
          );
        })()}
        <div className="flex flex-wrap gap-3 border-t pt-6">
          <Button asChild>
            <Link
              to="/simulation/settings/$sectionId"
              params={{ sectionId: lesson.practiceTargets[0] ?? "matematica-ragionare" }}
            >
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
        <nav
          aria-label={t.lessons.title}
          className="flex flex-wrap items-stretch justify-between gap-3"
        >
          {prevLesson ? (
            <Button variant="outline" asChild className="h-auto max-w-[48%] whitespace-normal">
              <Link
                to="/lessons/$lessonId"
                params={{ lessonId: String(prevLesson.id) }}
                className="flex items-center gap-2 py-3 text-left"
              >
                <ArrowLeft aria-hidden="true" className="shrink-0" />
                <span>
                  <span className="block text-xs text-muted-foreground">{t.lessons.prevLesson}</span>
                  <span className="block font-semibold">{lessonKey(prevLesson.titleKey)}</span>
                </span>
              </Link>
            </Button>
          ) : (
            <span />
          )}
          {nextLesson ? (
            <Button variant="outline" asChild className="ml-auto h-auto max-w-[48%] whitespace-normal">
              <Link
                to="/lessons/$lessonId"
                params={{ lessonId: String(nextLesson.id) }}
                className="flex items-center gap-2 py-3 text-right"
              >
                <span>
                  <span className="block text-xs text-muted-foreground">{t.lessons.nextLesson}</span>
                  <span className="block font-semibold">{lessonKey(nextLesson.titleKey)}</span>
                </span>
                <ArrowRight aria-hidden="true" className="shrink-0" />
              </Link>
            </Button>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </PageShell>
  );
}
