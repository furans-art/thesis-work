import { useEffect, useState } from "react";

import { useSettingsStore } from "@/hooks/use-settings-store";
import type { SimulationSettings, SimulationTarget } from "@/types/settings";

/** Local editable copy of a target's settings, synced once saved values load. */
export function useSettingsForm(target: SimulationTarget) {
  const store = useSettingsStore();
  const [form, setForm] = useState<SimulationSettings>(() => store.getSettings(target));

  useEffect(() => {
    if (store.hydrated) setForm(store.getSettings(target));
    // only resync on hydration / target change, not on every save
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.hydrated, target]);

  const update = <K extends keyof SimulationSettings>(key: K, value: SimulationSettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = () => store.saveSettings(target, form);

  return { form, update, save };
}
