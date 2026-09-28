import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { RunSession } from "@/components/simulation/run-session";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-context";
import { useHistory } from "@/hooks/use-history";
import { defaultSettings } from "@/services/settings.service";
import { simulationService } from "@/services/simulation.service";
import type { SimulationSettings } from "@/types/settings";

export const Route = createFileRoute("/simulation/review/$sessionId")({
  head: () => ({
    meta: [
      { title: "Ripasso errori — TOLC-S Trainer" },
      { name: "description", content: "Esercitati solo sulle domande sbagliate in una sessione precedente." },
      { property: "og:title", content: "Ripasso errori — TOLC-S Trainer" },
      { property: "og:description", content: "Sessione di allenamento con le sole domande sbagliate." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReviewPage,
});

const REVIEW_SETTINGS: SimulationSettings = {
  ...defaultSettings("full"),
  mode: "practice",
  explanationMode: "after-each",
  showTimer: false,
};

function ReviewPage() {
  const { sessionId } = Route.useParams();
  const { t } = useI18n();
  const { hydrated, get } = useHistory();
  const [attempt, setAttempt] = useState(0);
  const session = hydrated ? get(sessionId) : undefined;
  const plan = useMemo(
    () => (session ? simulationService.buildReviewPlan(session.wrongQuestionIds) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.id, attempt],
  );

  if (!hydrated) return <p className="mx-auto max-w-3xl px-4 py-14 text-muted-foreground">{t.run.loading}</p>;
  if (!plan || plan.questions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-14">
        <p>{session ? t.history.noWrong : t.history.notFound}</p>
        <Button variant="outline" asChild>
          <Link to="/history">{t.history.back}</Link>
        </Button>
      </div>
    );
  }
  return (
    <RunSession key={attempt} target={null} plan={plan} settings={REVIEW_SETTINGS} onRetry={() => setAttempt((a) => a + 1)} />
  );
}
