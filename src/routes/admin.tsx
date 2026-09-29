import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-context";
import { useBackup } from "@/hooks/use-backup";
import type { ImportResult } from "@/services/backup.service";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dati e salvataggi — TOLC-S Trainer" },
      { name: "description", content: "Esporta o importa i tuoi salvataggi e la cronologia delle simulazioni." },
      { property: "og:title", content: "Dati e salvataggi — TOLC-S Trainer" },
      { property: "og:description", content: "Esporta o importa i tuoi salvataggi e la cronologia delle simulazioni." },
    ],
  }),
  component: AdminPage,
});

const reasonKey: Record<NonNullable<ImportResult["reason"]>, keyof Translation["admin"]> = {
  unreadable: "importUnreadable",
  "wrong-format": "importWrongFormat",
  empty: "importEmpty",
};

type Translation = ReturnType<typeof useI18n>["t"];

function AdminPage() {
  const { t } = useI18n();
  const { exportBackup, importBackup, result, itemCount, refreshCount } = useBackup();
  const fileRef = useRef<HTMLInputElement>(null);
  const [replace, setReplace] = useState(false);

  return (
    <PageShell title={t.admin.title} subtitle={t.admin.subtitle}>
      <div className="mx-auto max-w-3xl space-y-6">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {t.admin.itemCount.replace("{n}", String(itemCount))}
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">{t.admin.exportTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <p className="text-muted-foreground">{t.admin.exportBody}</p>
            <Button
              onClick={() => {
                exportBackup();
                refreshCount();
              }}
            >
              <Download aria-hidden="true" className="size-4" />
              {t.admin.exportButton}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">{t.admin.importTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <p className="text-muted-foreground">{t.admin.importBody}</p>
            <div className="flex items-center gap-3">
              <Checkbox
                id="import-replace"
                checked={replace}
                onCheckedChange={(v) => setReplace(v === true)}
              />
              <Label htmlFor="import-replace" className="text-sm font-normal">
                {t.admin.importReplace}
              </Label>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              aria-label={t.admin.importButton}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await importBackup(file, replace ? "replace" : "merge");
                e.target.value = "";
              }}
            />
            <Button onClick={() => fileRef.current?.click()} disabled={result === null && false}>
              <Upload aria-hidden="true" className="size-4" />
              {t.admin.importButton}
            </Button>
            {result && (
              <p role="status" aria-live="polite" className="text-sm">
                {result.ok
                  ? t.admin.importSuccess.replace("{n}", String(result.written))
                  : t.admin[reasonKey[result.reason ?? "unreadable"]]}
              </p>
            )}
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          {t.admin.privacyNote}{" "}
          <Link to="/privacy" className="font-medium text-primary hover:underline">
            {t.nav.privacy}
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
