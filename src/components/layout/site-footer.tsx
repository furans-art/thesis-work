import { Link } from "@tanstack/react-router";

import { useI18n } from "@/context/i18n-context";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="font-medium text-surface-foreground">{t.footer.thesis}</p>
          <p className="mt-1 text-xs">{t.footer.disclaimer}</p>
        </div>
        <Link to="/accessibility" className="text-sm font-medium text-primary hover:underline">
          {t.footer.accessibilityLink}
        </Link>
      </div>
    </footer>
  );
}
