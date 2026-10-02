/**
 * Distractor invariant, enforced for all 24 archetypes.
 *
 * An archetype returns an ordered list of misconception candidates. The engine
 * keeps the first three whose values are valid (positive integer for counts,
 * reduced fraction strictly inside (0,1) for probabilities), differ from the
 * correct answer and from each other. If fewer than three survive, the
 * parameters are resampled; after a bounded number of attempts it throws.
 * There is no numeric-perturbation fallback: every option carries a diagnosis.
 */

import type { Rng } from "./math-utils";
import type { Archetype, DistractorCandidate, GeneratedExercise, ResolvedExercise } from "./types";

export const ENGINE_VERSION = 2;

const MAX_ATTEMPTS = 40;

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}

/** "a/b" in lowest terms with b > 1, or a positive integer. */
export function parseValue(value: string): { n: number; d: number } | null {
  const m = /^(\d+)(?:\/(\d+))?$/.exec(value);
  if (!m) return null;
  const n = Number(m[1]);
  const d = m[2] === undefined ? 1 : Number(m[2]);
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || d === 0) return null;
  return { n, d };
}

export function isReduced(value: string): boolean {
  const p = parseValue(value);
  if (!p) return false;
  if (p.d === 1) return !value.includes("/");
  return gcd(p.n, p.d) === 1;
}

export function isValidValue(value: string, kind: GeneratedExercise["kind"]): boolean {
  const p = parseValue(value);
  if (!p || !isReduced(value)) return false;
  if (kind === "count") return p.d === 1 && p.n > 0;
  return p.n > 0 && p.n < p.d;
}

export function selectDistractors(ex: GeneratedExercise): DistractorCandidate[] {
  const seen = new Set<string>([ex.correct]);
  const out: DistractorCandidate[] = [];
  for (const c of ex.candidates) {
    if (out.length === 3) break;
    if (!isValidValue(c.value, ex.kind) || seen.has(c.value)) continue;
    seen.add(c.value);
    out.push(c);
  }
  return out;
}

export function resolveExercise(archetype: Archetype, rng: Rng): ResolvedExercise {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const ex = archetype.generate(rng);
    if (!isValidValue(ex.correct, ex.kind) && !(ex.kind === "probability" && ex.correct === "1")) {
      continue;
    }
    const picked = selectDistractors(ex);
    if (picked.length < 3) continue;
    const { candidates, ...rest } = ex;
    return {
      ...rest,
      distractors: [picked[0]!, picked[1]!, picked[2]!],
      pool: candidates,
    };
  }
  throw new Error(`combinatorics engine: ${archetype.id} could not produce 3 valid distractors`);
}
