import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { RunSession } from "@/components/simulation/run-session";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/layout/page-shell";
import { useI18n } from "@/context/i18n-context";
import { useHistory } from "@/hooks/use-history";
import { defaultSettings, settingsService } from "@/services/settings.service";
import { simulationService } from "@/services/simulation.service";

export const Route = createFileRoute("/simulation/retake/$sessionId")({
  head: () => ({
    meta: [
      { title: "Rifai lo stesso test — TOLC-S Trainer" },
      { name: "description", content: "Rifai una sessione precedente con gli stessi identici quesiti." },
      { property: "og:title", content: "Rifai lo stesso test — TOLC-S Trainer" },
      { property: "og:description", content: "Rifai una sessione precedente con gli stessi identici quesiti." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RetakePage,
});

function RetakePage() {
  const { sessionId } = Route.useParams();
  const { t } = useI18n();
  const { hydrated, get } = useHistory();
  const session = hydrated ? get(sessionId) : undefined;

  const plan = useMemo(
    () => (session?.snapshot ? simulationService.buildSnapshotPlan(session.snapshot) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.id],
  );

  const settings = useMemo(() => {
    if (!session) return null;
    if (session.target === "full" || plan === null) {
      return { ...settingsService.get(session.target), mode: session.mode };
    }
    return { ...settingsService.get(session.target), mode: session.mode };
  }, [session, plan]);

  if (!hydrated) {
    return (
      <PageShell title={t.run.retakeSame}>
        <p className="text-muted-foreground">{t.run.loading}</p>
      </PageShell>
    );
  }

  if (!session || !plan || !settings) {
    return (
      <PageShell title={t.run.retakeSame}>
        <div className="space-y-4">
          <p className="text-muted-foreground">{session ? t.run.capped : t.history.notFound}</p>
          <Button variant="outline" asChild>
            <Link to="/history">
              <ArrowLeft aria-hidden="true" />
              {t.history.back}
            </Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title={t.run.retakeSame}>
      <RunSession
        target={session.target}
        plan={plan}
        settings={settings.explanationMode ? { ...settings, showTimer: settings.showTimer } : settings}
      />
    </PageShell>
  );
}
