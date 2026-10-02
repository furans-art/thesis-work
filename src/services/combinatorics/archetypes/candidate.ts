import type { Fraction } from "../math-utils";
import type { DistractorCandidate, MisconceptionType } from "../types";

/** Builds one misconception candidate; non-integer numbers render invalid and are skipped by the engine. */
export function cand(
  id: string,
  type: MisconceptionType,
  value: number | Fraction,
  it: string,
  en: string,
): DistractorCandidate {
  return { id, type, value: String(value), diagnosis: { it, en } };
}
