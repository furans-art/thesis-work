import { factorial, permutationsWithRepetition } from "../math-utils";
import type { Archetype } from "../types";

const distinctWords = ["LIBRO", "CAMPO", "TAVOLO", "MUSICA", "SCUOLA", "PIANTE"] as const;

/** Words whose letters repeat, with the multiplicities used by n!/(r1!·r2!…). */
const repeatedWords: { word: string; repeats: number[]; detail: string }[] = [
  { word: "CASA", repeats: [2], detail: "A×2" },
  { word: "PALLA", repeats: [2, 2], detail: "A×2, L×2" },
  { word: "MAMMA", repeats: [3, 2], detail: "M×3, A×2" },
  { word: "NONNO", repeats: [3, 2], detail: "N×3, O×2" },
  { word: "SASSO", repeats: [3], detail: "S×3" },
  { word: "LETTERA", repeats: [2, 2], detail: "E×2, T×2" },
  { word: "RAGAZZA", repeats: [3, 2], detail: "A×3, Z×2" },
];

export const permutationArchetypes: Archetype[] = [
  {
    id: "permutazioni-semplici-anagrammi",
    difficulty: "base",
    generate(rng) {
      const word = rng.pick(distinctWords);
      const n = word.length;
      const correct = factorial(n);
      return {
        archetype: "permutazioni-semplici-anagrammi",
        difficulty: "base",
        text: {
          it: `Quanti anagrammi, anche privi di significato, si possono formare con le lettere della parola ${word}?`,
          en: `How many anagrams, meaningful or not, can be formed with the letters of the word ${word}?`,
        },
        correct: `${correct}`,
        distractors: [`${factorial(n - 1)}`, `${n * (n - 1)}`, `${2 ** n}`],
        explanation: {
          it: `La parola ${word} ha ${n} lettere tutte diverse: gli anagrammi sono le permutazioni di ${n} elementi, cioè ${n}! = ${correct}.`,
          en: `The word ${word} has ${n} letters, all different: the anagrams are the permutations of ${n} elements, that is ${n}! = ${correct}.`,
        },
      };
    },
  },
  {
    id: "permutazioni-ripetizione-anagrammi",
    difficulty: "intermediate",
    generate(rng) {
      const { word, repeats, detail } = rng.pick(repeatedWords);
      const n = word.length;
      const correct = permutationsWithRepetition(n, repeats);
      const denominator = repeats.map((r) => `${r}!`).join(" · ");
      return {
        archetype: "permutazioni-ripetizione-anagrammi",
        difficulty: "intermediate",
        text: {
          it: `Quanti anagrammi distinti, anche privi di significato, si possono formare con le lettere della parola ${word}?`,
          en: `How many distinct anagrams, meaningful or not, can be formed with the letters of the word ${word}?`,
        },
        correct: `${correct}`,
        distractors: [
          `${factorial(n)}`,
          `${factorial(n) / factorial(repeats[0]!)}`,
          `${factorial(n) / repeats.reduce((a, b) => a + b, 0)}`,
        ],
        explanation: {
          it: `${word} ha ${n} lettere con ripetizioni (${detail}). Gli anagrammi distinti sono ${n}! / (${denominator}) = ${correct}. Usare solo ${n}! = ${factorial(n)} conterebbe più volte lo stesso anagramma, perché scambiare fra loro lettere uguali non produce parole diverse.`,
          en: `${word} has ${n} letters with repetitions (${detail}). The distinct anagrams are ${n}! / (${denominator}) = ${correct}. Using ${n}! = ${factorial(n)} alone would count the same anagram several times, since swapping identical letters produces no new word.`,
        },
      };
    },
  },
  {
    id: "permutazioni-vincolo-vicinanza",
    difficulty: "advanced",
    generate(rng) {
      const n = rng.int(5, 7);
      const correct = 2 * factorial(n - 1);
      return {
        archetype: "permutazioni-vincolo-vicinanza",
        difficulty: "advanced",
        text: {
          it: `${n} amici si mettono in fila per una foto. In quanti modi possono disporsi se due di loro, Anna e Bruno, vogliono stare sempre uno accanto all'altro?`,
          en: `${n} friends line up for a photo. In how many ways can they stand if two of them, Anna and Bruno, always want to be next to each other?`,
        },
        correct: `${correct}`,
        distractors: [
          `${factorial(n - 1)}`,
          `${factorial(n)}`,
          `${factorial(n) - factorial(n - 1)}`,
        ],
        explanation: {
          it: `Si considerano Anna e Bruno come un unico blocco: restano ${n - 1} elementi da permutare, cioè ${n - 1}! = ${factorial(n - 1)} modi. Dentro il blocco i due possono scambiarsi fra loro in 2 modi, quindi 2 · ${n - 1}! = ${correct}. Dimenticare lo scambio interno porta a ${factorial(n - 1)}; ignorare il vincolo porta a ${n}! = ${factorial(n)}.`,
          en: `Treat Anna and Bruno as a single block: ${n - 1} items remain to permute, that is ${n - 1}! = ${factorial(n - 1)} ways. Inside the block the two can swap in 2 ways, so 2 · ${n - 1}! = ${correct}. Forgetting the internal swap gives ${factorial(n - 1)}; ignoring the constraint gives ${n}! = ${factorial(n)}.`,
        },
      };
    },
  },
];
