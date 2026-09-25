import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, FileText, Layers } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";
import { useSectionLabel } from "@/hooks/use-section-label";
import { tolcSectionsQuery, useTolcSections } from "@/hooks/use-tolc-sections";
import { sectionsService } from "@/services/sections.service";

export const Route = createFileRoute("/simulation/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(tolcSectionsQuery),
  head: () => ({
    meta: [
      { title: "Simulazione TOLC-S — TOLC-S Trainer" },
      {
        name: "description",
        content:
          "Esercitati per singola sezione del TOLC-S o affronta l'esame completo nell'ordine ufficiale.",
      },
      { property: "og:title", content: "Simulazione TOLC-S — TOLC-S Trainer" },
      {
        property: "og:description",
        content: "Esercitati per sezione o affronta l'esame completo del TOLC-S.",
      },
    ],
  }),
  component: SimulationPage,
});

function SimulationPage() {
  const { t } = useI18n();
  const label = useSectionLabel();
  const { data: sections = [] } = useTolcSections();

  return (
    <PageShell title={t.simulation.title} subtitle={t.simulation.subtitle}>
      <Card className="border-primary/30 bg-surface">
        <CardContent className="flex flex-col gap-5 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Layers aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-serif text-2xl font-semibold">{t.simulation.fullExam}</h2>
            <p className="mt-2 text-muted-foreground">{t.simulation.fullExamBody}</p>
            <p className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <FileText aria-hidden="true" className="size-4" />
                {sectionsService.totalQuestions()} {t.common.questions}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden="true" className="size-4" />
                {sectionsService.totalDuration()} {t.common.minutes}
              </span>
            </p>
          </div>
          <Button size="lg" variant="accent" asChild>
            <Link to="/simulation/settings">{t.simulation.settings}</Link>
          </Button>
        </CardContent>
      </Card>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <li key={section.id}>
            <Card className="h-full border-border">
              <CardContent className="flex h-full flex-col gap-3 p-6">
                <h3 className="font-serif text-lg font-semibold">{label(section.labelKey)}</h3>
                <p className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <FileText aria-hidden="true" className="size-4" />
                    {section.questionCount} {t.common.questions}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock aria-hidden="true" className="size-4" />
                    {section.durationMinutes} {t.common.minutes}
                  </span>
                </p>
                <div className="mt-auto pt-2">
                  <Button variant="outline" asChild>
                    <Link to="/simulation/settings">{t.simulation.startSection}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-muted-foreground">{t.common.placeholder}</p>
    </PageShell>
  );
}
