import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-context";
import { readSlmConfig, saveSlmConfig } from "@/services/socratic-feedback.service";

/** Classroom setup: where the local tutor model (Ollama) runs. */
export function SlmSettingsCard() {
  const { locale } = useI18n();
  const it = locale === "it";
  const [url, setUrl] = useState("");
  const [model, setModel] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const c = readSlmConfig();
    setUrl(c.url);
    setModel(c.model);
  }, []);

  const save = () => {
    saveSlmConfig({ url, model });
    setStatus(it ? "Impostazioni salvate." : "Settings saved.");
  };

  const test = async () => {
    setStatus(it ? "Verifica in corso…" : "Checking…");
    try {
      const res = await fetch(`${url.replace(/\/$/, "")}/api/tags`, { signal: AbortSignal.timeout(5000) });
      setStatus(res.ok ? (it ? "Tutor raggiungibile." : "Tutor reachable.") : `HTTP ${res.status}`);
    } catch {
      setStatus(it ? "Tutor non raggiungibile da questo computer." : "Tutor not reachable from this computer.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{it ? "Tutor socratico (modello locale)" : "Socratic tutor (local model)"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="slm-url">{it ? "Indirizzo del server Ollama" : "Ollama server address"}</Label>
          <Input id="slm-url" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slm-model">{it ? "Modello" : "Model"}</Label>
          <Input id="slm-model" value={model} onChange={(e) => setModel(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={save}>{it ? "Salva" : "Save"}</Button>
          <Button type="button" variant="outline" onClick={test}>{it ? "Verifica" : "Test"}</Button>
        </div>
        <p role="status" className="text-sm text-muted-foreground">{status}</p>
      </CardContent>
    </Card>
  );
}
