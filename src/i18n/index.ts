import type { Locale } from "@/types/i18n";
import { en } from "./en";
import { it, type Translation } from "./it";

export const translations: Record<Locale, Translation> = { it, en };
export type { Translation };
