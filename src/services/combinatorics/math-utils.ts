/**
 * Exact arithmetic and counting helpers for the Combinatorics & Probability
 * generator. Everything here is pure: no randomness is read from globals,
 * the caller always passes an Rng so a sequence can be reproduced.
 */

export interface Rng {
  /** integer in [min, max] */
  int(min: number, max: number): number;
  /** one element of a non-empty array */
  pick<T>(items: readonly T[]): T;
  /** shuffled copy */
  shuffle<T>(items: readonly T[]): T[];
}

/** Mulberry32: tiny, fast, seedable. */
export function createRng(seed = Math.floor(Math.random() * 2 ** 32)): Rng {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng: Rng = {
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (items) => items[Math.floor(next() * items.length)]!,
    shuffle: (items) => {
      const a = [...items];
      for (let i = a.length - 1; i > 0; i -= 1) {
        const j = Math.floor(next() * (i + 1));
        [a[i], a[j]] = [a[j]!, a[i]!];
      }
      return a;
    },
  };
  return rng;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

/** Exact rational, always stored in lowest terms with a positive denominator. */
export class Fraction {
  readonly n: number;
  readonly d: number;

  constructor(n: number, d = 1) {
    if (d === 0) throw new Error("Fraction: zero denominator");
    const sign = d < 0 ? -1 : 1;
    const g = gcd(n, d);
    this.n = (sign * n) / g;
    this.d = (sign * d) / g;
  }

  static of(n: number, d = 1): Fraction {
    return new Fraction(n, d);
  }

  add(other: Fraction): Fraction {
    return new Fraction(this.n * other.d + other.n * this.d, this.d * other.d);
  }

  sub(other: Fraction): Fraction {
    return new Fraction(this.n * other.d - other.n * this.d, this.d * other.d);
  }

  mul(other: Fraction): Fraction {
    return new Fraction(this.n * other.n, this.d * other.d);
  }

  div(other: Fraction): Fraction {
    return new Fraction(this.n * other.d, this.d * other.n);
  }

  complement(): Fraction {
    return new Fraction(this.d - this.n, this.d);
  }

  equals(other: Fraction): boolean {
    return this.n === other.n && this.d === other.d;
  }

  get value(): number {
    return this.n / this.d;
  }

  /** "3/8", or "2" when the denominator reduces away. */
  toString(): string {
    return this.d === 1 ? `${this.n}` : `${this.n}/${this.d}`;
  }
}

export function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i += 1) r *= i;
  return r;
}

/** Simple dispositions D(n,k) = n!/(n−k)! — ordered, no repetition. */
export function dispositions(n: number, k: number): number {
  let r = 1;
  for (let i = 0; i < k; i += 1) r *= n - i;
  return r;
}

/** Dispositions with repetition = n^k. */
export function dispositionsWithRepetition(n: number, k: number): number {
  return n ** k;
}

/** Combinations C(n,k) — unordered, no repetition. Computed without overflow. */
export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  const kk = Math.min(k, n - k);
  let r = 1;
  for (let i = 1; i <= kk; i += 1) r = (r * (n - kk + i)) / i;
  return Math.round(r);
}

/** Permutations with repetition: n! / (r1! · r2! · …). */
export function permutationsWithRepetition(total: number, repeats: number[]): number {
  return repeats.reduce((acc, r) => acc / factorial(r), factorial(total));
}

/** Formats a fraction as a percentage only when it is exact to one decimal. */
export function asPercent(f: Fraction): string {
  const p = f.value * 100;
  return `${Number.isInteger(p) ? p : p.toFixed(1)}%`;
}
