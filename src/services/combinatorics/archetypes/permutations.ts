import { combinations, factorial, permutationsWithRepetition } from "../math-utils";
import type { Archetype, DistractorCandidate } from "../types";
import { cand } from "./candidate";

const distinctWords = ["LIBRO", "CAMPO", "MOSTRA", "MUSICA", "SCUOLA", "PIANTE"] as const;

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
        kind: "count",
        params: { word },
        text: {
          it: `Quanti anagrammi, anche privi di significato, si possono formare con le lettere della parola ${word}?`,
          en: `How many anagrams, meaningful or not, can be formed with the letters of the word ${word}?`,
        },
        correct: `${correct}`,
        candidates: [
          cand("one-letter-fixed", "other", factorial(n - 1),
            `Hai fissato una lettera in una posizione fissa: nessuna lettera è vincolata, quindi tutte le ${n} vanno permutate.`,
            `You fixed one letter in a fixed position: no letter is bound, so all ${n} of them must be permuted.`),
          cand("two-factors-only", "other", n * (n - 1),
            `Hai arrestato il prodotto a due fattori: ogni lettera occupa una posizione, quindi il prodotto arriva a ${n} fattori.`,
            `You stopped the product after two factors: every letter takes a position, so the product runs to ${n} factors.`),
          cand("two-choices-per-letter", "other", 2 ** n,
            `Hai dato solo due alternative per lettera: in realtà ogni posizione può ospitare qualunque lettera non ancora usata.`,
            `You allowed only two alternatives per letter: in fact every position can host any letter not yet used.`),
          cand("letters-reused", "repetition", n ** n,
            `Hai permesso di riusare le lettere (${n}^${n}): in un anagramma ogni lettera compare esattamente una volta.`,
            `You allowed letters to be reused (${n}^${n}): in an anagram each letter appears exactly once.`),
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
      const first = repeats[0] ?? 1;
      const candidates: DistractorCandidate[] = [
        cand("identical-letters-distinguished", "labelled-groups", factorial(n),
          `Hai contato più volte lo stesso anagramma: scambiare fra loro le lettere uguali (qui ${detail}) non produce parole diverse.`,
          `You counted the same anagram several times: swapping identical letters (here ${detail}) produces no new word.`),
        cand("divided-by-multiplicity", "other", factorial(n) / repeats.reduce((a, b) => a * b, 1),
          `Hai diviso per la molteplicità (${repeats.join(" · ")}) invece che per il suo fattoriale: le lettere uguali si scambiano fra loro in ${denominator} modi.`,
          `You divided by the multiplicity (${repeats.join(" · ")}) instead of its factorial: identical letters swap among themselves in ${denominator} ways.`),
        cand("positions-only", "other", combinations(n, first),
          `Hai scelto soltanto le posizioni della lettera ripetuta, C(${n},${first}), senza disporre le lettere rimanenti nei posti liberi.`,
          `You only chose the positions of the repeated letter, C(${n},${first}), without arranging the remaining letters in the free places.`),
      ];
      if (repeats.length >= 2) {
        candidates.push(
          cand("first-repeat-only", "constraint-applied-once", factorial(n) / factorial(first),
            `Hai corretto solo per la prima lettera ripetuta: tutte le lettere con ripetizioni richiedono la divisione per il loro fattoriale (${denominator}).`,
            `You corrected only for the first repeated letter: every repeated letter requires dividing by its factorial (${denominator}).`),
        );
      }
      candidates.push(
        cand("divided-by-sum", "other", factorial(n) / repeats.reduce((a, b) => a + b, 0),
          `Hai diviso per la somma delle ripetizioni: nel denominatore vanno i prodotti dei fattoriali delle ripetizioni, cioè ${denominator}.`,
          `You divided by the sum of the repetitions: the denominator is the product of their factorials, that is ${denominator}.`),
        cand("one-position-removed", "other", factorial(n - 1),
          `Hai eliminato una posizione invece di correggere le ripetizioni: tutte le ${n} lettere partecipano agli anagrammi.`,
          `You removed one position instead of correcting for repetitions: all ${n} letters take part in the anagrams.`),
        cand("two-choices-per-letter", "other", 2 ** n,
          `Hai assegnato due alternative indipendenti a ciascuna posizione: un anagramma usa invece tutte le ${n} lettere disponibili, rispettandone le molteplicità.`,
          `You assigned two independent alternatives to each position: an anagram instead uses all ${n} available letters with their given multiplicities.`),
      );
      return {
        archetype: "permutazioni-ripetizione-anagrammi",
        difficulty: "intermediate",
        kind: "count",
        params: { word },
        text: {
          it: `Quanti anagrammi distinti, anche privi di significato, si possono formare con le lettere della parola ${word}?`,
          en: `How many distinct anagrams, meaningful or not, can be formed with the letters of the word ${word}?`,
        },
        correct: `${correct}`,
        candidates,
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
        kind: "count",
        params: { n },
        text: {
          it: `${n} amici si mettono in fila per una foto. In quanti modi possono disporsi se due di loro, Anna e Bruno, vogliono stare sempre uno accanto all'altro?`,
          en: `${n} friends line up for a photo. In how many ways can they stand if two of them, Anna and Bruno, always want to be next to each other?`,
        },
        correct: `${correct}`,
        candidates: [
          cand("block-swap-forgotten", "constraint-applied-once", factorial(n - 1),
            `Hai dimenticato lo scambio interno al blocco: Anna e Bruno possono permutarsi fra loro in 2 modi.`,
            `You forgot the swap inside the block: Anna and Bruno can permute with each other in 2 ways.`),
          cand("constraint-ignored", "constraint-ignored", factorial(n),
            `Hai ignorato il vincolo: i due amici vanno trattati come un unico blocco, che riduce gli elementi da permutare a ${n - 1}.`,
            `You ignored the constraint: the two friends must be treated as a single block, which reduces the items to permute to ${n - 1}.`),
          cand("subtracted-block", "other", factorial(n) - factorial(n - 1),
            `Hai sottratto invece di ragionare sul blocco: il vincolo riduce gli elementi da permutare, non è un'esclusione di casi.`,
            `You subtracted instead of reasoning with the block: the constraint reduces the items to permute, it is not an exclusion of cases.`),
          cand("complement-counted", "complement-ignored", factorial(n) - correct,
            `Hai contato le file in cui Anna e Bruno NON sono vicini: è l'evento complementare di quello richiesto.`,
            `You counted the lines where Anna and Bruno are NOT adjacent: that is the complement of the requested event.`),
        ],
        explanation: {
          it: `Si considerano Anna e Bruno come un unico blocco: restano ${n - 1} elementi da permutare, cioè ${n - 1}! = ${factorial(n - 1)} modi. Dentro il blocco i due possono scambiarsi fra loro in 2 modi, quindi 2 · ${n - 1}! = ${correct}. Dimenticare lo scambio interno porta a ${factorial(n - 1)}; ignorare il vincolo porta a ${n}! = ${factorial(n)}.`,
          en: `Treat Anna and Bruno as a single block: ${n - 1} items remain to permute, that is ${n - 1}! = ${factorial(n - 1)} ways. Inside the block the two can swap in 2 ways, so 2 · ${n - 1}! = ${correct}. Forgetting the internal swap gives ${factorial(n - 1)}; ignoring the constraint gives ${n}! = ${factorial(n)}.`,
        },
      };
    },
  },
];
