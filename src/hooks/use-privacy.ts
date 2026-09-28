import { storage } from "@/services/storage";

/** Wipes everything the app stored on this device and reloads. */
export function usePrivacy() {
  return {
    deleteAllData() {
      storage.clearAll();
      storage.reloadPage();
    },
  };
}
