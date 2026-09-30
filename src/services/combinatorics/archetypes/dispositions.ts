import {
  combinations,
  dispositions,
  dispositionsWithRepetition,
  factorial,
} from "../math-utils";
import type { Archetype } from "../types";

/**
 * Ordered selections: with and without repetition.
 * Distractors model the two classic confusions — using repetition when the
 * text forbids it (and vice versa) and dropping the order requirement.
 */
export const dispositionArchetypes: Archetype[] = [
  {
    id: "disposizioni-semplici-codice",
    difficulty: "base",
    generate(rng) {
      const n = rng.int(5, 9);
      const k = rng.int(2, 4);
      const correct = dispositions(n, k);
      return {
        archetype: "disposizioni-semplici-codice",
        difficulty: "base",
        text: {
          it: `Quanti codici di ${k} cifre tutte diverse si possono formare usando le cifre da 1 a ${n}?`,
          en: `How many ${k}-digit codes with all different digits can be formed using the digits from 1 to ${n}?`,
        },
        correct: `${correct}`,
        distractors: [
          `${dispositionsWithRepetition(n, k)}`,
          `${combinations(n, k)}`,
          `${factorial(n)}`,
        ],
        explanation: {
          it: `L'ordine conta e le cifre non si ripetono: sono disposizioni semplici D(${n},${k}) = ${Array.from({ length: k }, (_, i) => n - i).join(" · ")} = ${correct}. Se le cifre potessero ripetersi sarebbero ${n}^${k} = ${dispositionsWithRepetition(n, k)}; se l'ordine non contasse sarebbero C(${n},${k}) = ${combinations(n, k)}.`,
          en: `Order matters and digits cannot repeat, so these are simple dispositions D(${n},${k}) = ${Array.from({ length: k }, (_, i) => n - i).join(" · ")} = ${correct}. With repetition allowed it would be ${n}^${k} = ${dispositionsWithRepetition(n, k)}; ignoring order it would be C(${n},${k}) = ${combinations(n, k)}.`,
        },
      };
    },
  },
  {
    id: "disposizioni-ripetizione-targa",
    difficulty: "base",
    generate(rng) {
      const n = rng.int(3, 6);
      const k = rng.int(3, 4);
      const correct = dispositionsWithRepetition(n, k);
      return {
        archetype: "disposizioni-ripetizione-targa",
        difficulty: "base",
        text: {
          it: `Un lucchetto ha ${k} caselle e su ogni casella si possono impostare ${n} simboli diversi, anche ripetuti. Quante combinazioni diverse esistono?`,
          en: `A padlock has ${k} slots and each slot can be set to ${n} different symbols, repetitions allowed. How many different combinations exist?`,
        },
        correct: `${correct}`,
        distractors: [`${dispositions(n, k)}`, `${k ** n}`, `${combinations(n, k)}`],
        explanation: {
          it: `Ogni casella è indipendente e i simboli si possono ripetere: ${n}^${k} = ${correct}. ${dispositions(n, k)} sarebbe il risultato se i simboli dovessero essere tutti diversi, mentre ${k ** n} scambia la base con l'esponente.`,
          en: `Each slot is independent and symbols may repeat: ${n}^${k} = ${correct}. ${dispositions(n, k)} would apply if all symbols had to differ, while ${k ** n} swaps base and exponent.`,
        },
      };
    },
  },
  {
    id: "disposizioni-podio",
    difficulty: "intermediate",
    generate(rng) {
      const n = rng.int(6, 10);
      const k = 3;
      const correct = dispositions(n, k);
      return {
        archetype: "disposizioni-podio",
        difficulty: "intermediate",
        text: {
          it: `A una gara partecipano ${n} atleti. In quanti modi diversi possono essere assegnate le medaglie d'oro, d'argento e di bronzo?`,
          en: `${n} athletes take part in a race. In how many different ways can the gold, silver and bronze medals be awarded?`,
        },
        correct: `${correct}`,
        distractors: [
          `${combinations(n, k)}`,
          `${dispositionsWithRepetition(n, k)}`,
          `${n * k}`,
        ],
        explanation: {
          it: `Le tre medaglie sono diverse, quindi l'ordine conta: D(${n},3) = ${n} · ${n - 1} · ${n - 2} = ${correct}. C(${n},3) = ${combinations(n, k)} conterebbe solo i gruppi di tre atleti, senza distinguere chi vince l'oro.`,
          en: `The three medals are distinct, so order matters: D(${n},3) = ${n} · ${n - 1} · ${n - 2} = ${correct}. C(${n},3) = ${combinations(n, k)} would only count groups of three athletes, without saying who takes gold.`,
        },
      };
    },
  },
];
