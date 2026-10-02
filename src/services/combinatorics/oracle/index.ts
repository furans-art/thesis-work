/**
 * Independent brute-force oracle.
 *
 * Every archetype's answer is recomputed by exhaustive enumeration of the
 * outcomes (sequences, subsets, arrangements, card decks, dice pairs…). This
 * module deliberately imports NO formula from the archetypes or math-utils:
 * it only shares the parameter names that the archetypes record in `params`.
 * Parameters stay small enough for enumeration across the generators' ranges.
 */

import { MISCONCEPTION_TYPES, type ExerciseParams, type ResolvedExercise } from "../types";

/* ---------- local helpers (no shared formulas) ---------- */

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}

function ratio(num: number, den: number): string {
  const g = gcd(num, den) || 1;
  const n = num / g;
  const d = den / g;
  return d === 1 ? `${n}` : `${n}/${d}`;
}

function popcount(x: number): number {
  let c = 0;
  let v = x;
  while (v) {
    c += v & 1;
    v >>>= 1;
  }
  return c;
}

function* permutationsOf<T>(items: T[]): Generator<T[]> {
  if (items.length <= 1) {
    yield [...items];
    return;
  }
  for (let i = 0; i < items.length; i += 1) {
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const p of permutationsOf(rest)) yield [items[i]!, ...p];
  }
}

/** Counts every length-k sequence over 0..n-1, optionally without repeats, satisfying `ok`. */
function countSequences(n: number, k: number, distinct: boolean, ok: (s: number[]) => boolean = () => true): number {
  let count = 0;
  const seq: number[] = [];
  const used = new Array<boolean>(n).fill(false);
  const visit = () => {
    if (seq.length === k) {
      if (ok(seq)) count += 1;
      return;
    }
    for (let v = 0; v < n; v += 1) {
      if (distinct && used[v]) continue;
      used[v] = true;
      seq.push(v);
      visit();
      seq.pop();
      used[v] = false;
    }
  };
  visit();
  return count;
}

const num = (p: ExerciseParams, key: string): number => {
  const v = p[key];
  if (typeof v !== "number") throw new Error(`oracle: missing numeric param ${key}`);
  return v;
};
const str = (p: ExerciseParams, key: string): string => {
  const v = p[key];
  if (typeof v !== "string") throw new Error(`oracle: missing string param ${key}`);
  return v;
};

function distinctAnagrams(word: string): number {
  const seen = new Set<string>();
  for (const p of permutationsOf(word.split(""))) seen.add(p.join(""));
  return seen.size;
}

function circularClasses(n: number, mirror: boolean, keep: (seat: number[]) => boolean): number {
  const classes = new Set<string>();
  const people = Array.from({ length: n }, (_, i) => i);
  for (const p of permutationsOf(people)) {
    if (!keep(p)) continue;
    const variants: number[][] = [p];
    if (mirror) variants.push([...p].reverse());
    let best: string | null = null;
    for (const v of variants) {
      for (let r = 0; r < n; r += 1) {
        const key = [...v.slice(r), ...v.slice(0, r)].join(",");
        if (best === null || key < best) best = key;
      }
    }
    classes.add(best!);
  }
  return classes.size;
}

/* ---------- one oracle per archetype ---------- */

type Oracle = (p: ExerciseParams) => string;

const parityOk = (digit: number, rule: string) =>
  rule === "any" || (rule === "even" ? digit % 2 === 0 : digit % 2 === 1);

