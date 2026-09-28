import { useCallback, useSyncExternalStore } from "react";

import { historyService } from "@/services/history.service";
import type { SessionRecord } from "@/types/history";

const EMPTY: SessionRecord[] = [];

/** Session history from this device; empty during SSR/hydration. */
export function useHistory() {
  const version = useSyncExternalStore(historyService.subscribe, historyService.version, () => -1);
  const hydrated = version !== -1;
  const sessions = hydrated ? historyService.list() : EMPTY;
  const add = useCallback((r: SessionRecord) => historyService.add(r), []);
  return { hydrated, sessions, add, get: historyService.get };
}
