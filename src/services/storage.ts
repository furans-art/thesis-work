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

  /** Every key this app owns on this device, with its raw JSON string value. */
  entries(): Record<string, string> {
    if (!isBrowser()) return {};
    const out: Record<string, string> = {};
    try {
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const k = window.localStorage.key(i);
        if (!k || !isAppKey(k)) continue;
        const v = window.localStorage.getItem(k);
        if (v !== null) out[k] = v;
      }
    } catch {
      /* noop */
    }
    return out;
  },

  /** Writes a set of raw key/value pairs, ignoring keys this app does not own. */
  setEntries(entries: Record<string, string>): number {
    if (!isBrowser()) return 0;
    let written = 0;
    for (const [k, v] of Object.entries(entries)) {
      if (!isAppKey(k) || typeof v !== "string") continue;
      try {
        window.localStorage.setItem(k, v);
        written += 1;
      } catch {
        /* noop */
      }
    }
    return written;
  },

  /** Removes every key this app has written on this device. */
  clearAll(): void {
    if (!isBrowser()) return;
    try {
      Object.keys(storage.entries()).forEach((k) => window.localStorage.removeItem(k));
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

/** Keys owned by this app: the versioned `tolcs.*` keys plus per-target settings. */
export function isAppKey(key: string): boolean {
  return key.startsWith("tolcs.") || key.startsWith("settings:");
}
