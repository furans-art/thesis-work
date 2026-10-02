import { Fraction, combinations } from "../math-utils";
import type { Archetype } from "../types";
import { cand } from "./candidate";

export const urnArchetypes: Archetype[] = [
  {
    id: "urna-senza-reimmissione-stesso-colore",
    difficulty: "intermediate",
    generate(rng) {
      const red = rng.int(3, 7);
      const blue = rng.int(3, 7);
      const total = red + blue;
      const pairs = combinations(total, 2);
      const favourable = combinations(red, 2) + combinations(blue, 2);
      const correct = new Fraction(favourable, pairs);
      return {
        archetype: "urna-senza-reimmissione-stesso-colore",
        difficulty: "intermediate",
        kind: "probability",
        params: { red, blue },
        text: {
          it: `Un'urna contiene ${red} palline rosse e ${blue} palline blu. Si estraggono due palline contemporaneamente. Qual è la probabilità che abbiano lo stesso colore?`,
          en: `An urn contains ${red} red and ${blue} blue balls. Two balls are drawn together. What is the probability they have the same colour?`,
        },
        correct: correct.toString(),
        candidates: [
          cand("with-replacement", "repetition", new Fraction(red * red + blue * blue, total * total),
            `Hai trattato le due estrazioni come indipendenti (con reimmissione): estraendo contemporaneamente la prima pallina non torna nell'urna, quindi le coppie vanno contate senza ripetizioni.`,
            `You treated the two draws as independent (with replacement): drawing together means the first ball never goes back, so pairs must be counted without repetition.`),
          cand("ordered-over-unordered", "order-irrelevant", new Fraction(red * (red - 1) + blue * (blue - 1), pairs),
            `Hai contato i casi favorevoli come coppie ordinate (${red}·${red - 1} + ${blue}·${blue - 1}) ma i casi possibili come coppie non ordinate C(${total},2): numeratore e denominatore devono usare lo stesso modello.`,
            `You counted the favourable cases as ordered pairs (${red}·${red - 1} + ${blue}·${blue - 1}) but the possible cases as unordered pairs C(${total},2): numerator and denominator must use the same model.`),
          cand("red-pairs-only", "additive-union", new Fraction(combinations(red, 2), pairs),
            `Hai contato solo le coppie tutte rosse: «stesso colore» comprende anche le coppie tutte blu, che vanno sommate.`,
            `You counted only the all-red pairs: “same colour” also includes the all-blue pairs, which must be added.`),
          cand("complement", "complement-ignored", correct.complement(),
            `Hai calcolato la probabilità che i colori siano diversi, cioè l'evento complementare.`,
            `You computed the probability that the colours differ, i.e. the complementary event.`),
        ],
        explanation: {
          it: `I casi possibili sono C(${total},2) = ${pairs} coppie. I casi favorevoli sono le coppie tutte rosse più quelle tutte blu: C(${red},2) + C(${blue},2) = ${combinations(red, 2)} + ${combinations(blue, 2)}. Quindi P = ${favourable}/${pairs} = ${correct.toString()}.`,
          en: `The possible cases are C(${total},2) = ${pairs} pairs. The favourable cases are all-red plus all-blue pairs: C(${red},2) + C(${blue},2) = ${combinations(red, 2)} + ${combinations(blue, 2)}. So P = ${favourable}/${pairs} = ${correct.toString()}.`,
        },
      };
    },
  },
  {
    id: "urna-senza-reimmissione-entrambe-rosse",
    difficulty: "intermediate",
    generate(rng) {
      const red = rng.int(3, 8);
      const blue = rng.int(2, 6);
      const total = red + blue;
      const correct = new Fraction(red, total).mul(new Fraction(red - 1, total - 1));
      const firstDrawOnly = new Fraction(red, total);
      return {
        archetype: "urna-senza-reimmissione-entrambe-rosse",
        difficulty: "intermediate",
        kind: "probability",
        params: { red, blue },
        text: {
          it: `Un'urna contiene ${red} palline rosse e ${blue} palline blu. Si estraggono due palline in sequenza senza reimmissione. Qual è la probabilità che entrambe siano rosse?`,
          en: `An urn contains ${red} red and ${blue} blue balls. Two balls are drawn in sequence without replacement. What is the probability both are red?`,
        },
        correct: correct.toString(),
        candidates: [
          cand("second-draw-blue", "other", new Fraction(red, total).mul(new Fraction(blue, total - 1)),
            `Alla seconda estrazione hai usato la probabilità di una blu (${blue}/${total - 1}): dopo una rossa restano ${red - 1} rosse su ${total - 1}.`,
            `For the second draw you used the probability of a blue ball (${blue}/${total - 1}): after one red there are ${red - 1} reds left out of ${total - 1}.`),
          cand("with-replacement", "repetition", firstDrawOnly.mul(firstDrawOnly),
            `Hai trattato le estrazioni come indipendenti (con reimmissione): senza reimmissione, alla seconda estrazione il totale e il numero di rosse diminuiscono.`,
            `You treated the draws as independent (with replacement): without replacement, both the total and the number of red balls decrease on the second draw.`),
          cand("first-draw-only", "constraint-applied-once", firstDrawOnly,
            `È la probabilità della sola prima estrazione: serve anche che la seconda sia rossa, e l'urna nel frattempo è cambiata.`,
            `That is the probability of the first draw alone: the second must also be red, and the urn has changed in the meantime.`),
          cand("complement", "complement-ignored", correct.complement(),
            `Hai calcolato l'evento complementare, cioè che almeno una delle due palline non sia rossa.`,
            `You computed the complementary event, namely that at least one of the two balls is not red.`),
          cand("second-draw-only", "constraint-applied-once", new Fraction(red - 1, total - 1),
            `Hai considerato soltanto la seconda probabilità condizionata, dimenticando di moltiplicarla per la probabilità della prima estrazione rossa.`,
            `You considered only the second conditional probability, forgetting to multiply it by the probability of drawing red first.`),
        ],
        explanation: {
          it: `La prima estrazione ha probabilità ${red}/${total}. La seconda, sapendo che è rimasta una rossa in meno, ha probabilità ${red - 1}/${total - 1}. Il prodotto è ${red}/${total} · ${red - 1}/${total - 1} = ${correct.toString()}. Usare ${red}/${total} anche alla seconda estrazione ignora che l'urna è cambiata.`,
          en: `The first draw has probability ${red}/${total}. The second, knowing one red ball is gone, has probability ${red - 1}/${total - 1}. The product is ${red}/${total} · ${red - 1}/${total - 1} = ${correct.toString()}. Using ${red}/${total} for the second draw too ignores that the urn has changed.`,
        },
      };
    },
  },
  {
    id: "urna-almeno-uno",
    difficulty: "advanced",
    generate(rng) {
      const red = rng.int(3, 8);
      const blue = rng.int(3, 8);
      const total = red + blue;
      const pairs = combinations(total, 2);
      // complementary event of "at least one red" = both balls blue
      const noneRed = new Fraction(combinations(blue, 2), pairs);
      const correct = noneRed.complement();
      const blueShare = new Fraction(blue, total);
      return {
        archetype: "urna-almeno-uno",
        difficulty: "advanced",
        kind: "probability",
        params: { red, blue },
        text: {
          it: `Un'urna contiene ${red} palline rosse e ${blue} palline blu. Si estraggono due palline contemporaneamente. Qual è la probabilità che sia presente almeno una pallina rossa?`,
          en: `An urn contains ${red} red and ${blue} blue balls. Two balls are drawn together. What is the probability that at least one red ball appears?`,
        },
        correct: correct.toString(),
        candidates: [
          cand("exactly-one", "constraint-ignored", new Fraction(red * blue, pairs),
            `Hai calcolato la probabilità di esattamente una rossa (${red}·${blue}/${pairs}): «almeno una» comprende anche il caso di due rosse.`,
            `You computed the probability of exactly one red (${red}·${blue}/${pairs}): “at least one” also includes the case of two reds.`),
          cand("complement-itself", "complement-ignored", noneRed,
            `È la probabilità dell'evento contrario (nessuna rossa, cioè due blu): il risultato richiede 1 − quel valore.`,
            `That is the probability of the opposite event (no red, i.e. two blue): the answer requires 1 − that value.`),
          cand("complement-with-replacement", "repetition", blueShare.mul(blueShare).complement(),
            `Hai calcolato il complementare come se le estrazioni fossero con reimmissione, 1 − (${blue}/${total})²: estraendo insieme, la seconda pallina viene da un'urna con una pallina in meno.`,
            `You computed the complement as if the draws were with replacement, 1 − (${blue}/${total})²: drawing together, the second ball comes from an urn with one ball fewer.`),
          cand("first-is-red", "other", new Fraction(red, total),
            `È la probabilità che la prima pallina sia rossa: «almeno una» su due estrazioni va calcolato con il complementare dell'evento contrario.`,
            `That is the probability that the first ball is red: “at least one” over two draws is computed with the complement of the opposite event.`),
        ],
        explanation: {
          it: `È più semplice usare l'evento complementare "nessuna rossa", cioè due blu: C(${blue},2)/C(${total},2) = ${combinations(blue, 2)}/${pairs} = ${noneRed.toString()}. Quindi P(almeno una rossa) = 1 − ${noneRed.toString()} = ${correct.toString()}.`,
          en: `It is easier to use the complementary event "no red", i.e. two blue: C(${blue},2)/C(${total},2) = ${combinations(blue, 2)}/${pairs} = ${noneRed.toString()}. So P(at least one red) = 1 − ${noneRed.toString()} = ${correct.toString()}.`,
        },
      };
    },
  },
];
