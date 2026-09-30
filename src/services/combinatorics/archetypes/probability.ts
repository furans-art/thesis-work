import { Fraction, asPercent, factorial } from "../math-utils";
import type { Archetype } from "../types";

/** Sums with a symmetric complement (5↔9, 6↔8) share the same count. */
const diceSums = [4, 5, 6, 7, 8, 9, 10] as const;

function diceCount(sum: number): number {
  if (sum === 7) return 6;
  return 7 - Math.abs(7 - sum);
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
        { favourable: 12, condition: "una figura (J, Q o K)", conditionEn: "a face card (J, Q or K)" },
        { favourable: 13, condition: "una carta di cuori", conditionEn: "a heart" },
        { favourable: 4, condition: "un asso", conditionEn: "an ace" },
      ]);
      // A ∩ B: ace of hearts (1) or a red face card (6) or face card in hearts (3).
      const intersection = deck.favourable === 12 ? 6 : deck.favourable === 13 ? 3 : 1;
      const correct = new Fraction(deck.favourable + deck.favourable - intersection, 52);
      void deck.condition;
      void deck.conditionEn;
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
          new Fraction(deck.favourable - intersection, 52).toString(),
        ],
        explanation: {
          it: `P = P(figura) + P(picche) − P(entrambe), con ${deck.favourable}/52 + 13/52 − ${intersection}/52 = ${deck.favourable + 13 - intersection}/52 = ${correct.toString()}. Dimenticare di togliere l'intersezione porterebbe a ${deck.favourable + 13}/52, che conta due volte le carte in entrambe le condizioni.`,
          en: `P = P(face) + P(spade) − P(both): ${deck.favourable}/52 + 13/52 − ${intersection}/52 = ${deck.favourable + 13 - intersection}/52 = ${correct.toString()}. Forgetting to remove the intersection would give ${deck.favourable + 13}/52, counting the cards in both conditions twice.`,
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
      const correct = p.mul(q).mul(new Fraction(binomial, 1));
      void asPercent;
      return {
        archetype: "bernoulli-esattamente-k",
        difficulty: "advanced",
        text: {
          it: `Una moneta equa viene lanciata ${n} volte. Qual è la probabilità di ottenere esattamente ${k} teste?`,
          en: `A fair coin is tossed ${n} times. What is the probability of getting exactly ${k} heads?`,
        },
        correct: correct.toString(),
        distractors: [
          p.mul(new Fraction(1, 2 ** (n - 1))).toString(),
          p.mul(q).toString(),
          new Fraction(binomial, 2 ** (n + 1)).toString(),
        ],
        explanation: {
          it: `Schema di Bernoulli con n = ${n}, k = ${k}, p = 1/2. Il coefficiente binomiale è C(${n},${k}) = ${binomial}, perché conta le sequenze con esattamente ${k} teste. La probabilità di ciascuna sequenza è (1/2)^${n}. Quindi P = C(${n},${k}) · (1/2)^${n} = ${binomial}/${2 ** n} = ${correct.toString()}.`,
          en: `Bernoulli scheme with n = ${n}, k = ${k}, p = 1/2. The binomial coefficient is C(${n},${k}) = ${binomial}, counting the sequences with exactly ${k} heads. Each sequence has probability (1/2)^${n}. So P = C(${n},${k}) · (1/2)^${n} = ${binomial}/${2 ** n} = ${correct.toString()}.`,
        },
      };
    },
  },
];
