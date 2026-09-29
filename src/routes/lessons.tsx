import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { ScopeBadge } from "@/components/simulation/scope-badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";
import { lessonGroups } from "@/data/lesson-groups";
import { lessons } from "@/data/lessons";

export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "Lezioni e teoria — TOLC-S Trainer" },
      {
        name: "description",
        content:
          "La teoria organizzata per sezione del TOLC-S: le lezioni complete di Logica matematica e il programma delle altre aree del test.",
      },
      { property: "og:title", content: "Lezioni e teoria — TOLC-S Trainer" },
      {
        property: "og:description",
        content:
          "Le lezioni complete di Logica matematica e il programma ufficiale delle altre aree del TOLC-S.",
      },
    ],
  }),
  component: LessonsPage,
});

function LessonsPage() {
  const { t } = useI18n();
  const lessonTitle = (key: string) => (t.lesson as Record<string, string>)[key] ?? "";
  const lessonSummary = (key: string) => (t.lesson as Record<string, string>)[key] ?? "";
  const sectionLabel = (key: string) => (t.sections as Record<string, string>)[key] ?? key;
  const outline = (key: string) => (t.lessonOutline as Record<string, string>)[key] ?? "";

  return (
    <PageShell title={t.lessons.title} subtitle={t.lessons.subtitle}>
      <div className="flex flex-col gap-12">
        {lessonGroups.map((group) => {
          const availableLessons = lessons.filter((lesson) =>
            group.topics.some((topic) => topic.lessonIds.includes(lesson.id)),
          );

          return (
            <section key={group.sectionId} aria-labelledby={`lessons-${group.sectionId}`}>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <h2 id={`lessons-${group.sectionId}`} className="font-serif text-2xl font-semibold">
                  {sectionLabel(group.labelKey)}
                </h2>
                {availableLessons.length > 0 ? (
                  <span className="text-sm text-muted-foreground">
                    {availableLessons.length} {t.lessons.lessonCount}
                  </span>
                ) : (
                  <ScopeBadge target={group.sectionId} />
                )}
              </div>

              {group.topics.length === 1 && group.topics[0].outlineKey !== null ? (
                // Whole sections without lessons yet: syllabus outline only.
                <Card>
                  <CardContent className="flex flex-col gap-3 p-6">
                    <p className="text-muted-foreground">{outline(group.topics[0].outlineKey)}</p>
                    <p className="text-sm text-muted-foreground/80">
                      <span className="font-medium text-foreground">{t.lessons.comingSoon}: </span>
                      {t.lessons.comingSoonBody}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <ul className="grid gap-6 md:grid-cols-2">
                  {group.topics.map((topic) => {
                    const topicLessons = lessons.filter((lesson) => topic.lessonIds.includes(lesson.id));

                    return (
                      <li key={topic.id}>
                        <Card className="h-full">
                          <CardContent className="flex h-full flex-col gap-3 p-6">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="font-serif text-lg font-semibold">
                                {sectionLabel(topic.labelKey)}
                              </h3>
                              <ScopeBadge target={topic.id} />
                            </div>
                            {topic.descriptionKey !== null && (
                              <p className="text-muted-foreground">
                                {(t.sections as Record<string, string>)[topic.descriptionKey]}
                              </p>
                            )}

                            {topicLessons.length > 0 ? (
                              <ol className="flex flex-col gap-2">
                                {topicLessons.map((lesson) => (
                                  <li key={lesson.id}>
                                    <Link
                                      to="/lessons/$lessonId"
                                      params={{ lessonId: String(lesson.id) }}
                                      className="group/lesson flex items-start justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                      <span>
                                        <span className="block text-sm font-semibold">
                                          {lessonTitle(lesson.titleKey)}
                                        </span>
                                        <span className="mt-0.5 block text-sm text-muted-foreground">
                                          {lessonSummary(lesson.summaryKey)}
                                        </span>
                                      </span>
                                      <ArrowRight
                                        aria-hidden="true"
                                        className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover/lesson:translate-x-0.5"
                                      />
                                    </Link>
                                  </li>
                                ))}
                              </ol>
                            ) : (
                              <p className="mt-auto text-sm text-muted-foreground/80">
                                <span className="font-medium text-foreground">{t.lessons.comingSoon}: </span>
                                {t.lessons.comingSoonBody}
                              </p>
                            )}

                            <Link
                              to="/simulation/settings/$sectionId"
                              params={{ sectionId: topic.id }}
                              className="mt-auto inline-flex items-center gap-2 rounded-md text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <BookOpen aria-hidden="true" className="size-4" />
                              {t.lessons.practiceArea}
                            </Link>
                          </CardContent>
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
