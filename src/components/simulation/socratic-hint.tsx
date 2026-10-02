import { useState } from "react";
import { MessageCircleQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-context";
import { requestSocraticHint, type SocraticInput } from "@/services/socratic-feedback.service";

/** On-demand guiding question from the local small model, constrained by the deterministic diagnosis. */
export function SocraticHint(props: Omit<SocraticInput, "locale">) {
  const { locale } = useI18n();
  const it = locale === "it";
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [text, setText] = useState("");

  const ask = async () => {
    setState("loading");
    try {
      setText(await requestSocraticHint({ ...props, locale }, AbortSignal.timeout(30000)));
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="space-y-2">
      {state !== "done" && (
        <Button type="button" variant="outline" size="sm" onClick={ask} disabled={state === "loading"}>
          <MessageCircleQuestion aria-hidden="true" className="size-4" />
          {state === "loading"
            ? it ? "Il tutor sta pensando…" : "The tutor is thinking…"
            : it ? "Chiedi una domanda guida al tutor" : "Ask the tutor for a guiding question"}
        </Button>
      )}
      <div aria-live="polite">
        {state === "done" && (
          <div role="note" className="rounded-lg border border-primary/40 bg-primary/5 p-4">
            <p className="text-sm font-semibold">{it ? "Domanda guida del tutor" : "Tutor's guiding question"}</p>
            <p className="mt-1 text-sm text-foreground/90">{text}</p>
          </div>
        )}
        {state === "error" && (
          <p className="text-sm text-muted-foreground">
            {it
              ? "Il tutor non è disponibile: fai riferimento all'analisi dell'errore qui sopra."
              : "The tutor is unavailable: refer to the error analysis above."}
          </p>
        )}
      </div>
    </div>
  );
}
