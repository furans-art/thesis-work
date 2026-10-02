import { Fraction, combinations } from "../math-utils";
import type { Archetype } from "../types";

export const urnArchetypes: Archetype[] = [
  {
    id: "urna-senza-reimmissione-stesso-colore",
    difficulty: "intermediate",
    generate(rng) {
      const red = rng.int(3, 7);
      const blue = rng.int(3, 7);
      const total = red + blue;
      const correct = new Fraction(
        combinations(red, 2) + combinations(blue, 2),
        combinations(total, 2),
      );
      const withReplacement = new Fraction(red * red + blue * blue, total * total);
      return {
        archetype: "urna-senza-reimmissione-stesso-colore",
        difficulty: "intermediate",
        text: {
          it: `Un'urna contiene ${red} palline rosse e ${blue} palline blu. Si estraggono due palline contemporaneamente. Qual è la probabilità che abbiano lo stesso colore?`,
          en: `An urn contains ${red} red and ${blue} blue balls. Two balls are drawn together. What is the probability they have the same colour?`,
        },
        correct: correct.toString(),
        distractors: [withReplacement.toString(), correct.add(withReplacement).toString(), `1`],
        diagnoses: [
          {
            it: `Hai trattato le due estrazioni come indipendenti (con reimmissione): estraendo contemporaneamente la prima pallina non torna nell'urna, quindi le coppie vanno contate senza ripetizioni.`,
            en: `You treated the two draws as independent (with replacement): drawing together means the first ball never goes back, so pairs must be counted without repetition.`,
          },
          {
            it: `Hai sommato due probabilità calcolate con modelli diversi: la stessa coppia andrebbe contata due volte, il che non ha senso. Va bene il conteggio diretto delle coppie favorevoli.`,
            en: `You added two probabilities computed with different models: the same pair would be counted twice, which makes no sense. Count the favourable pairs directly.`,
          },
          {
            it: `Non è un evento certo: le due palline possono anche avere colori diversi, quindi la probabilità è minore di 1.`,
            en: `This is not a certain event: the two balls may well have different colours, so the probability is less than 1.`,
          },
        ],
        explanation: {
          it: `I casi possibili sono C(${total},2) = ${combinations(total, 2)} coppie. I casi favorevoli sono le coppie tutte rosse più quelle tutte blu: C(${red},2) + C(${blue},2) = ${combinations(red, 2)} + ${combinations(blue, 2)}. Quindi P = ${combinations(red, 2) + combinations(blue, 2)}/${combinations(total, 2)} = ${correct.toString()}.`,
          en: `The possible cases are C(${total},2) = ${combinations(total, 2)} pairs. The favourable cases are all-red plus all-blue pairs: C(${red},2) + C(${blue},2) = ${combinations(red, 2)} + ${combinations(blue, 2)}. So P = ${combinations(red, 2) + combinations(blue, 2)}/${combinations(total, 2)} = ${correct.toString()}.`,
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
      const redThenBlue = new Fraction(red, total).mul(new Fraction(blue, total - 1));
      const firstDrawOnly = new Fraction(red, total);
      const candidates = [
        {
          value: redThenBlue,
          why: {
            it: `Alla seconda estrazione hai usato la probabilità di una blu: dopo una rossa restano ${red - 1} rosse su ${total - 1}.`,
            en: `For the second draw you used the probability of a blue ball: after one red there are ${red - 1} reds left out of ${total - 1}.`,
          },
        },
        {
          value: correct.add(redThenBlue),
          why: {
            it: `Hai sommato invece di moltiplicare: «entrambe rosse» è un evento simultaneo, non un'alternativa fra i due colori.`,
            en: `You added instead of multiplying: “both red” is a simultaneous event, not an alternative between the two colours.`,
          },
        },
        {
          value: firstDrawOnly,
          why: {
            it: `È la probabilità della sola prima estrazione: serve anche che la seconda sia rossa, e l'urna nel frattempo è cambiata.`,
            en: `That is the probability of the first draw alone: the second must also be red, and the urn has changed in the meantime.`,
          },
        },
        {
          value: firstDrawOnly.mul(firstDrawOnly),
          why: {
            it: `Hai trattato le estrazioni come indipendenti: senza reimmissione, alla seconda estrazione il totale e il numero di rosse diminuiscono.`,
            en: `You treated the draws as independent: without replacement, both the total and the number of red balls decrease on the second draw.`,
          },
        },
        {
          value: correct.complement(),
          why: {
            it: `Hai calcolato l'evento complementare, cioè che almeno una delle due palline non sia rossa.`,
            en: `You computed the complementary event, namely that at least one of the two balls is not red.`,
          },
        },
        {
          value: new Fraction(red - 1, total - 1),
          why: {
            it: `Hai considerato soltanto la seconda probabilità condizionata, dimenticando di moltiplicarla per la probabilità della prima estrazione rossa.`,
            en: `You considered only the second conditional probability, forgetting to multiply it by the probability of drawing red first.`,
          },
        },
      ];
      const seen = new Set<string>([correct.toString()]);
      const picked = candidates.filter(({ value }) => {
        const rendered = value.toString();
        if (seen.has(rendered)) return false;
        seen.add(rendered);
        return true;
      }).slice(0, 3);
      return {
        archetype: "urna-senza-reimmissione-entrambe-rosse",
        difficulty: "intermediate",
        text: {
          it: `Un'urna contiene ${red} palline rosse e ${blue} palline blu. Si estraggono due palline in sequenza senza reimmissione. Qual è la probabilità che entrambe siano rosse?`,
          en: `An urn contains ${red} red and ${blue} blue balls. Two balls are drawn in sequence without replacement. What is the probability both are red?`,
        },
        correct: correct.toString(),
        distractors: picked.map(({ value }) => value.toString()),
        diagnoses: picked.map(({ why }) => why),
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
      const noneRed = new Fraction(combinations(blue, 2), combinations(total, 2));
      const correct = noneRed.complement();
      return {
        archetype: "urna-almeno-uno",
        difficulty: "advanced",
        text: {
          it: `Un'urna contiene ${red} palline rosse e ${blue} palline blu. Si estraggono due palline contemporaneamente. Qual è la probabilità che sia presente almeno una pallina rossa?`,
          en: `An urn contains ${red} red and ${blue} blue balls. Two balls are drawn together. What is the probability that at least one red ball appears?`,
        },
        correct: correct.toString(),
        distractors: [
          new Fraction(red, total).toString(),
          noneRed.toString(),
          correct.add(new Fraction(1, combinations(total, 2))).toString(),
        ],
        diagnoses: [
          {
            it: `È la probabilità che la prima pallina sia rossa: «almeno una» su due estrazioni va calcolato con il complementare dell'evento contrario.`,
            en: `That is the probability that the first ball is red: “at least one” over two draws is computed with the complement of the opposite event.`,
          },
          {
            it: `È la probabilità dell'evento contrario (nessuna rossa, cioè due blu): il risultato richiede 1 − quel valore.`,
            en: `That is the probability of the opposite event (no red, i.e. two blue): the answer requires 1 − that value.`,
          },
          {
            it: `Hai aggiunto un pezzo invece di sottrarre: la formula del complementare è 1 − P(nessuna rossa), senza ulteriori correzioni.`,
            en: `You added a piece instead of subtracting: the complement formula is 1 − P(no red), with no further correction.`,
          },
        ],
        explanation: {
          it: `È più semplice usare l'evento complementare "nessuna rossa", cioè due blu: C(${blue},2)/C(${total},2) = ${combinations(blue, 2)}/${combinations(total, 2)} = ${noneRed.toString()}. Quindi P(almeno una rossa) = 1 − ${noneRed.toString()} = ${correct.toString()}.`,
          en: `It is easier to use the complementary event "no red", i.e. two blue: C(${blue},2)/C(${total},2) = ${combinations(blue, 2)}/${combinations(total, 2)} = ${noneRed.toString()}. So P(at least one red) = 1 − ${noneRed.toString()} = ${correct.toString()}.`,
        },
      };
    },
  },
];