export const ORACLES: Record<string, Oracle> = {
  "disposizioni-semplici-codice": (p) => `${countSequences(num(p, "n"), num(p, "k"), true)}`,
  "disposizioni-ripetizione-targa": (p) => `${countSequences(num(p, "n"), num(p, "k"), false)}`,
  "disposizioni-podio": (p) => `${countSequences(num(p, "n"), 3, true)}`,
  "disposizioni-vincolo-posizione": (p) => {
    const first = str(p, "first");
    const last = str(p, "last");
    return `${countSequences(10, num(p, "length"), true, (s) => parityOk(s[0]!, first) && parityOk(s[s.length - 1]!, last))}`;
  },
  "permutazioni-semplici-anagrammi": (p) => `${distinctAnagrams(str(p, "word"))}`,
  "permutazioni-ripetizione-anagrammi": (p) => `${distinctAnagrams(str(p, "word"))}`,
  "permutazioni-vincolo-vicinanza": (p) => {
    const n = num(p, "n");
    let count = 0;
    for (const perm of permutationsOf(Array.from({ length: n }, (_, i) => i))) {
      if (Math.abs(perm.indexOf(0) - perm.indexOf(1)) === 1) count += 1;
    }
    return `${count}`;
  },
  "combinazioni-semplici-commissione": (p) => {
    const n = num(p, "n");
    const k = num(p, "k");
    let count = 0;
    for (let m = 0; m < 1 << n; m += 1) if (popcount(m) === k) count += 1;
    return `${count}`;
  },
  "combinazioni-quote-gruppi": (p) => {
    const a = num(p, "a");
    const b = num(p, "b");
    const girlsMask = (1 << a) - 1;
    let count = 0;
    for (let m = 0; m < 1 << (a + b); m += 1) {
      if (popcount(m & girlsMask) === num(p, "x") && popcount(m >>> a) === num(p, "y")) count += 1;
    }
    return `${count}`;
  },
  "combinazioni-diagonali-poligono": (p) => {
    const n = num(p, "n");
    let count = 0;
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const adjacent = j - i === 1 || (i === 0 && j === n - 1);
        if (!adjacent) count += 1;
      }
    }
    return `${count}`;
  },
  "combinazioni-sottoinsiemi": (p) => {
    let count = 0;
    for (let m = 0; m < 1 << num(p, "n"); m += 1) count += 1;
    return `${count}`;
  },
  "urna-senza-reimmissione-stesso-colore": (p) => {
    const balls = [...Array<string>(num(p, "red")).fill("R"), ...Array<string>(num(p, "blue")).fill("B")];
    let fav = 0;
    let all = 0;
    for (let i = 0; i < balls.length; i += 1) {
      for (let j = i + 1; j < balls.length; j += 1) {
        all += 1;
        if (balls[i] === balls[j]) fav += 1;
      }
    }
    return ratio(fav, all);
  },
  "urna-senza-reimmissione-entrambe-rosse": (p) => {
    const balls = [...Array<string>(num(p, "red")).fill("R"), ...Array<string>(num(p, "blue")).fill("B")];
    let fav = 0;
    let all = 0;
    for (let i = 0; i < balls.length; i += 1) {
      for (let j = 0; j < balls.length; j += 1) {
        if (i === j) continue;
        all += 1;
        if (balls[i] === "R" && balls[j] === "R") fav += 1;
      }
    }
    return ratio(fav, all);
  },
  "urna-almeno-uno": (p) => {
    const balls = [...Array<string>(num(p, "red")).fill("R"), ...Array<string>(num(p, "blue")).fill("B")];
    let fav = 0;
    let all = 0;
    for (let i = 0; i < balls.length; i += 1) {
      for (let j = i + 1; j < balls.length; j += 1) {
        all += 1;
        if (balls[i] === "R" || balls[j] === "R") fav += 1;
      }
    }
    return ratio(fav, all);
  },
  "probabilita-dadi-somma": (p) => {
    let fav = 0;
    let all = 0;
    for (let a = 1; a <= 6; a += 1) {
      for (let b = 1; b <= 6; b += 1) {
        all += 1;
        if (a + b === num(p, "sum")) fav += 1;
      }
    }
    return ratio(fav, all);
  },
  "probabilita-unione-eventi": (p) => {
    const event = str(p, "event");
    let fav = 0;
    let all = 0;
    for (let suit = 0; suit < 4; suit += 1) {
      for (let rank = 1; rank <= 13; rank += 1) {
        all += 1;
        const first = event === "ace" ? rank === 1 : rank >= 11;
        const spade = suit === 0;
        if (first || spade) fav += 1;
      }
    }
    return ratio(fav, all);
  },
  "probabilita-almeno-uno": (p) => {
    const faces = num(p, "pd");
    const n = num(p, "n");
    let all = 0;
    let fav = 0;
    for (let code = 0; code < faces ** n; code += 1) {
      all += 1;
      let c = code;
      let hit = false;
      for (let i = 0; i < n; i += 1) {
        if (c % faces === 0) hit = true;
        c = Math.floor(c / faces);
      }
      if (hit) fav += 1;
    }
    return ratio(fav, all);
  },
  "probabilita-totale-bayes": (p) => {
    const pieces: { machine: 1 | 2; defective: boolean }[] = [];
    for (let i = 0; i < num(p, "n1"); i += 1) pieces.push({ machine: 1, defective: i % num(p, "r1d") < num(p, "r1n") });
    for (let i = 0; i < num(p, "n2"); i += 1) pieces.push({ machine: 2, defective: i % num(p, "r2d") < num(p, "r2n") });
    if (pieces.length !== num(p, "batch")) throw new Error("oracle: batch mismatch");
    const defective = pieces.filter((x) => x.defective);
    if (str(p, "ask") === "total") return ratio(defective.length, pieces.length);
    return ratio(defective.filter((x) => x.machine === 1).length, defective.length);
  },
  "bernoulli-esattamente-k": (p) => {
    const n = num(p, "n");
    let fav = 0;
    let all = 0;
    for (let m = 0; m < 1 << n; m += 1) {
      all += 1;
      if (popcount(m) === num(p, "k")) fav += 1;
    }
    return ratio(fav, all);
  },
  "principio-cassetti-dirichlet": (p) => {
    const m = num(p, "m");
    const k = num(p, "k");
    // smallest N such that EVERY distribution of N items into m colours has a colour with ≥ k
    for (let total = 1; total < 100; total += 1) {
      let escape = false;
      const counts = new Array<number>(m).fill(0);
      const visit = (colour: number, left: number) => {
        if (escape) return;
        if (colour === m - 1) {
          counts[colour] = left;
          if (counts.every((c) => c < k)) escape = true;
          return;
        }
        for (let c = 0; c <= left; c += 1) {
          counts[colour] = c;
          visit(colour + 1, left - c);
        }
      };
      visit(0, total);
      if (!escape) return `${total}`;
    }
    throw new Error("oracle: pigeonhole search exhausted");
  },
  "distribuzione-oggetti-stelle-barre": (p) => {
    const k = num(p, "k");
    const n = num(p, "n");
    const min = num(p, "minEach");
    let count = 0;
    const visit = (holder: number, left: number) => {
      if (holder === n - 1) {
        if (left >= min) count += 1;
        return;
      }
      for (let c = min; c <= left; c += 1) visit(holder + 1, left - c);
    };
    visit(0, k);
    return `${count}`;
  },
  "permutazioni-cicliche": (p) => {
    const n = num(p, "n");
    const variant = str(p, "variant");
    if (variant === "plain") return `${circularClasses(n, false, () => true)}`;
    if (variant === "mirror") return `${circularClasses(n, true, () => true)}`;
    return `${circularClasses(n, false, (seat) => {
      const i = seat.indexOf(0);
      const j = seat.indexOf(1);
      const d = Math.abs(i - j);
      return d !== 1 && d !== n - 1;
    })}`;
  },
  "binomio-newton": (p) => {
    const n = num(p, "n");
    const a = num(p, "a");
    const b = num(p, "b");
    // pick "a·x" or "b" from each of the n factors and add the products with exactly k x's
    let total = 0;
    for (let m = 0; m < 1 << n; m += 1) {
      if (popcount(m) !== num(p, "k")) continue;
      let prod = 1;
      for (let i = 0; i < n; i += 1) prod *= m & (1 << i) ? a : b;
      total += prod;
    }
    return `${total}`;
  },
  "inclusione-esclusione": (p) => {
    if (num(p, "sets") === 2) {
      const a = num(p, "a");
      const b = num(p, "b");
      const both = num(p, "both");
      let count = 0;
      for (let s = 0; s < num(p, "total"); s += 1) {
        const swims = s < a;
        const runs = s >= a - both && s < a - both + b;
        if (swims || runs) count += 1;
      }
      return `${count}`;
    }
    let count = 0;
    for (let x = 1; x <= num(p, "n"); x += 1) if (x % 2 === 0 || x % 3 === 0 || x % 5 === 0) count += 1;
    return `${count}`;
  },
};

