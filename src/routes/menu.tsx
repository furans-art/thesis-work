import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, BookOpen, ClipboardList, FlaskConical } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu principale — TOLC-S Trainer" },
      {
        name: "description",
        content: "Simulazioni TOLC-S, lezioni di logica, laboratorio formule e progressi.",
      },
      { property: "og:title", content: "Menu principale — TOLC-S Trainer" },
      {
        property: "og:description",
        content: "Simulazioni TOLC-S, lezioni di logica, laboratorio formule e progressi.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { t } = useI18n();

  const items = [
    {
      to: "/simulation",
      icon: ClipboardList,
      title: t.menu.simulationTitle,
      body: t.menu.simulationBody,
    },
    {
      to: "/lessons",
      icon: BookOpen,
      title: t.menu.lessonsTitle,
      body: t.menu.lessonsBody,
    },
    {
      to: "/playground",
      icon: FlaskConical,
      title: t.menu.playgroundTitle,
      body: t.menu.playgroundBody,
    },
    {
      to: "/history",
      icon: BarChart3,
      title: t.menu.progressTitle,
      body: t.menu.progressBody,
    },
  ] as const;

  return (
    <PageShell title={t.menu.title} subtitle={t.menu.subtitle}>
      <ul className="grid gap-6 md:grid-cols-2">
        {items.map(({ to, icon: Icon, title, body }) => (
          <li key={to}>
            <Link to={to} className="group block h-full rounded-lg">
              <Card className="h-full border-border transition-shadow group-hover:shadow-[var(--shadow-raised)]">
                <CardContent className="flex h-full flex-col gap-4 p-8">
                  <span className="flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <h2 className="font-serif text-2xl font-semibold">{title}</h2>
                  <p className="text-muted-foreground">{body}</p>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    {t.common.start}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
