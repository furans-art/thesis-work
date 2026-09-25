import { useI18n } from "@/context/i18n-context";
import type { Translation } from "@/i18n";

type SectionKey = keyof Translation["sections"];

/** Resolves a section's i18n label key to the localized section name. */
export function useSectionLabel() {
  const { t } = useI18n();
  return (labelKey: string) => t.sections[labelKey as SectionKey] ?? labelKey;
}
