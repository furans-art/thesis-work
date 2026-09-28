import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers, Play, Settings2 } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { ScopeBadge } from "@/components/simulation/scope-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";
import { useSectionLabel } from "@/hooks/use-section-label";
import { useSettingsStore } from "@/hooks/use-settings-store";
import { useSettingsSummary } from "@/hooks/use-settings-summary";
import { tolcSections } from "@/data/tolc-sections";
import { mathematicsTopics } from "@/data/mathematics-topics";
import type { SimulationTarget } from "@/types/settings";

export const Route = createFileRoute("/simulation/")({
  head: () => ({
    meta: [
      { title: "Simulazione TOLC-S — TOLC-S Trainer" },
      {
        name: "description",
        content: "Esercitati per singola sezione del TOLC-S o affronta l'esame completo nell'ordine ufficiale.",
      },
      { property: "og:title", content: "Simulazione TOLC-S — TOLC-S Trainer" },
      { property: "og:description", content: "Esercitati per sezione o affronta l'esame completo del TOLC-S." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SimulationPage,
});

function SimulationPage() {
  const { t } = useI18n();
  const label = useSectionLabel();
  const sections = [...tolcSections].filter((section) => section.id !== "matematica").sort((a, b) => a.order - b.order);

  return (
    <PageShell title={t.simulation.title} subtitle={t.simulation.subtitle}>
      <TargetCard
        target="full"
        title={t.simulation.fullExam}
        body={t.simulation.fullExamBody}
        highlight
      />
      <section className="mt-8" aria-labelledby="mathematics-heading">
        <div className="max-w-3xl">
          <h2 id="mathematics-heading" className="font-serif text-2xl font-semibold">
            {t.sections.matematica}
          </h2>
          <p className="mt-1 text-muted-foreground">{t.simulation.mathematicsSyllabus}</p>
        </div>
        <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mathematicsTopics.map((topic) => (
            <li key={topic.id}>
              <TargetCard
                target={topic.id}
                title={label(topic.labelKey)}
                body={label(topic.descriptionKey)}
              />
            </li>
          ))}
        </ul>
      </section>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <li key={section.id}>
            <TargetCard target={section.id} title={label(section.labelKey)} />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

function TargetCard(props: { target: SimulationTarget; title: string; body?: string; highlight?: boolean }) {
  const { t } = useI18n();
  const { getSettings, hasSaved } = useSettingsStore();
  const summary = useSettingsSummary();
  const saved = hasSaved(props.target);

  return (
    <Card className={props.highlight ? "h-full border-primary/30 bg-surface" : "h-full border-border"}>
      <CardContent className="flex h-full flex-col gap-3 p-6">
        {props.highlight && (
          <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Layers aria-hidden="true" />
          </span>
        )}
        <h2 className={props.highlight ? "font-serif text-2xl font-semibold" : "font-serif text-lg font-semibold"}>
          {props.title}
        </h2>
        <ScopeBadge target={props.target} />
        {props.body && <p className="text-muted-foreground">{props.body}</p>}
        <p className="text-sm text-muted-foreground">
          {summary(getSettings(props.target))}{" "}
          <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
            {saved ? t.simulation.savedLabel : t.simulation.defaultLabel}
          </span>
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Button variant="outline" asChild>
            <Link to="/simulation/settings/$sectionId" params={{ sectionId: props.target }}>
              <Settings2 aria-hidden="true" />
              {t.simulation.sectionSettings}
            </Link>
          </Button>
          <Button variant={props.highlight ? "accent" : "default"} asChild>
            <Link to="/simulation/run/$sectionId" params={{ sectionId: props.target }}>
              <Play aria-hidden="true" />
              {t.simulation.startSection}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
