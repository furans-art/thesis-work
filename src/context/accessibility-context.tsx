import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { STORAGE_KEYS, storage } from "@/services/storage";
import {
  defaultAccessibilitySettings,
  type AccessibilitySettings,
} from "@/types/accessibility";

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  update: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K],
  ) => void;
  reset: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function applyToDocument(settings: AccessibilitySettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset["dyslexia"] = String(settings.dyslexiaFont);
  root.dataset["fontSize"] = settings.fontSize;
  root.dataset["contrast"] = settings.contrast;
  root.dataset["cvd"] = settings.cvdPalette;
  root.dataset["reducedMotion"] = String(settings.reducedMotion);
  root.classList.toggle("dark", settings.theme === "dark");
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(
    defaultAccessibilitySettings,
  );

  // Hydrate from storage on the client only.
  useEffect(() => {
    setSettings(
      storage.get<AccessibilitySettings>(
        STORAGE_KEYS.accessibility,
        defaultAccessibilitySettings,
      ),
    );
  }, []);

  useEffect(() => {
    applyToDocument(settings);
  }, [settings]);

  const update = useCallback<AccessibilityContextValue["update"]>((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      storage.set(STORAGE_KEYS.accessibility, next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setSettings(defaultAccessibilitySettings);
    storage.set(STORAGE_KEYS.accessibility, defaultAccessibilitySettings);
  }, []);

  const value = useMemo(() => ({ settings, update, reset }), [settings, update, reset]);

  return (
    <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used inside <AccessibilityProvider>");
  return ctx;
}
