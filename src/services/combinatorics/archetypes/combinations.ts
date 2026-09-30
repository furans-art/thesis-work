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
        diagnoses: [
          {
            it: `Hai trattato l'ordine come rilevante: la delegazione non ha incarichi, quindi ogni gruppo di persone è una sola scelta e servono le combinazioni.`,
            en: `You treated order as relevant: the delegation has no roles, so each group of people is a single choice and you need combinations.`,
          },
          {
            it: `Hai moltiplicato come se i membri fossero scelte indipendenti con ripetizione: le persone si scelgono una dopo l'altra senza mai ripeterle.`,
            en: `You multiplied as if the members were independent choices with repetition: the people are chosen one after another and never repeated.`,
          },
          {
            it: `Hai contato un membro di meno: la delegazione è di ${k} persone, non ${k - 1}.`,
            en: `You counted one member too few: the delegation has ${k} people, not ${k - 1}.`,
          },
        ],
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
        diagnoses: [
          {
            it: `Hai sommato le due scelte: la somma vale per scelte alternative, ma qui le quote vanno soddisfatte contemporaneamente, quindi si moltiplicano.`,
            en: `You added the two choices: addition fits alternative choices, but here both quotas must be met at the same time, so you multiply.`,
          },
          {
            it: `Hai unito i due gruppi ignorando le quote: la squadra deve avere esattamente ${x} ragazze e ${y} ragazzi, non ${x + y} persone a caso.`,
            en: `You merged the two groups ignoring the quotas: the team needs exactly ${x} girls and ${y} boys, not any ${x + y} people.`,
          },
          {
            it: `Hai introdotto un ordine che non esiste: all'interno di ciascun gruppo le persone si scelgono senza incarichi, quindi servono le combinazioni.`,
            en: `You introduced an order that does not exist: within each group people are chosen without roles, so you need combinations.`,
          },
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
        diagnoses: [
          {
            it: `Hai contato anche i lati: ogni coppia di vertici consecutivi dà un lato, non una diagonale; vanno tolti gli ${n} lati.`,
            en: `You counted the sides too: each pair of consecutive vertices gives a side, not a diagonal; the ${n} sides must be removed.`,
          },
          {
            it: `Hai contato ogni diagonale due volte: il segmento che va da A a B è lo stesso che va da B ad A.`,
            en: `You counted each diagonal twice: the segment from A to B is the same as the one from B to A.`,
          },
          {
            it: `Hai contato solo le diagonali che passano per un vertice: ognuno dei ${n} vertici è capolinea di ${n - 3} diagonali.`,
            en: `You counted only the diagonals through one vertex: each of the ${n} vertices is the endpoint of ${n - 3} diagonals.`,
          },
        ],
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
        diagnoses: [
          {
            it: `Hai escluso l'insieme vuoto: il testo chiede di comprenderlo insieme all'insieme stesso.`,
            en: `You left out the empty set: the text asks to include it together with the set itself.`,
          },
          {
            it: `Hai contato gli ordinamenti degli elementi: un sottoinsieme non ha ordine interno, quindi non servono le permutazioni.`,
            en: `You counted orderings of the elements: a subset has no internal order, so permutations are not needed.`,
          },
          {
            it: `Hai contato solo i sottoinsiemi di due elementi: invece ogni cardinalità da 0 a ${n} contribuisce al totale.`,
            en: `You counted only the two-element subsets: in fact every cardinality from 0 to ${n} contributes.`,
          },
        ],
        explanation: {
          it: `Per ogni elemento si decide se includerlo o no: 2 · 2 · … = 2^${n} = ${correct}. Equivalentemente è la somma di tutte le combinazioni C(${n},0) + … + C(${n},${n}). Il valore ${2 ** n - 1} esclude l'insieme vuoto.`,
          en: `For each element you decide whether to include it: 2 · 2 · … = 2^${n} = ${correct}. Equivalently it is the sum of all combinations C(${n},0) + … + C(${n},${n}). The value ${2 ** n - 1} leaves out the empty set.`,
        },
      };
    },
  },
];
