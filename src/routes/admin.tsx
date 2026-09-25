import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Amministrazione — TOLC-S Trainer" },
      {
        name: "description",
        content: "Area riservata alle statistiche aggregate sulle sessioni di studio.",
      },
      { property: "og:title", content: "Amministrazione — TOLC-S Trainer" },
      {
        property: "og:description",
        content: "Statistiche aggregate sulle sessioni di studio del TOLC-S Trainer.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { t } = useI18n();

  return (
    <PageShell title={t.admin.title} subtitle={t.admin.subtitle}>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-start gap-4 p-8">
          <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
            <BarChart3 aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            {t.common.comingSoon}
          </p>
          <p className="text-muted-foreground">{t.common.placeholder}</p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
