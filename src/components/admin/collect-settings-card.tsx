import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-context";
import { readCollectEndpoint, saveCollectEndpoint } from "@/services/collection.service";

/** Classroom setup: where the anonymous session snapshots are collected. */
export function CollectSettingsCard() {
  const { locale } = useI18n();
  const it = locale === "it";
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => setUrl(readCollectEndpoint()), []);

  const save = () => {
    saveCollectEndpoint(url);
    setStatus(it ? "Indirizzo salvato." : "Address saved.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{it ? "Raccolta dati di aula" : "Classroom data collection"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="collect-url">
            {it ? "Indirizzo del server di raccolta" : "Collection server address"}
          </Label>
          <Input
            id="collect-url"
            value={url}
            placeholder="https://…/api/sessioni"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={save}>{it ? "Salva" : "Save"}</Button>
        </div>
        <p role="status" className="text-sm text-muted-foreground">{status}</p>
      </CardContent>
    </Card>
  );
}
