import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/layout/page-shell";
import { useI18n } from "@/context/i18n-context";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Tesi di Francesco Agnoli — TOLC-S Trainer" },
      { name: "description", content: "Tesi di laurea di Francesco Agnoli: l'IA come supporto all'autoapprendimento, verificata sul test CISIA TOLC-S." },
      { name: "author", content: "Francesco Agnoli" },
      { property: "og:title", content: "Tesi di Francesco Agnoli — TOLC-S Trainer" },
      { property: "og:description", content: "Obiettivi e accessibilità del progetto di tesi di Francesco Agnoli." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();
  return (
    <PageShell title={t.about.title} subtitle={t.about.subtitle}>
      <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
        <p>{t.about.p1}</p>
        <p>{t.about.p2}</p>
        <p className="text-muted-foreground">{t.about.p3}</p>
      </div>
    </PageShell>
  );
}
