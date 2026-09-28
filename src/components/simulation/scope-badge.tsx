import { useI18n } from "@/context/i18n-context";
import { contentScopeService } from "@/services/content-scope.service";
import type { SimulationTarget } from "@/types/settings";

/** Marks a target as either a fully developed thesis module or a sample placeholder. */
export function ScopeBadge({ target }: { target: SimulationTarget }) {
  const { t } = useI18n();
  const thesis = contentScopeService.isThesisModule(target);

  return (
    <span
      className={
        thesis
          ? "inline-flex w-fit items-center gap-1.5 rounded border border-accent/50 bg-accent/10 px-2 py-0.5 text-xs font-medium text-foreground"
          : "inline-flex w-fit items-center gap-1.5 rounded border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
      }
    >
      <span aria-hidden="true" className={thesis ? "size-1.5 rounded-full bg-accent" : "size-1.5 rounded-full bg-muted-foreground/60"} />
      {thesis ? t.scope.thesisModule : t.scope.sampleModule}
    </span>
  );
}

/** Academic disclaimer shown on settings and run screens for sample-only targets. */
export function SampleNotice({ target }: { target: SimulationTarget }) {
  const { t } = useI18n();
  if (contentScopeService.isThesisModule(target)) return null;

  return (
    <p
      role="note"
      className="mx-auto mb-4 max-w-3xl rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground"
    >
      <span className="font-medium text-foreground">{t.scope.noticeTitle} </span>
      {t.scope.noticeBody}
    </p>
  );
}
