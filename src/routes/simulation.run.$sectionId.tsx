import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { RunSession } from "@/components/simulation/run-session";
import { SampleNotice } from "@/components/simulation/scope-badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-context";
import { useSettingsStore } from "@/hooks/use-settings-store";
import { fetchLogicQuestions } from "@/services/logicApi.functions";
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

  // The Mathematical logic module pulls live questions from the Logic API;
  // every other target uses the local sample bank only.
  const isLogicModule = target === "matematica-ragionare";
  const logicQuery = useQuery({
    queryKey: ["logic-api-questions", attempt],
    queryFn: () => fetchLogicQuestions({ data: { count: settings?.questionCount ?? 5 } }),
    enabled: hydrated && isLogicModule,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const plan = useMemo(() => {
    if (!settings) return null;
    if (!isLogicModule) return simulationService.buildPlan(target, settings);
    if (logicQuery.isPending) return null;
    const live = logicQuery.data ?? [];
    return simulationService.buildPlan(target, settings, live.length > 0 ? { [target]: live } : {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, target, attempt, isLogicModule, logicQuery.isPending, logicQuery.data]);

  if (!settings || !plan) {
    return <p className="mx-auto max-w-3xl px-4 py-14 text-muted-foreground">{t.run.loading}</p>;
  }
  return (
    <>
      <div className="space-y-2 px-4 pt-6">
        <SampleNotice target={target} />
        {isLogicModule && logicQuery.isError === false && (logicQuery.data?.length ?? 0) > 0 && (
          <p className="rounded-md border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-foreground" role="status">
            {t.run.logicLive}
          </p>
        )}
        {isLogicModule && !logicQuery.isPending && (logicQuery.data?.length ?? 0) === 0 && (
          <p className="rounded-md border border-border bg-muted px-4 py-2 text-sm text-muted-foreground" role="status">
            {t.run.logicOffline}
          </p>
        )}
      </div>
      <RunSession
        key={attempt}
        target={target}
        plan={plan}
        settings={settings}
        onRetry={() => setAttempt((a) => a + 1)}
      />
    </>
  );
}

