import type { Question } from "@/services/questionService";
import { ENGINE_VERSION } from "./engine";

/** Archetypes whose answer key or options were wrong before engine v2. */
const AFFECTED = [
  "probabilita-dadi-somma",
  "urna-almeno-uno",
  "urna-senza-reimmissione-entrambe-rosse",
  "permutazioni-ripetizione-anagrammi",
  "distribuzione-oggetti-stelle-barre",
];

/** True for stored questions produced by a pre-v2 engine for an affected archetype (read-only check). */
export function isLegacyEngineQuestion(q: Question): boolean {
  if ((q.engineVersion ?? 1) >= ENGINE_VERSION) return false;
  return AFFECTED.some((a) => q.id.startsWith(`combinatoria-${a}-`));
}
