import { createFileRoute, Link } from "@tanstack/react-router";
import { Accessibility, Languages, ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TOLC-S Trainer — Preparazione accessibile al test CISIA TOLC-S" },
      {
        name: "description",
        content:
          "Simulazioni del test di ammissione CISIA TOLC-S con impostazioni di accessibilità visiva personalizzabili, in italiano e inglese.",
      },
      {
        property: "og:title",
        content: "TOLC-S Trainer — Preparazione accessibile al test CISIA TOLC-S",
      },
      {
        property: "og:description",
        content:
          "Simulazioni del test di ammissione CISIA TOLC-S con impostazioni di accessibilità visiva personalizzabili.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { t } = useI18n();

  const highlights = [
    { icon: ListChecks, title: t.home.highlights.oneTitle, body: t.home.highlights.oneBody },
    { icon: Accessibility, title: t.home.highlights.twoTitle, body: t.home.highlights.twoBody },
    { icon: Languages, title: t.home.highlights.threeTitle, body: t.home.highlights.threeBody },
  ];

  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {t.home.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
            {t.home.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{t.home.subtitle}</p>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">{t.home.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/menu">{t.home.ctaPrimary}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/accessibility">{t.home.ctaSecondary}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <ul className="grid gap-6 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <Card className="h-full border-border shadow-none">
                <CardContent className="space-y-3 p-6">
                  <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
                    <Icon aria-hidden="true" />
                  </span>
                  <h2 className="font-serif text-lg font-semibold">{title}</h2>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
