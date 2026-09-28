import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";
import { usePrivacy } from "@/hooks/use-privacy";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — TOLC-S Trainer" },
      { name: "description", content: "Tutti i dati dell'app restano nel tuo browser. Scopri cosa viene salvato e come eliminarlo." },
      { property: "og:title", content: "Privacy — TOLC-S Trainer" },
      { property: "og:description", content: "Dati salvati solo in locale, eliminabili in un clic." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useI18n();
  const { deleteAllData } = usePrivacy();

  return (
    <PageShell title={t.privacy.title} subtitle={t.privacy.subtitle}>
      <div className="max-w-3xl space-y-8">
        <p className="text-lg leading-relaxed">{t.privacy.intro}</p>
        <section>
          <h2 className="font-serif text-xl font-semibold">{t.privacy.storedTitle}</h2>
          <ul className="mt-3 list-disc space-y-1 ps-6">
            <li>{t.privacy.itemSettings}</li>
            <li>{t.privacy.itemHistory}</li>
            <li>{t.privacy.itemAccessibility}</li>
          </ul>
        </section>
        <Card className="border-destructive/40">
          <CardContent className="space-y-3 p-6">
            <h2 className="font-serif text-xl font-semibold">{t.privacy.deleteTitle}</h2>
            <p className="text-muted-foreground">{t.privacy.deleteBody}</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 aria-hidden="true" />
                  {t.privacy.deleteButton}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.privacy.confirmTitle}</AlertDialogTitle>
                  <AlertDialogDescription>{t.privacy.confirmBody}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.privacy.confirmCancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteAllData}>{t.privacy.confirmDelete}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
