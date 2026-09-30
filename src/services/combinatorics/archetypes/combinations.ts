import { combinations, dispositions, factorial } from "../math-utils";
import type { Archetype } from "../types";

export const combinationArchetypes: Archetype[] = [
  {
    id: "combinazioni-semplici-commissione",
    difficulty: "base",
    generate(rng) {
      const n = rng.int(6, 12);
      const k = rng.int(2, 4);
      const correct = combinations(n, k);
      return {
        archetype: "combinazioni-semplici-commissione",
        difficulty: "base",
        text: {
          it: `In una classe di ${n} studenti si deve scegliere una delegazione di ${k} persone, senza assegnare incarichi diversi. Quante delegazioni diverse sono possibili?`,
          en: `From a class of ${n} students a delegation of ${k} people must be chosen, with no distinct roles assigned. How many different delegations are possible?`,
        },
        correct: `${correct}`,
        distractors: [`${dispositions(n, k)}`, `${n * k}`, `${combinations(n, k - 1)}`],
        explanation: {
          it: `Nessun incarico distingue i membri, quindi l'ordine non conta: C(${n},${k}) = ${n}! / (${k}! · ${n - k}!) = ${correct}. Se i ruoli fossero diversi l'ordine conterebbe e si otterrebbe D(${n},${k}) = ${dispositions(n, k)}.`,
          en: `No role distinguishes the members, so order does not matter: C(${n},${k}) = ${n}! / (${k}! · ${n - k}!) = ${correct}. With distinct roles order would matter and the answer would be D(${n},${k}) = ${dispositions(n, k)}.`,
        },
      };
    },
  },
  {
    id: "combinazioni-quote-gruppi",
    difficulty: "intermediate",
    generate(rng) {
      const a = rng.int(4, 8);
      const b = rng.int(4, 8);
      const x = rng.int(2, 3);
      const y = rng.int(1, 2);
      const correct = combinations(a, x) * combinations(b, y);
      return {
        archetype: "combinazioni-quote-gruppi",
        difficulty: "intermediate",
        text: {
          it: `Un gruppo è formato da ${a} ragazze e ${b} ragazzi. In quanti modi si può comporre una squadra di ${x} ragazze e ${y} ragazzi?`,
          en: `A group consists of ${a} girls and ${b} boys. In how many ways can a team of ${x} girls and ${y} boys be formed?`,
        },
        correct: `${correct}`,
        distractors: [
          `${combinations(a, x) + combinations(b, y)}`,
          `${combinations(a + b, x + y)}`,
          `${dispositions(a, x) * dispositions(b, y)}`,
        ],
        explanation: {
          it: `Le due scelte sono indipendenti e vanno moltiplicate: C(${a},${x}) · C(${b},${y}) = ${combinations(a, x)} · ${combinations(b, y)} = ${correct}. Sommare i due valori (${combinations(a, x) + combinations(b, y)}) sarebbe corretto solo per scelte alternative, non simultanee; C(${a + b},${x + y}) = ${combinations(a + b, x + y)} ignora le quote richieste.`,
          en: `The two choices are independent and must be multiplied: C(${a},${x}) · C(${b},${y}) = ${combinations(a, x)} · ${combinations(b, y)} = ${correct}. Adding them (${combinations(a, x) + combinations(b, y)}) would only fit alternative, not simultaneous, choices; C(${a + b},${x + y}) = ${combinations(a + b, x + y)} ignores the required quotas.`,
        },
      };
    },
  },
  {
    id: "combinazioni-diagonali-poligono",
    difficulty: "intermediate",
    generate(rng) {
      const n = rng.int(6, 12);
      const correct = combinations(n, 2) - n;
      return {
        archetype: "combinazioni-diagonali-poligono",
        difficulty: "intermediate",
        text: {
          it: `Quante diagonali ha un poligono convesso con ${n} vertici?`,
          en: `How many diagonals does a convex polygon with ${n} vertices have?`,
        },
        correct: `${correct}`,
        distractors: [`${combinations(n, 2)}`, `${n * (n - 1)}`, `${n}`],
        explanation: {
          it: `Ogni coppia di vertici determina un segmento: C(${n},2) = ${combinations(n, 2)}. Di questi, ${n} sono i lati del poligono e non diagonali, quindi ${combinations(n, 2)} − ${n} = ${correct}.`,
          en: `Each pair of vertices determines a segment: C(${n},2) = ${combinations(n, 2)}. Of these, ${n} are the polygon's sides rather than diagonals, so ${combinations(n, 2)} − ${n} = ${correct}.`,
        },
      };
    },
  },
  {
    id: "combinazioni-sottoinsiemi",
    difficulty: "advanced",
    generate(rng) {
      const n = rng.int(4, 7);
      const correct = 2 ** n;
      return {
        archetype: "combinazioni-sottoinsiemi",
        difficulty: "advanced",
        text: {
          it: `Quanti sottoinsiemi, compresi l'insieme vuoto e l'insieme stesso, ha un insieme di ${n} elementi?`,
          en: `How many subsets, including the empty set and the set itself, does a set of ${n} elements have?`,
        },
        correct: `${correct}`,
        distractors: [`${2 ** n - 1}`, `${factorial(n)}`, `${combinations(n, 2)}`],
        explanation: {
          it: `Per ogni elemento si decide se includerlo o no: 2 · 2 · … = 2^${n} = ${correct}. Equivalentemente è la somma di tutte le combinazioni C(${n},0) + … + C(${n},${n}). Il valore ${2 ** n - 1} esclude l'insieme vuoto.`,
          en: `For each element you decide whether to include it: 2 · 2 · … = 2^${n} = ${correct}. Equivalently it is the sum of all combinations C(${n},0) + … + C(${n},${n}). The value ${2 ** n - 1} leaves out the empty set.`,
        },
      };
    },
  },
];
