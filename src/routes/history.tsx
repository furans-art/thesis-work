import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { SendSessionControl } from "@/components/simulation/send-session";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";
import { useHistory } from "@/hooks/use-history";
import { useProgressStats } from "@/hooks/use-progress-stats";
import { useSectionLabel } from "@/hooks/use-section-label";
import { formatClock } from "@/hooks/use-simulation-run";
import { tolcSections } from "@/data/tolc-sections";
import { mathematicsTopics } from "@/data/mathematics-topics";
import { accuracy } from "@/services/history.service";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Progressi — TOLC-S Trainer" },
      { name: "description", content: "Andamento dei punteggi, accuratezza per sezione e aree da rafforzare nelle simulazioni TOLC-S." },
      { property: "og:title", content: "Progressi — TOLC-S Trainer" },
      { property: "og:description", content: "Grafici dei progressi e ripasso delle risposte errate." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HistoryPage,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const DASHES = ["", "6 3", "2 2", "8 3 2 3", "4 4"];

function HistoryPage() {
  const { t, locale } = useI18n();
  const label = useSectionLabel();
  const { hydrated, sessions } = useHistory();
  const stats = useProgressStats(sessions);
  const sectionName = (id: string) => label([...tolcSections, ...mathematicsTopics].find((s) => s.id === id)?.labelKey ?? id);
  const dateFmt = (iso: string) =>
    new Date(iso).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });

  if (!hydrated) return <PageShell title={t.history.title}><p className="text-muted-foreground">{t.run.loading}</p></PageShell>;

  if (sessions.length === 0) {
    return (
      <PageShell title={t.history.title} subtitle={t.history.subtitle}>
        <p className="text-muted-foreground">{t.history.empty}</p>
        <Button className="mt-4" asChild>
          <Link to="/simulation">{t.history.goSimulate}</Link>
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell title={t.history.title} subtitle={t.history.subtitle}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 id="line-title" className="font-serif text-lg font-semibold">{t.history.lineTitle}</h2>
            <p id="line-desc" className="text-sm text-muted-foreground">{t.history.lineDesc}</p>
            <div className="mt-4 h-72" role="img" aria-labelledby="line-title" aria-describedby="line-desc">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.line} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="n" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis domain={[0, 100]} unit="%" stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    labelFormatter={(_, p) => (p[0] ? dateFmt(String(p[0].payload.date)) : "")}
                    formatter={(v: number, name: string) => [`${v}%`, name]}
                    contentStyle={{ background: "var(--popover)", borderColor: "var(--border)", color: "var(--popover-foreground)" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="overall" name={t.history.overall} stroke="var(--foreground)" strokeWidth={3} dot isAnimationActive={false} />
                  {stats.practisedSections.map((s, i) => (
                    <Line
                      key={s.id}
                      type="monotone"
                      dataKey={s.id}
                      name={label(s.labelKey)}
                      stroke={COLORS[i % COLORS.length]}
                      strokeDasharray={DASHES[i % DASHES.length]}
                      strokeWidth={2}
                      connectNulls
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 id="bar-title" className="font-serif text-lg font-semibold">{t.history.barTitle}</h2>
            <p id="bar-desc" className="text-sm text-muted-foreground">{t.history.barDesc}</p>
            <div className="mt-4 h-64" role="img" aria-labelledby="bar-title" aria-describedby="bar-desc bar-data">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.bar.map((b) => ({ ...b, name: sectionName(b.sectionId) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis domain={[0, 100]} unit="%" stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, t.history.accuracy]}
                    contentStyle={{ background: "var(--popover)", borderColor: "var(--border)", color: "var(--popover-foreground)" }}
                  />
                  <Bar dataKey="accuracy" fill="var(--primary)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p id="bar-data" className="sr-only">
              {stats.bar.map((b) => `${sectionName(b.sectionId)}: ${b.accuracy}%`).join("; ")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-semibold">{t.history.weakTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.history.weakDesc}</p>
            {stats.weak.length === 0 ? (
              <p className="mt-4">{t.history.weakEmpty}</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {stats.weak.map((w) => (
                  <li key={w.section.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                    <span className="font-medium">{label(w.section.labelKey)}</span>
                    <span className="text-destructive tabular-nums">{w.accuracy}%</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <h2 className="mt-10 font-serif text-2xl font-semibold">{t.history.sessions}</h2>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {stats.newestFirst.map((s) => {
          const correct = s.sections.reduce((n, r) => n + r.correct, 0);
          const total = s.sections.reduce((n, r) => n + r.total, 0);
          return (
            <li key={s.id}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-2 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">
                      {s.target === "full" ? t.simulation.fullExam : sectionName(s.target)}
                    </h3>
                    <Badge variant="secondary">{s.mode === "exam" ? t.history.modeExam : t.history.modePractice}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <time dateTime={s.date}>{dateFmt(s.date)}</time> · {formatClock(s.durationSeconds)}
                  </p>
                  <p className="text-sm">
                    {t.history.accuracy}: <strong>{accuracy({ correct, total })}%</strong> ({correct}/{total}) ·{" "}
                    {t.history.score}: <strong>{s.score.toLocaleString(locale)}</strong>
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                    {s.wrongQuestionIds.length > 0 && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/simulation/review/$sessionId" params={{ sessionId: s.id }}>
                          <RotateCcw aria-hidden="true" />
                          {t.history.reviewWrong} ({s.wrongQuestionIds.length})
                        </Link>
                      </Button>
                    )}
                    {s.snapshot && s.snapshot.length > 0 && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/simulation/retake/$sessionId" params={{ sessionId: s.id }}>
                          {t.history.retake}
                        </Link>
                      </Button>
                    )}
                    {s.wrongQuestionIds.length === 0 && !(s.snapshot && s.snapshot.length > 0) && (
                      <p className="text-sm text-success">{t.history.noWrong}</p>
                    )}
                    <SendSessionControl session={s} />
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
