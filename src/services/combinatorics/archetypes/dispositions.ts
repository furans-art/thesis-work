import {
  combinations,
  dispositions,
  dispositionsWithRepetition,
  factorial,
} from "../math-utils";
import type { Archetype } from "../types";
import { cand } from "./candidate";

/**
 * Ordered selections: with and without repetition.
 * Distractors model the classic confusions — using repetition when the
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
        kind: "count",
        params: { n, k },
        text: {
          it: `Quanti codici di ${k} cifre tutte diverse si possono formare usando le cifre da 1 a ${n}?`,
          en: `How many ${k}-digit codes with all different digits can be formed using the digits from 1 to ${n}?`,
        },
        correct: `${correct}`,
        candidates: [
          cand("with-repetition", "repetition", dispositionsWithRepetition(n, k),
            `Hai consentito di ripetere le cifre: «tutte diverse» esclude i codici con cifre ripetute, quindi si contano disposizioni semplici, non disposizioni con ripetizione (${n}^${k}).`,
            `You allowed digits to repeat: “all different” rules out codes with repeated digits, so you count simple dispositions, not dispositions with repetition (${n}^${k}).`),
          cand("order-dropped", "order-irrelevant", combinations(n, k),
            `Hai ignorato l'ordine: un codice è una sequenza ordinata, quindi scambiare due cifre produce un codice diverso.`,
            `You ignored the order: a code is an ordered sequence, so swapping two digits produces a different code.`),
          cand("all-digits-permuted", "constraint-ignored", factorial(n),
            `Hai contato le permutazioni di tutte le ${n} cifre: il codice usa solo ${k} posizioni, quindi il prodotto si arresta dopo ${k} fattori.`,
            `You counted the permutations of all ${n} digits: the code uses only ${k} positions, so the product stops after ${k} factors.`),
          cand("digits-times-positions", "other", n * k,
            `Hai moltiplicato il numero di cifre per il numero di posizioni (${n} · ${k}): le scelte per posizione vanno moltiplicate fra loro, non sommate ${k} volte.`,
            `You multiplied the number of digits by the number of positions (${n} · ${k}): the choices per position multiply together, they are not added ${k} times.`),
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
        kind: "count",
        params: { n, k },
        text: {
          it: `Un lucchetto ha ${k} caselle e su ogni casella si possono impostare ${n} simboli diversi, anche ripetuti. Quante combinazioni diverse esistono?`,
          en: `A padlock has ${k} slots and each slot can be set to ${n} different symbols, repetitions allowed. How many different combinations exist?`,
        },
        correct: `${correct}`,
        candidates: [
          cand("repetition-excluded", "repetition", dispositions(n, k),
            `Hai escluso le ripetizioni: il testo dice esplicitamente che i simboli si possono ripetere su caselle diverse.`,
            `You ruled out repetitions: the text explicitly says symbols may repeat on different slots.`),
          cand("base-exponent-swapped", "other", k ** n,
            `Hai scambiato la base con l'esponente: sono ${k} caselle con ${n} simboli ciascuna, quindi la base è ${n} e l'esponente è ${k}.`,
            `You swapped the base and the exponent: there are ${k} slots with ${n} symbols each, so the base is ${n} and the exponent is ${k}.`),
          cand("order-dropped", "order-irrelevant", combinations(n, k),
            `Hai trattato il codice come un insieme senza ordine: invece ogni posizione del lucchetto è distinta, quindi l'ordine conta.`,
            `You treated the code as an unordered set: each padlock position is distinct, so order matters.`),
          cand("unordered-with-repetition", "order-irrelevant", combinations(n + k - 1, k),
            `Hai contato le combinazioni con ripetizione C(${n + k - 1},${k}): ammetti le ripetizioni ma ignori l'ordine, mentre le caselle del lucchetto sono distinte.`,
            `You counted combinations with repetition C(${n + k - 1},${k}): repetitions are allowed but you ignored order, whereas the padlock slots are distinct.`),
          cand("symbols-times-slots", "other", n * k,
            `Hai moltiplicato simboli per caselle (${n} · ${k}): ogni casella moltiplica le possibilità, quindi serve la potenza ${n}^${k}.`,
            `You multiplied symbols by slots (${n} · ${k}): each slot multiplies the possibilities, so you need the power ${n}^${k}.`),
        ],
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
        kind: "count",
        params: { n },
        text: {
          it: `A una gara partecipano ${n} atleti. In quanti modi diversi possono essere assegnate le medaglie d'oro, d'argento e di bronzo?`,
          en: `${n} athletes take part in a race. In how many different ways can the gold, silver and bronze medals be awarded?`,
        },
        correct: `${correct}`,
        candidates: [
          cand("order-dropped", "order-irrelevant", combinations(n, k),
            `Hai contato solo i gruppi di tre atleti: il podio distingue oro, argento e bronzo, quindi l'ordine conta e servono le disposizioni.`,
            `You counted only the groups of three athletes: the podium distinguishes gold, silver and bronze, so order matters and you need dispositions.`),
          cand("with-repetition", "repetition", dispositionsWithRepetition(n, k),
            `Hai permesso che lo stesso atleta vincesse più medaglie: chi prende l'oro non può più prendere l'argento, quindi i fattori calano a ogni assegnazione.`,
            `You allowed the same athlete to win more than one medal: whoever takes gold cannot also take silver, so the factors drop at each award.`),
          cand("athletes-times-medals", "other", n * k,
            `Hai moltiplicato gli atleti per le medaglie (${n} · 3): a ogni assegnazione gli atleti disponibili diminuiscono e i fattori vanno moltiplicati fra loro (${n} · ${n - 1} · ${n - 2}).`,
            `You multiplied athletes by medals (${n} · 3): at each award the available athletes shrink and the factors multiply together (${n} · ${n - 1} · ${n - 2}).`),
          cand("full-ranking", "constraint-ignored", factorial(n),
            `Hai contato l'intera classifica di tutti i ${n} atleti: contano solo i primi tre posti.`,
            `You counted the full ranking of all ${n} athletes: only the first three places matter.`),
        ],
        explanation: {
          it: `Le tre medaglie sono diverse, quindi l'ordine conta: D(${n},3) = ${n} · ${n - 1} · ${n - 2} = ${correct}. C(${n},3) = ${combinations(n, k)} conterebbe solo i gruppi di tre atleti, senza distinguere chi vince l'oro.`,
          en: `The three medals are distinct, so order matters: D(${n},3) = ${n} · ${n - 1} · ${n - 2} = ${correct}. C(${n},3) = ${combinations(n, k)} would only count groups of three athletes, without saying who takes gold.`,
        },
      };
    },
  },
];
