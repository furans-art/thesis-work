import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Menu, Moon, SlidersHorizontal, Sun } from "lucide-react";

import { AccessibilityQuickPanel } from "@/components/accessibility/accessibility-quick-panel";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAccessibility } from "@/context/accessibility-context";
import { useI18n } from "@/context/i18n-context";
import type { Locale } from "@/types/i18n";

const navItems = [
  { to: "/menu", key: "menu" },
  { to: "/simulation", key: "simulation" },
  { to: "/lessons", key: "lessons" },
  { to: "/history", key: "history" },
  { to: "/accessibility", key: "accessibility" },
  { to: "/admin", key: "admin" },
] as const;

function MobileNav() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden" aria-label={t.nav.openMenu}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="font-serif">{t.common.appName}</SheetTitle>
        </SheetHeader>
        <nav aria-label={t.nav.menu} className="mt-4 flex flex-col gap-1 px-2">
          {[{ to: "/", key: "home" } as const, ...navItems].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-md px-3 text-base font-medium text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function SiteHeader() {
  const { t, locale, setLocale } = useI18n();
  const { settings, update } = useAccessibility();
  const isDark = settings.theme === "dark";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={t.common.appName}>
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-base font-semibold">{t.common.appName}</span>
            <span className="block text-xs text-muted-foreground">CISIA TOLC-S</span>
          </span>
        </Link>

        <nav aria-label={t.nav.menu} className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <MobileNav />
          <div
            role="group"
            aria-label={t.nav.language}
            className="flex overflow-hidden rounded-md border border-input"
          >
            {(["it", "en"] as Locale[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                aria-pressed={locale === code}
                className={`min-h-11 px-3 text-xs font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                  locale === code
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            aria-label={`${t.nav.theme}: ${isDark ? t.nav.themeLight : t.nav.themeDark}`}
            onClick={() => update("theme", isDark ? "light" : "dark")}
          >
            {isDark ? <Sun /> : <Moon />}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" aria-label={t.nav.quickAccessibility}>
                <SlidersHorizontal />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <AccessibilityQuickPanel />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="academic-rule h-0.5" />
    </header>
  );
}
