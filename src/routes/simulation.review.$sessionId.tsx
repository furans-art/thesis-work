import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { RunReview } from "@/components/simulation/run-session";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/layout/page-shell";
import { useI18n } from "@/context/i18n-context";
import { useHistory } from "@/hooks/use-history";
import { simulationService } from "@/services/simulation.service";

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

function ReviewPage() {
  const { sessionId } = Route.useParams();
  const { t } = useI18n();
  const { hydrated, get } = useHistory();
  const [attempt, setAttempt] = useState(0);
  const session = hydrated ? get(sessionId) : undefined;

  // Prefer the stored snapshot: it also covers questions generated live by the API.
  const plan = useMemo(
    () =>
      session
        ? session.snapshot
          ? simulationService.buildSnapshotPlan(session.snapshot)
          : simulationService.buildReviewPlan(session.wrongQuestionIds)
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.id, attempt],
  );

  if (!hydrated) return <p className="mx-auto max-w-3xl px-4 py-14 text-muted-foreground">{t.run.loading}</p>;
  if (!session) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-14">
        <p>{t.history.notFound}</p>
        <Button variant="outline" asChild>
          <Link to="/history">
            <ArrowLeft aria-hidden="true" />
            {t.history.back}
          </Link>
        </Button>
      </div>
    );
  }
  if (!plan || plan.questions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-14">
        <p>{t.history.noWrong}</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link to="/history">
              <ArrowLeft aria-hidden="true" />
              {t.history.back}
            </Link>
          </Button>
          {session.snapshot && (
            <Button asChild>
              <Link to="/simulation/retake/$sessionId" params={{ sessionId: session.id }}>
                {t.history.retake}
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }
  return (
    <PageShell title={t.run.reviewSession}>
      <RunReview key={attempt} plan={plan} retakeTo={session.snapshot ? `/simulation/retake/${session.id}` : undefined} />
    </PageShell>
  );
}