const memo = new Map<string, string>();

export function oracleAnswer(archetype: string, params: ExerciseParams): string {
  const oracle = ORACLES[archetype];
  if (!oracle) throw new Error(`no oracle for archetype ${archetype}`);
  const key = `${archetype}|${JSON.stringify(params)}`;
  let hit = memo.get(key);
  if (hit === undefined) {
    hit = oracle(params);
    memo.set(key, hit);
  }
  return hit;
}

/* ---------- invariant checks shared by tests and the dataset builder ---------- */

function isReducedValue(v: string): boolean {
  const m = /^(\d+)(?:\/(\d+))?$/.exec(v);
  if (!m) return false;
  if (m[2] === undefined) return true;
  const d = Number(m[2]);
  return d > 1 && gcd(Number(m[1]), d) === 1;
}

/** Returns the list of violated invariants (empty when the exercise is sound). */
export function checkExercise(ex: ResolvedExercise): string[] {
  const problems: string[] = [];
  const expected = oracleAnswer(ex.archetype, ex.params);
  if (expected !== ex.correct) problems.push(`correct ${ex.correct} ≠ oracle ${expected}`);
  const options = [ex.correct, ...ex.distractors.map((d) => d.value)];
  if (options.length !== 4) problems.push(`expected 4 options, got ${options.length}`);
  if (new Set(options).size !== options.length) problems.push(`duplicate options ${options.join(", ")}`);
  for (const d of ex.distractors) {
    if (d.value === ex.correct) problems.push(`distractor ${d.id} equals the correct answer`);
    if (!d.id) problems.push("distractor without misconception id");
    if (!(MISCONCEPTION_TYPES as readonly string[]).includes(d.type)) problems.push(`distractor ${d.id} has invalid type ${d.type}`);
    if (!d.diagnosis.it?.trim() || !d.diagnosis.en?.trim()) problems.push(`distractor ${d.id} lacks IT/EN diagnosis`);
  }
  for (const v of options) if (!isReducedValue(v)) problems.push(`value ${v} is not a reduced integer/fraction`);
  if (!ex.text.it?.trim() || !ex.text.en?.trim()) problems.push("missing IT/EN text");
  if (!ex.explanation.it?.trim() || !ex.explanation.en?.trim()) problems.push("missing IT/EN explanation");
  return problems;
}
