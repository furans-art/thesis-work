import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-context";
import {
  readCollectEndpoint,
  sendSession,
} from "@/services/collection.service";
import type { SessionRecord } from "@/types/history";

/** Explicit-consent, anonymous send of one session to the classroom collection server. */
export function SendSessionControl(props: { session: SessionRecord }) {
  const { locale } = useI18n();
  const it = locale === "it";
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error" | "missing">("idle");

  const send = async () => {
    if (!readCollectEndpoint()) {
      setState("missing");
      return;
    }
    setState("sending");
    try {
      await sendSession(props.session, "A");
      setState("sent");
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return <p role="status" className="text-sm text-success">{it ? "Dati inviati. Grazie!" : "Data sent. Thank you!"}</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Checkbox id={`consent-${props.session.id}`} checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
        <Label htmlFor={`consent-${props.session.id}`} className="text-sm font-normal">
          {it ? "Acconsento a inviare questa sessione in forma anonima" : "I consent to sending this session anonymously"}
        </Label>
      </div>
      <Button type="button" variant="outline" size="sm" disabled={!consent || state === "sending"} onClick={send}>
        <Send aria-hidden="true" className="size-4" />
        {state === "sending" ? (it ? "Invio…" : "Sending…") : it ? "Invia i dati della sessione" : "Send session data"}
      </Button>
      {state === "error" && (
        <p role="alert" className="text-sm text-muted-foreground">
          {it ? "Invio non riuscito: riprova più tardi." : "Sending failed: try again later."}
        </p>
      )}
      {state === "missing" && (
        <p role="alert" className="text-sm text-muted-foreground">
          {it ? "Nessun indirizzo di raccolta configurato su questo computer." : "No collection address configured on this computer."}
        </p>
      )}
    </div>
  );
}
