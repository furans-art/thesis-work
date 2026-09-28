import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { RunSession } from "@/components/simulation/run-session";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-context";
import { useSettingsStore } from "@/hooks/use-settings-store";
import { isSimulationTarget } from "@/services/settings.service";
import { simulationService } from "@/services/simulation.service";

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

