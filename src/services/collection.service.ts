/**
 * Classroom data collection: sends a session record (with its immutable
 * snapshot) to a collection endpoint configured by the experiment conductor.
 *
 * The endpoint address is the university server supplied for the trial. The
 * payload is anonymous: a random session code replaces any local identifier,
 * and no browser-stored settings or accessibility preferences leave the device.
 * Nothing is sent without the student's explicit consent (checkbox in History).
 */
import type { SessionRecord } from "@/types/history";

const ENDPOINT_KEY = "tolcs.collect.url";

export function readCollectEndpoint(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ENDPOINT_KEY) || "";
}

export function saveCollectEndpoint(url: string): void {
  window.localStorage.setItem(ENDPOINT_KEY, url.trim());
}

/** Anonymous envelope: a random code, the group variant, answers, times, outcome. */
export interface CollectionPayload {
  format: "tolcs.session" as const;
  version: 1;
  sessionCode: string;
  sentAt: string;
  group: string;
  record: SessionRecord;
}

export function buildPayload(record: SessionRecord, group: string): CollectionPayload {
  const sessionCode =
    crypto.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10);
  return {
    format: "tolcs.session",
    version: 1,
    sessionCode,
    sentAt: new Date().toISOString(),
    group,
    record,
  };
}

export async function sendSession(record: SessionRecord, group: string): Promise<void> {
  const endpoint = readCollectEndpoint();
  if (!endpoint) throw new Error("no-endpoint");
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify(buildPayload(record, group)),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
