import { describe, expect, test } from "bun:test";

import { createRng } from "../math-utils";
import { ARCHETYPES } from "../combinatorics.service";
import { resolveExercise } from "../engine";
import { categoryOf } from "../categories";
import type { ExerciseParams, ResolvedExercise } from "../types";
import { checkExercise, ORACLES } from "./index";

const SEEDS = 2000;

function byId(id: string) {
  const a = ARCHETYPES.find((x) => x.id === id);
  if (!a) throw new Error(`unknown archetype ${id}`);
  return a;
}

/** Scans seeds until the archetype draws the requested parameters. */
function instance(id: string, match: ExerciseParams): ResolvedExercise {
  const archetype = byId(id);
  for (let seed = 1; seed < 200000; seed += 1) {
    const ex = resolveExercise(archetype, createRng(seed));
    if (Object.entries(match).every(([k, v]) => ex.params[k] === v)) return ex;
  }
  throw new Error(`no seed draws ${id} ${JSON.stringify(match)}`);
}

const values = (ex: ResolvedExercise) => ex.distractors.map((d) => d.value);

describe("brute-force oracle over every archetype", () => {
  test("24 archetypes, each with an oracle and a reporting category", () => {
    expect(ARCHETYPES.length).toBe(24);
    for (const a of ARCHETYPES) {
      expect(ORACLES[a.id]).toBeDefined();
      expect(categoryOf(a.id)).toBeTruthy();
    }
  });

  for (const archetype of ARCHETYPES) {
    test(`${archetype.id}: ${SEEDS} seeds agree with enumeration and satisfy the invariants`, () => {
      for (let seed = 1; seed <= SEEDS; seed += 1) {
        const ex = resolveExercise(archetype, createRng(seed));
        const problems = checkExercise(ex);
        if (problems.length) {
          throw new Error(`${archetype.id} seed ${seed} ${JSON.stringify(ex.params)}: ${problems.join("; ")}`);
        }
      }
    });
  }
});

describe("named test vectors", () => {
  test("1a probabilita-dadi-somma, sum 8", () => {
    const ex = instance("probabilita-dadi-somma", { sum: 8 });
    expect(ex.correct).toBe("5/36");
    expect(values(ex)).toEqual(["1/6", "1/11", "1/7"]);
    expect(ex.explanation.it).toContain("(4, 4)");
  });
  test("1b urna-almeno-uno, 6 red 5 blue", () => {
    const ex = instance("urna-almeno-uno", { red: 6, blue: 5 });
    expect(ex.correct).toBe("9/11");
    expect(values(ex)).toEqual(["6/11", "2/11", "96/121"]);
  });
  test("1c urna-senza-reimmissione-entrambe-rosse, 6 red 4 blue", () => {
    const ex = instance("urna-senza-reimmissione-entrambe-rosse", { red: 6, blue: 4 });
    expect(ex.correct).toBe("1/3");
    expect(values(ex)).toEqual(["4/15", "9/25", "3/5"]);
  });
  test("1d permutazioni-ripetizione-anagrammi, SASSO", () => {
    const ex = instance("permutazioni-ripetizione-anagrammi", { word: "SASSO" });
    expect(ex.correct).toBe("20");
    expect(values(ex)).toEqual(["120", "40", "10"]);
  });
  test("1e distribuzione-oggetti-stelle-barre, k=10 n=4 m=0", () => {
    const ex = instance("distribuzione-oggetti-stelle-barre", { k: 10, n: 4, minEach: 0 });
    expect(ex.correct).toBe("286");
    expect(values(ex)).toEqual(["1048576", "120", "84"]);
  });
  test("1f combinazioni-diagonali-poligono, n=10", () => {
    const ex = instance("combinazioni-diagonali-poligono", { n: 10 });
    expect(ex.correct).toBe("35");
    expect(values(ex)).toEqual(["45", "90", "7"]);
  });
  test("1f probabilita-almeno-uno, p=1/3, 3 trials", () => {
    const ex = instance("probabilita-almeno-uno", { pd: 3, n: 3 });
    expect(ex.correct).toBe("19/27");
    expect(values(ex)).toEqual(["8/27", "4/27", "1/3"]);
  });
  test("1f combinazioni-semplici-commissione, 10 choose 3", () => {
    const ex = instance("combinazioni-semplici-commissione", { n: 10, k: 3 });
    expect(ex.correct).toBe("120");
    const d = ex.distractors.find((x) => x.value === "30");
    expect(d?.diagnosis.it).toContain("10 · 3");
    expect(d?.diagnosis.en).toContain("number of students by the number of seats");
  });
  test("1f urna-senza-reimmissione-stesso-colore, 6 red 5 blue", () => {
    const ex = instance("urna-senza-reimmissione-stesso-colore", { red: 6, blue: 5 });
    expect(ex.correct).toBe("5/11");
    expect(values(ex)).toEqual(["61/121", "10/11", "3/11"]);
  });
  test("1f probabilita-unione-eventi, ace or spade", () => {
    const ex = instance("probabilita-unione-eventi", { event: "ace" });
    expect(ex.correct).toBe("4/13");
    const d = ex.distractors.find((x) => x.value === "3/52");
    expect(d?.diagnosis.en).toContain("aces that are not spades");
    expect(d?.diagnosis.it).toContain("assi che non sono di picche");
  });
});
