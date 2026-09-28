import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type React from "react";
import type { ReactNode } from "react";

import { translations, type Translation } from "@/i18n";
import { STORAGE_KEYS, storage } from "@/services/storage";
import { defaultLocale, type Locale } from "@/types/i18n";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translation;
}

// Keep one context instance across hot reloads (editing translations re-runs this module).
const g = globalThis as { __tolcsI18nContext?: React.Context<I18nContextValue | null> };
const I18nContext = (g.__tolcsI18nContext ??= createContext<I18nContextValue | null>(null));

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Read persisted locale after hydration (keeps SSR output stable).
  useEffect(() => {
    const stored = storage.getRaw(STORAGE_KEYS.locale);
    if (stored === "it" || stored === "en") setLocaleState(stored);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    storage.set(STORAGE_KEYS.locale, next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t: translations[locale] }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
