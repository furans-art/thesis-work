import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";

export const Route = createFileRoute("/simulation/settings")({
  head: () => ({
    meta: [
      { title: "Impostazioni pre-esame — TOLC-S Trainer" },
      {
        name: "description",
        content: "Configura durata, numero di domande e modalità di correzione della simulazione.",
      },
      { property: "og:title", content: "Impostazioni pre-esame — TOLC-S Trainer" },
      {
        property: "og:description",
        content: "Configura durata, domande e correzione della simulazione TOLC-S.",
      },
    ],
  }),
  component: SimulationSettingsPage,
});

function SimulationSettingsPage() {
  const { t } = useI18n();

  return (
    <PageShell title={t.simulation.settingsTitle} subtitle={t.simulation.settingsSubtitle}>
      <Card className="border-dashed">
        <CardContent className="space-y-4 p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            {t.common.comingSoon}
          </p>
          <p className="text-muted-foreground">{t.common.placeholder}</p>
          <Button variant="outline" asChild>
            <Link to="/simulation">
              <ArrowLeft aria-hidden="true" />
              {t.common.back}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
