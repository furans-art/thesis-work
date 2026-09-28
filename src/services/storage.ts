/**
 * The only place in the app that touches localStorage.
 * UI components must go through hooks that use this service, so the app can be
 * ported to Next.js (SSR) without touching component code.
 */

const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

export const storage = {
  get<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      return { ...fallback, ...(JSON.parse(raw) as object) } as T;
    } catch {
      return fallback;
    }
  },

  getRaw(key: string): string | null {
    if (!isBrowser()) return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: unknown): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(
        key,
        typeof value === "string" ? value : JSON.stringify(value),
      );
    } catch {
      /* storage full or blocked — settings stay session-only */
    }
  },

  /** Removes every key this app has written on this device. */
  clearAll(): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.clear();
    } catch {
      /* noop */
    }
  },

  reloadPage(): void {
    if (typeof window !== "undefined") window.location.reload();
  },

  remove(key: string): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* noop */
    }
  },
};

export const STORAGE_KEYS = {
  accessibility: "tolcs.accessibility.v1",
  locale: "tolcs.locale.v1",
  history: "tolcs.history.v1",
} as const;
