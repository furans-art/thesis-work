/**
 * Standardised prompting protocol.
 *
 * Every model receives exactly the same instructions, in the same language as
 * the item, and must answer with a single JSON object. Keeping the protocol
 * fixed is what makes the comparison across models legitimate.
 */

import type { BenchmarkItem, OptionLabel } from "./dataset";
import { OPTION_LABELS } from "./dataset";

export type PromptLocale = "it" | "en";

export const SYSTEM_PROMPT: Record<PromptLocale, string> = {
  it: [
    "Sei un risolutore esperto di calcolo combinatorio e probabilità elementare.",
    "Risolvi il quesito a scelta multipla.",
    "Rispondi esclusivamente con un oggetto JSON valido, senza testo aggiuntivo,",
    'nella forma {"solution": "<sintetico passaggio di calcolo>", "choice": "A"|"B"|"C"|"D"}.',
  ].join(" "),
  en: [
    "You are an expert solver of combinatorics and elementary probability problems.",
    "Solve the multiple-choice question.",
    "Answer only with a valid JSON object, with no extra text,",
    'shaped as {"solution": "<concise calculation step>", "choice": "A"|"B"|"C"|"D"}.',
  ].join(" "),
};

export function buildUserPrompt(item: BenchmarkItem, locale: PromptLocale): string {
  const options = OPTION_LABELS.map((l) => `${l}) ${item.options[l]}`).join("\n");
  const head = locale === "it" ? "Quesito" : "Question";
  const opts = locale === "it" ? "Opzioni" : "Options";
  return `${head}:\n${item.text[locale]}\n\n${opts}:\n${options}`;
}

/**
 * Tolerant answer extraction: models often wrap JSON in prose or code fences,
 * or reply with a bare letter. Returning null marks the answer unparsable,
 * which is reported separately and never counted as a correct answer.
 */
export function parseChoice(raw: string): OptionLabel | null {
  const text = raw.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]) as { choice?: unknown };
      const choice = String(parsed.choice ?? "")
        .trim()
        .toUpperCase();
      if ((OPTION_LABELS as readonly string[]).includes(choice)) return choice as OptionLabel;
    } catch {
      // fall through to the textual heuristics below
    }
  }
  // Accept both "choice" and legacy "answer"/"solution" key spellings.
  const quoted = text.match(/"(?:choice|answer)"\s*:\s*"?([ABCD])"?/i);
  if (quoted?.[1]) return quoted[1].toUpperCase() as OptionLabel;
  const trailing = text.match(/\b([ABCD])\b(?![\s\S]*\b[ABCD]\b)/);
  if (trailing?.[1]) return trailing[1].toUpperCase() as OptionLabel;
  return null;
}
