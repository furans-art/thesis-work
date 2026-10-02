import { Fraction, factorial } from "../math-utils";
import type { Archetype } from "../types";

/** Sums with a symmetric complement (5↔9, 6↔8) share the same count. */
const diceSums = [4, 5, 6, 7, 8, 9, 10] as const;

function diceCount(sum: number): number {
  return Math.max(0, 6 - Math.abs(7 - sum));
}

export const probabilityArchetypes: Archetype[] = [
  {
    id: "probabilita-dadi-somma",
    difficulty: "base",
    generate(rng) {
      const sum = rng.pick(diceSums);
      const count = diceCount(sum);
      const correct = new Fraction(count, 36);
      return {
        archetype: "probabilita-dadi-somma",
        difficulty: "base",
        text: {
          it: `Si lanciano due dadi equi a sei facce. Qual è la probabilità che la somma dei punteggi sia ${sum}?`,
          en: `Two fair six-sided dice are rolled. What is the probability that the sum of the scores is ${sum}?`,
        },
        correct: correct.toString(),
        distractors: [
          new Fraction(count, 12).toString(),
          new Fraction(count, 18).toString(),
          new Fraction(diceCount(sum + 1) || 6, 36).toString(),
        ],
        diagnoses: [
          {
            it: `Hai contato i casi favorevoli su 12: i casi possibili sono le 6 · 6 = 36 coppie ordinate, non 12.`,
            en: `You counted the favourable cases out of 12: the possible cases are the 6 · 6 = 36 ordered pairs, not 12.`,
          },
          {
            it: `Hai diviso per 18: i casi possibili sono 6 · 6 = 36, perché coppie come (${Math.min(sum, 4)}, ${Math.max(sum, 4) - Math.min(sum, 4)}) e la sua simmetrica vanno distinte.`,
            en: `You divided by 18: the possible cases are 6 · 6 = 36, because pairs like (${Math.min(sum, 4)}, ${Math.max(sum, 4) - Math.min(sum, 4)}) and its mirror must be kept distinct.`,
          },
          {
            it: `Hai contato le coppie di una somma diversa: ricontrolla l'elenco delle coppie che danno ${sum}.`,
            en: `You counted the pairs of a different sum: double-check the list of pairs giving ${sum}.`,
          },
        ],
        explanation: {
          it: `I casi possibili sono 6 · 6 = 36 coppie ordinate. I casi favorevoli sono ${count}: le coppie (a, b) con a + b = ${sum}. Quindi P = ${count}/36 = ${correct.toString()}.`,
          en: `The possible cases are 6 · 6 = 36 ordered pairs. The favourable cases are ${count}: the pairs (a, b) with a + b = ${sum}. So P = ${count}/36 = ${correct.toString()}.`,
        },
      };
    },
  },
  {
    id: "probabilita-unione-eventi",
    difficulty: "intermediate",
    generate(rng) {
      const deck = rng.pick([
        {
          favourable: 12,
          condition: "una figura (fante, donna o re)",
          conditionEn: "a face card (jack, queen or king)",
          intersection: 3,
          intersectionNote: "le figure di picche sono 3",
          intersectionNoteEn: "the face cards in spades are 3",
        },
        {
          favourable: 4,
          condition: "un asso",
          conditionEn: "an ace",
          intersection: 1,
          intersectionNote: "l'asso di picche è 1",
          intersectionNoteEn: "the ace of spades is 1",
        },
      ]);
      const correct = new Fraction(deck.favourable + 13 - deck.intersection, 52);
      return {
        archetype: "probabilita-unione-eventi",
        difficulty: "intermediate",
        text: {
          it: `Da un mazzo di 52 carte si estrae una carta. Qual è la probabilità che sia ${deck.condition} oppure di picche?`,
          en: `One card is drawn from a deck of 52. What is the probability that it is ${deck.conditionEn} or a spade?`,
        },
        correct: correct.toString(),
        distractors: [
          new Fraction(deck.favourable + 13, 52).toString(),
          new Fraction(13, 52).toString(),
          new Fraction(deck.favourable - deck.intersection, 52).toString(),
        ],
        diagnoses: [
          {
            it: `Hai sommato le due probabilità senza togliere l'intersezione: le carte che sono ${deck.condition} e di picche (${deck.intersection} in tutto) verrebbero contate due volte.`,
            en: `You added the two probabilities without removing the intersection: the cards that are both ${deck.conditionEn} and spades (${deck.intersection} of them) would be counted twice.`,
          },
          {
            it: `Hai considerato solo l'evento «picche», dimenticando la prima condizione del quesito.`,
            en: `You considered only the “spades” event, forgetting the first condition of the question.`,
          },
          {
            it: `Hai sottratto l'intersezione invece di includerla: nella formula dell'unione P(A) + P(B) − P(A ∩ B) l'intersezione va tolta una sola volta dal totale, non dal primo evento.`,
            en: `You subtracted the intersection instead of including it: in the union formula P(A) + P(B) − P(A ∩ B) the intersection is removed once from the total, not from the first event.`,
          },
        ],
        explanation: {
          it: `P(A ∪ B) = P(A) + P(B) − P(A ∩ B): ${deck.favourable}/52 + 13/52 − ${deck.intersection}/52, perché ${deck.intersectionNote}. Risultato ${deck.favourable + 13 - deck.intersection}/52 = ${correct.toString()}. Dimenticare di togliere l'intersezione porterebbe a ${deck.favourable + 13}/52, contando due volte le carte che sono ${deck.condition} e di picche insieme.`,
          en: `P(A ∪ B) = P(A) + P(B) − P(A ∩ B): ${deck.favourable}/52 + 13/52 − ${deck.intersection}/52, because ${deck.intersectionNoteEn}. Result ${deck.favourable + 13 - deck.intersection}/52 = ${correct.toString()}. Forgetting to remove the intersection would give ${deck.favourable + 13}/52, counting the cards that are both ${deck.conditionEn} and spades twice.`,
        },
      };
    },
  },
  {
    id: "bernoulli-esattamente-k",
    difficulty: "advanced",
    generate(rng) {
      const n = rng.int(3, 5);
      const k = rng.int(1, n - 1);
      const p = new Fraction(1, 2);
      const q = p.complement();
      const binomial = factorial(n) / (factorial(k) * factorial(n - k));
      const correct = new Fraction(binomial, 2 ** n);
      return {
        archetype: "bernoulli-esattamente-k",
        difficulty: "advanced",
        text: {
          it: `Una moneta equa viene lanciata ${n} volte. Qual è la probabilità di ottenere esattamente ${k} teste?`,
          en: `A fair coin is tossed ${n} times. What is the probability of getting exactly ${k} heads?`,
        },
        correct: correct.toString(),
        distractors: [
          new Fraction(1, 2 ** n).toString(),
          p.mul(q).toString(),
          new Fraction(binomial, 2 ** (n + 1)).toString(),
        ],
        diagnoses: [
          {
            it: `Hai contato una sola sequenza: esistono C(${n},${k}) = ${binomial} sequenze con esattamente ${k} teste, e vanno tutte contate.`,
            en: `You counted a single sequence: there are C(${n},${k}) = ${binomial} sequences with exactly ${k} heads, and all of them must be counted.`,
          },
          {
            it: `Hai calcolato la probabilità di un successo e un insuccesso in due lanci: qui i lanci sono ${n} e i successi esattamente ${k}.`,
            en: `You computed the probability of one success and one failure in two tosses: here there are ${n} tosses and exactly ${k} successes.`,
          },
          {
            it: `Hai diviso per 2^${n + 1}: i lanci sono ${n}, quindi le sequenze possibili sono 2^${n}.`,
            en: `You divided by 2^${n + 1}: there are ${n} tosses, so the possible sequences are 2^${n}.`,
          },
        ],
        explanation: {
          it: `Schema di Bernoulli con n = ${n}, k = ${k}, p = 1/2. Il coefficiente binomiale è C(${n},${k}) = ${binomial}, perché conta le sequenze con esattamente ${k} teste. La probabilità di ciascuna sequenza è (1/2)^${n}. Quindi P = C(${n},${k}) · (1/2)^${n} = ${binomial}/${2 ** n} = ${correct.toString()}.`,
          en: `Bernoulli scheme with n = ${n}, k = ${k}, p = 1/2. The binomial coefficient is C(${n},${k}) = ${binomial}, counting the sequences with exactly ${k} heads. Each sequence has probability (1/2)^${n}. So P = C(${n},${k}) · (1/2)^${n} = ${binomial}/${2 ** n} = ${correct.toString()}.`,
        },
      };
    },
  },
];
