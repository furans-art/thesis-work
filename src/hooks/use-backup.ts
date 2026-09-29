import { useCallback, useState } from "react";

import { backupService, type ImportResult } from "@/services/backup.service";
import { storage } from "@/services/storage";

/** Client-side glue for exporting/importing the local backup file. */
export function useBackup() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [itemCount, setItemCount] = useState(0);

  const refreshCount = useCallback(() => {
    setItemCount(backupService.itemCount());
  }, []);

  const exportBackup = useCallback(() => {
    return backupService.download();
  }, []);

  const importBackup = useCallback(
    async (file: File, mode: "merge" | "replace" = "merge") => {
      setBusy(true);
      try {
        const r = await backupService.importFile(file, mode);
        setResult(r);
        refreshCount();
        if (r.ok) storage.reloadPage();
        return r;
      } finally {
        setBusy(false);
      }
    },
    [refreshCount],
  );

  return { exportBackup, importBackup, result, busy, itemCount, refreshCount };
}
