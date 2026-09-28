import { useCallback, useSyncExternalStore } from "react";

import { defaultSettings, settingsService } from "@/services/settings.service";
import type { SimulationSettings, SimulationTarget } from "@/types/settings";

/**
 * Settings store backed by localStorage (`settings:{sectionId}`).
 * On the server / during hydration it returns defaults, then re-renders with saved values.
 */
export function useSettingsStore() {
  const version = useSyncExternalStore(
    settingsService.subscribe,
    settingsService.version,
    () => -1,
  );
  const hydrated = version !== -1;

  const getSettings = useCallback(
    (target: SimulationTarget): SimulationSettings =>
      hydrated ? settingsService.get(target) : defaultSettings(target),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hydrated, version],
  );
  const hasSaved = useCallback(
    (target: SimulationTarget) => hydrated && settingsService.hasSaved(target),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hydrated, version],
  );

  return {
    hydrated,
    getSettings,
    hasSaved,
    saveSettings: settingsService.save,
    resetSettings: settingsService.reset,
  };
}
