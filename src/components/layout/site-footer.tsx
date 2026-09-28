import { Link } from "@tanstack/react-router";

import { useI18n } from "@/context/i18n-context";

const linkClass =
  "rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="font-medium text-surface-foreground">{t.footer.thesis}</p>
          <p className="mt-1 text-xs">{t.footer.disclaimer}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li><Link to="/privacy" className={linkClass}>{t.footer.privacyLink}</Link></li>
            <li aria-hidden="true">|</li>
            <li><Link to="/accessibility" className={linkClass}>{t.footer.accessibilityLink}</Link></li>
            <li aria-hidden="true">|</li>
            <li><Link to="/about" className={linkClass}>{t.footer.aboutLink}</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
