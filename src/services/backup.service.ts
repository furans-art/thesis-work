/**
 * Export and import of everything the app stores on this device, so a student
 * can carry progress between a school computer and a personal one.
 * Suggested by Kevin's Webpage_Logica (scripts/results-export.js).
 */

import { isAppKey, storage } from "@/services/storage";

export const BACKUP_FORMAT = "tolcs.backup";
export const BACKUP_VERSION = 1;

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: number;
  exportedAt: string;
  app: string;
  entries: Record<string, string>;
}

export interface ImportResult {
  ok: boolean;
  /** number of stored items written */
  written: number;
  /** machine-readable reason when ok is false */
  reason?: "unreadable" | "wrong-format" | "empty";
}

function build(): BackupFile {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    app: "TOLC-S Trainer",
    entries: storage.entries(),
  };
}

function suggestedFilename(date = new Date()): string {
  const stamp = date.toISOString().slice(0, 10);
  return `tolc-s-trainer-backup-${stamp}.json`;
}

export const backupService = {
  suggestedFilename,

  /** Number of stored items currently held on this device. */
  itemCount(): number {
    return Object.keys(storage.entries()).length;
  },

  toJson(): string {
    return JSON.stringify(build(), null, 2);
  },

  /** Triggers a browser download of the backup file. */
  download(): string {
    const filename = suggestedFilename();
    if (typeof window === "undefined" || typeof document === "undefined") return filename;
    const blob = new Blob([backupService.toJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    return filename;
  },

  /** Validates and applies a backup file's contents. */
  applyJson(text: string, mode: "merge" | "replace" = "merge"): ImportResult {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { ok: false, written: 0, reason: "unreadable" };
    }
    const file = parsed as Partial<BackupFile>;
    if (
      !file ||
      file.format !== BACKUP_FORMAT ||
      typeof file.entries !== "object" ||
      file.entries === null
    ) {
      return { ok: false, written: 0, reason: "wrong-format" };
    }
    const entries = Object.fromEntries(
      Object.entries(file.entries).filter(([k, v]) => isAppKey(k) && typeof v === "string"),
    ) as Record<string, string>;
    if (Object.keys(entries).length === 0) return { ok: false, written: 0, reason: "empty" };
    if (mode === "replace") storage.clearAll();
    const written = storage.setEntries(entries);
    return { ok: true, written };
  },

  /** Reads a file picked by the user and applies it. */
  async importFile(file: File, mode: "merge" | "replace" = "merge"): Promise<ImportResult> {
    try {
      return backupService.applyJson(await file.text(), mode);
    } catch {
      return { ok: false, written: 0, reason: "unreadable" };
    }
  },
};
