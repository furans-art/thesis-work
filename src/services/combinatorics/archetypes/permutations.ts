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
        diagnoses: [
          {
            it: `Hai fissato una lettera in una posizione fissa: nessuna lettera è vincolata, quindi tutte le ${n} vanno permutate.`,
            en: `You fixed one letter in a fixed position: no letter is bound, so all ${n} of them must be permuted.`,
          },
          {
            it: `Hai arrestato il prodotto a due fattori: ogni lettera occupa una posizione, quindi il prodotto arriva a ${n} fattori.`,
            en: `You stopped the product after two factors: every letter takes a position, so the product runs to ${n} factors.`,
          },
          {
            it: `Hai dato solo due alternative per lettera: in realtà ogni posizione può ospitare qualunque lettera non ancora usata.`,
            en: `You allowed only two alternatives per letter: in fact every position can host any letter not yet used.`,
          },
        ],
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
      const candidates = [
        {
          value: factorial(n),
          why: {
            it: `Hai contato più volte lo stesso anagramma: scambiare fra loro le lettere uguali (qui ${detail}) non produce parole diverse.`,
            en: `You counted the same anagram several times: swapping identical letters (here ${detail}) produces no new word.`,
          },
        },
        {
          value: factorial(n) / factorial(repeats[0] ?? 1),
          why: {
            it: `Hai corretto solo per la prima lettera ripetuta: tutte le lettere con ripetizioni richiedono la divisione per il loro fattoriale (${denominator}).`,
            en: `You corrected only for the first repeated letter: every repeated letter requires dividing by its factorial (${denominator}).`,
          },
        },
        {
          value: factorial(n) / repeats.reduce((a, b) => a + b, 0),
          why: {
            it: `Hai diviso per la somma delle ripetizioni: nel denominatore vanno i prodotti dei fattoriali delle ripetizioni, cioè ${denominator}.`,
            en: `You divided by the sum of the repetitions: the denominator is the product of their factorials, that is ${denominator}.`,
          },
        },
        {
          value: factorial(n - 1),
          why: {
            it: `Hai eliminato una posizione invece di correggere le ripetizioni: tutte le ${n} lettere partecipano agli anagrammi.`,
            en: `You removed one position instead of correcting for repetitions: all ${n} letters take part in the anagrams.`,
          },
        },
        {
          value: 2 ** n,
          why: {
            it: `Hai assegnato due alternative indipendenti a ciascuna posizione: un anagramma usa invece tutte le ${n} lettere disponibili, rispettandone le molteplicità.`,
            en: `You assigned two independent alternatives to each position: an anagram instead uses all ${n} available letters with their given multiplicities.`,
          },
        },
      ];
      const seen = new Set<number>([correct]);
      const picked = candidates.filter(({ value }) => {
        if (!Number.isInteger(value) || value <= 0 || seen.has(value)) return false;
        seen.add(value);
        return true;
      }).slice(0, 3);
      return {
        archetype: "permutazioni-ripetizione-anagrammi",
        difficulty: "intermediate",
        text: {
          it: `Quanti anagrammi distinti, anche privi di significato, si possono formare con le lettere della parola ${word}?`,
          en: `How many distinct anagrams, meaningful or not, can be formed with the letters of the word ${word}?`,
        },
        correct: `${correct}`,
        distractors: picked.map(({ value }) => `${value}`),
        diagnoses: picked.map(({ why }) => why),
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
        diagnoses: [
          {
            it: `Hai dimenticato lo scambio interno al blocco: Anna e Bruno possono permutarsi fra loro in 2 modi.`,
            en: `You forgot the swap inside the block: Anna and Bruno can permute with each other in 2 ways.`,
          },
          {
            it: `Hai ignorato il vincolo: i due amici vanno trattati come un unico blocco, che riduce gli elementi da permutare a ${n - 1}.`,
            en: `You ignored the constraint: the two friends must be treated as a single block, which reduces the items to permute to ${n - 1}.`,
          },
          {
            it: `Hai sottratto invece di ragionare sul blocco: il vincolo riduce gli elementi da permutare, non è un'esclusione di casi.`,
            en: `You subtracted instead of reasoning with the block: the constraint reduces the items to permute, it is not an exclusion of cases.`,
          },
        ],
        explanation: {
          it: `Si considerano Anna e Bruno come un unico blocco: restano ${n - 1} elementi da permutare, cioè ${n - 1}! = ${factorial(n - 1)} modi. Dentro il blocco i due possono scambiarsi fra loro in 2 modi, quindi 2 · ${n - 1}! = ${correct}. Dimenticare lo scambio interno porta a ${factorial(n - 1)}; ignorare il vincolo porta a ${n}! = ${factorial(n)}.`,
          en: `Treat Anna and Bruno as a single block: ${n - 1} items remain to permute, that is ${n - 1}! = ${factorial(n - 1)} ways. Inside the block the two can swap in 2 ways, so 2 · ${n - 1}! = ${correct}. Forgetting the internal swap gives ${factorial(n - 1)}; ignoring the constraint gives ${n}! = ${factorial(n)}.`,
        },
      };
    },
  },
];
