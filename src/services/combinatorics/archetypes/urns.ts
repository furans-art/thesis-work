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
      const independent = new Fraction(red, total).mul(new Fraction(blue, total - 1));
      return {
        archetype: "urna-senza-reimmissione-entrambe-rosse",
        difficulty: "intermediate",
        text: {
          it: `Un'urna contiene ${red} palline rosse e ${blue} palline blu. Si estraggono due palline in sequenza senza reimmissione. Qual è la probabilità che entrambe siano rosse?`,
          en: `An urn contains ${red} red and ${blue} blue balls. Two balls are drawn in sequence without replacement. What is the probability both are red?`,
        },
        correct: correct.toString(),
        distractors: [
          independent.toString(),
          correct.add(independent).toString(),
          new Fraction(red, total).toString(),
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
      const noneBlue = new Fraction(combinations(red, 2), combinations(total, 2));
      const correct = noneBlue.complement();
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
          noneBlue.toString(),
          correct.add(new Fraction(1, combinations(total, 2))).toString(),
        ],
        explanation: {
          it: `È più semplice usare l'evento complementare "nessuna rossa", cioè due blu: C(${blue},2)/C(${total},2) = ${combinations(blue, 2)}/${combinations(total, 2)} = ${noneBlue.toString()}. Quindi P(almeno una rossa) = 1 − ${noneBlue.toString()} = ${correct.toString()}.`,
          en: `It is easier to use the complementary event "no red", i.e. two blue: C(${blue},2)/C(${total},2) = ${combinations(blue, 2)}/${combinations(total, 2)} = ${noneBlue.toString()}. So P(at least one red) = 1 − ${noneBlue.toString()} = ${correct.toString()}.`,
        },
      };
    },
  },
];
