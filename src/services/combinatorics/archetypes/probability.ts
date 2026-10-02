import { Fraction, factorial } from "../math-utils";
import type { Archetype, DistractorCandidate } from "../types";
import { cand } from "./candidate";

const diceSums = [4, 5, 6, 7, 8, 9, 10] as const;

/** All ordered pairs (a, b) of two six-sided dice with a + b = sum. */
function dicePairs(sum: number): [number, number][] {
  const out: [number, number][] = [];
  for (let a = 1; a <= 6; a += 1) for (let b = 1; b <= 6; b += 1) if (a + b === sum) out.push([a, b]);
  return out;
}

export const probabilityArchetypes: Archetype[] = [
  {
    id: "probabilita-dadi-somma",
    difficulty: "base",
    generate(rng) {
      const sum = rng.pick(diceSums);
      const pairs = dicePairs(sum);
      const count = pairs.length;
      const unordered = pairs.filter(([a, b]) => a <= b).length;
      const strictlyIncreasing = pairs.filter(([a, b]) => a < b).length;
      const correct = new Fraction(count, 36);
      const listed = pairs.map(([a, b]) => `(${a}, ${b})`).join(", ");
      const candidates: DistractorCandidate[] = [];
      if (sum % 2 === 0 && sum >= 2 && sum <= 12) {
        candidates.push(
          cand("double-counted-twice", "order-irrelevant", new Fraction(count + 1, 36),
            `Hai contato due volte la coppia doppia (${sum / 2}, ${sum / 2}): scambiando i due dadi si ottiene la stessa coppia, quindi compare una volta sola fra le 36.`,
            `You counted the double (${sum / 2}, ${sum / 2}) twice: swapping the two dice gives the same pair, so it appears only once among the 36.`),
        );
      }
      candidates.push(
        cand("sums-equiprobable", "other", new Fraction(1, 11),
          `Hai trattato le 11 somme possibili (da 2 a 12) come equiprobabili: le somme centrali si ottengono con più coppie, quindi vanno contate le 36 coppie ordinate.`,
          `You treated the 11 possible sums (2 to 12) as equally likely: central sums arise from more pairs, so you must count the 36 ordered pairs.`),
        cand("unordered-pairs", "order-irrelevant", new Fraction(unordered, 21),
          `Hai usato le coppie non ordinate sia al numeratore (${unordered}) sia al denominatore (21): le 21 coppie non ordinate non sono equiprobabili, perché (1, 2) può uscire in due modi e (1, 1) in uno solo.`,
          `You used unordered pairs for both numerator (${unordered}) and denominator (21): the 21 unordered pairs are not equally likely, since (1, 2) can occur in two ways and (1, 1) in only one.`),
        cand("increasing-pairs-only", "order-irrelevant", new Fraction(strictlyIncreasing, 36),
          `Hai contato solo le coppie con il primo dado minore del secondo (${strictlyIncreasing}) su 36: le coppie ordinate vanno contate tutte, comprese quelle simmetriche e la coppia doppia.`,
          `You counted only the pairs with the first die smaller than the second (${strictlyIncreasing}) out of 36: all ordered pairs must be counted, including the mirrored ones and the double.`),
      );
      return {
        archetype: "probabilita-dadi-somma",
        difficulty: "base",
        kind: "probability",
        params: { sum },
        text: {
          it: `Si lanciano due dadi equi a sei facce. Qual è la probabilità che la somma dei punteggi sia ${sum}?`,
          en: `Two fair six-sided dice are rolled. What is the probability that the sum of the scores is ${sum}?`,
        },
        correct: correct.toString(),
        candidates,
        explanation: {
          it: `I casi possibili sono 6 · 6 = 36 coppie ordinate. Le coppie con somma ${sum} sono ${listed}: ${count} casi favorevoli. Quindi P = ${count}/36 = ${correct.toString()}.`,
          en: `The possible cases are 6 · 6 = 36 ordered pairs. The pairs with sum ${sum} are ${listed}: ${count} favourable cases. So P = ${count}/36 = ${correct.toString()}.`,
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
          key: "face",
          favourable: 12,
          condition: "una figura (fante, donna o re)",
          conditionEn: "a face card (jack, queen or king)",
          plural: "figure",
          pluralEn: "face cards",
          intersection: 3,
          intersectionNote: "le figure di picche sono 3",
          intersectionNoteEn: "the face cards in spades are 3",
        },
        {
          key: "ace",
          favourable: 4,
          condition: "un asso",
          conditionEn: "an ace",
          plural: "assi",
          pluralEn: "aces",
          intersection: 1,
          intersectionNote: "l'asso di picche è 1",
          intersectionNoteEn: "the ace of spades is 1",
        },
      ]);
      const union = deck.favourable + 13 - deck.intersection;
      const correct = new Fraction(union, 52);
      return {
        archetype: "probabilita-unione-eventi",
        difficulty: "intermediate",
        kind: "probability",
        params: { event: deck.key },
        text: {
          it: `Da un mazzo di 52 carte si estrae una carta. Qual è la probabilità che sia ${deck.condition} oppure di picche?`,
          en: `One card is drawn from a deck of 52. What is the probability that it is ${deck.conditionEn} or a spade?`,
        },
        correct: correct.toString(),
        candidates: [
          cand("intersection-not-removed", "additive-union", new Fraction(deck.favourable + 13, 52),
            `Hai sommato le due probabilità senza togliere l'intersezione: le carte che sono ${deck.condition} e di picche (${deck.intersection} in tutto) verrebbero contate due volte.`,
            `You added the two probabilities without removing the intersection: the cards that are both ${deck.conditionEn} and spades (${deck.intersection} of them) would be counted twice.`),
          cand("spades-only", "constraint-ignored", new Fraction(13, 52),
            `Hai considerato solo l'evento «picche», dimenticando la prima condizione del quesito.`,
            `You considered only the “spades” event, forgetting the first condition of the question.`),
          cand("first-event-minus-intersection", "inclusion-exclusion-truncated", new Fraction(deck.favourable - deck.intersection, 52),
            `Hai contato solo ${deck.plural === "assi" ? "gli" : "le"} ${deck.plural} che non sono di picche (${deck.favourable - deck.intersection}): mancano tutte le carte di picche.`,
            `You counted only the ${deck.pluralEn} that are not spades (${deck.favourable - deck.intersection}): all the spades are missing.`),
          cand("first-event-only", "constraint-ignored", new Fraction(deck.favourable, 52),
            `Hai considerato solo l'evento «${deck.condition}», dimenticando le carte di picche.`,
            `You considered only the “${deck.conditionEn}” event, forgetting the spades.`),
          cand("intersection-removed-twice", "inclusion-exclusion-truncated", new Fraction(deck.favourable + 13 - 2 * deck.intersection, 52),
            `Hai tolto l'intersezione due volte: nella formula P(A) + P(B) − P(A ∩ B) va sottratta una sola volta.`,
            `You removed the intersection twice: in P(A) + P(B) − P(A ∩ B) it is subtracted only once.`),
        ],
        explanation: {
          it: `P(A ∪ B) = P(A) + P(B) − P(A ∩ B): ${deck.favourable}/52 + 13/52 − ${deck.intersection}/52, perché ${deck.intersectionNote}. Risultato ${union}/52 = ${correct.toString()}. Dimenticare di togliere l'intersezione porterebbe a ${deck.favourable + 13}/52, contando due volte le carte che sono ${deck.condition} e di picche insieme.`,
          en: `P(A ∪ B) = P(A) + P(B) − P(A ∩ B): ${deck.favourable}/52 + 13/52 − ${deck.intersection}/52, because ${deck.intersectionNoteEn}. Result ${union}/52 = ${correct.toString()}. Forgetting to remove the intersection would give ${deck.favourable + 13}/52, counting the cards that are both ${deck.conditionEn} and spades twice.`,
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
      const binomial = factorial(n) / (factorial(k) * factorial(n - k));
      const correct = new Fraction(binomial, 2 ** n);
      return {
        archetype: "bernoulli-esattamente-k",
        difficulty: "advanced",
        kind: "probability",
        params: { n, k },
        text: {
          it: `Una moneta equa viene lanciata ${n} volte. Qual è la probabilità di ottenere esattamente ${k} teste?`,
          en: `A fair coin is tossed ${n} times. What is the probability of getting exactly ${k} heads?`,
        },
        correct: correct.toString(),
        candidates: [
          cand("single-sequence", "order-irrelevant", new Fraction(1, 2 ** n),
            `Hai contato una sola sequenza: esistono C(${n},${k}) = ${binomial} sequenze con esattamente ${k} teste, e vanno tutte contate.`,
            `You counted a single sequence: there are C(${n},${k}) = ${binomial} sequences with exactly ${k} heads, and all of them must be counted.`),
          cand("two-tosses", "other", new Fraction(1, 4),
            `Hai calcolato la probabilità di un successo e un insuccesso in due lanci: qui i lanci sono ${n} e i successi esattamente ${k}.`,
            `You computed the probability of one success and one failure in two tosses: here there are ${n} tosses and exactly ${k} successes.`),
          cand("wrong-denominator", "other", new Fraction(binomial, 2 ** (n + 1)),
            `Hai diviso per 2^${n + 1}: i lanci sono ${n}, quindi le sequenze possibili sono 2^${n}.`,
            `You divided by 2^${n + 1}: there are ${n} tosses, so the possible sequences are 2^${n}.`),
          cand("proportion", "other", new Fraction(k, n),
            `Hai usato la proporzione ${k}/${n} fra teste e lanci: è la frequenza attesa, non la probabilità di ottenere esattamente ${k} teste.`,
            `You used the ratio ${k}/${n} of heads to tosses: that is the expected frequency, not the probability of exactly ${k} heads.`),
          cand("counts-over-outcomes", "other", new Fraction(1, n + 1),
            `Hai trattato i ${n + 1} possibili numeri di teste (da 0 a ${n}) come equiprobabili: i valori centrali si ottengono con più sequenze.`,
            `You treated the ${n + 1} possible numbers of heads (0 to ${n}) as equally likely: central values arise from more sequences.`),
        ],
        explanation: {
          it: `Schema di Bernoulli con n = ${n}, k = ${k}, p = 1/2. Il coefficiente binomiale è C(${n},${k}) = ${binomial}, perché conta le sequenze con esattamente ${k} teste. La probabilità di ciascuna sequenza è (1/2)^${n}. Quindi P = C(${n},${k}) · (1/2)^${n} = ${binomial}/${2 ** n} = ${correct.toString()}.`,
          en: `Bernoulli scheme with n = ${n}, k = ${k}, p = 1/2. The binomial coefficient is C(${n},${k}) = ${binomial}, counting the sequences with exactly ${k} heads. Each sequence has probability (1/2)^${n}. So P = C(${n},${k}) · (1/2)^${n} = ${binomial}/${2 ** n} = ${correct.toString()}.`,
        },
      };
    },
  },
];
