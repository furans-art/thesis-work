import { Fraction, type Rng } from "../math-utils";
import type { Archetype, DistractorCandidate, GeneratedExercise, Localized } from "../types";
import { cand } from "./candidate";

/* ============= Total probability and Bayes ============= */

interface BayesScenario {
  /** batch size and pieces from machine 1 / machine 2 */
  batch: number;
  n1: number;
  /** defect rate of machine 1 as an exact fraction */
  r1: [number, number];
  n2: number;
  r2: [number, number];
}

/** Presets chosen so every defect count is an exact integer. */
const bayesScenarios: BayesScenario[] = [
  { batch: 200, n1: 120, r1: [1, 20], n2: 80, r2: [1, 8] }, // 6 + 10 = 16
  { batch: 300, n1: 180, r1: [1, 30], n2: 120, r2: [1, 10] }, // 6 + 12 = 18
  { batch: 100, n1: 70, r1: [1, 7], n2: 30, r2: [1, 5] }, // 10 + 6 = 16
  { batch: 400, n1: 240, r1: [1, 24], n2: 160, r2: [1, 8] }, // 10 + 20 = 30
];

function bayesExercise(scn: BayesScenario, ask: "total" | "bayes"): GeneratedExercise {
  const d1 = (scn.n1 * scn.r1[0]) / scn.r1[1];
  const d2 = (scn.n2 * scn.r2[0]) / scn.r2[1];
  const rate1 = new Fraction(scn.r1[0], scn.r1[1]);
  const rate2 = new Fraction(scn.r2[0], scn.r2[1]);
  const params = {
    ask,
    batch: scn.batch,
    n1: scn.n1,
    r1n: scn.r1[0],
    r1d: scn.r1[1],
    n2: scn.n2,
    r2n: scn.r2[0],
    r2d: scn.r2[1],
  };
  const intro = {
    it: `In una fabbrica la macchina 1 produce ${scn.n1} pezzi su ${scn.batch} e ne difetta il ${scn.r1[0]}/${scn.r1[1]}, mentre la macchina 2 ne produce ${scn.n2} su ${scn.batch} con tasso di difetti ${scn.r2[0]}/${scn.r2[1]}.`,
    en: `In a factory machine 1 produces ${scn.n1} of the ${scn.batch} pieces with a defect rate of ${scn.r1[0]}/${scn.r1[1]}, while machine 2 produces ${scn.n2} of them with a defect rate of ${scn.r2[0]}/${scn.r2[1]}.`,
  };

  if (ask === "total") {
    const correct = new Fraction(d1 + d2, scn.batch);
    return {
      archetype: "probabilita-totale-bayes",
      difficulty: "advanced",
      kind: "probability",
      params,
      text: {
        it: `${intro.it} Si estrae a caso un pezzo dell'intera produzione. Qual è la probabilità che sia difettoso?`,
        en: `${intro.en} One piece is drawn at random from the whole output. What is the probability that it is defective?`,
      },
      correct: correct.toString(),
      candidates: [
        cand("machine1-rate-only", "constraint-ignored", rate1,
          `Hai dato il tasso di difetti della sola macchina 1 (${rate1.toString()}): la domanda riguarda l'intera produzione, quindi pesa anche la quota di pezzi delle due macchine.`,
          `You gave the defect rate of machine 1 alone (${rate1.toString()}): the question concerns the whole output, so the share of pieces each machine produces matters too.`),
        cand("machine1-defects-only", "additive-union", new Fraction(d1, scn.batch),
          `Hai contato solo i difetti della macchina 1: la macchina 2 ne produce anch'essa ${d2} su ${scn.batch}, e tutti finiscono nello stesso lotto.`,
          `You counted only machine 1's defects: machine 2 also produces ${d2} defective pieces out of ${scn.batch}, and they all end up in the same batch.`),
        cand("machine2-defects-only", "additive-union", new Fraction(d2, scn.batch),
          `Hai contato solo i difetti della macchina 2: la macchina 1 ne produce anch'essa ${d1} su ${scn.batch}, e tutti finiscono nello stesso lotto.`,
          `You counted only machine 2's defects: machine 1 also produces ${d1} defective pieces out of ${scn.batch}, and they all end up in the same batch.`),
        cand("unweighted-average", "other", rate1.add(rate2).div(new Fraction(2)),
          `Hai fatto la media semplice dei due tassi: le macchine producono quantità diverse, quindi ogni tasso va pesato con la propria quota di produzione.`,
          `You took the plain average of the two rates: the machines produce different amounts, so each rate must be weighted by its share of output.`),
      ],
      explanation: {
        it: `Con un lotto di ${scn.batch} pezzi: la macchina 1 ne difetta ${d1} e la macchina 2 ne difetta ${d2}. In totale i difettosi sono ${d1 + d2}, quindi P(difettoso) = ${d1 + d2}/${scn.batch} = ${correct.toString()}. È la probabilità totale: P(D) = P(D|M₁)·P(M₁) + P(D|M₂)·P(M₂).`,
        en: `With a batch of ${scn.batch} pieces: machine 1 makes ${d1} defective ones and machine 2 makes ${d2}. In total ${d1 + d2} are defective, so P(defective) = ${d1 + d2}/${scn.batch} = ${correct.toString()}. This is the total probability: P(D) = P(D|M₁)·P(M₁) + P(D|M₂)·P(M₂).`,
      },
    };
  }

  const correct = new Fraction(d1, d1 + d2);
  return {
    archetype: "probabilita-totale-bayes",
    difficulty: "advanced",
    kind: "probability",
    params,
    text: {
      it: `${intro.it} Si estrae a caso un pezzo e si scopre che è difettoso. Qual è la probabilità che provenga dalla macchina 1?`,
      en: `${intro.en} A piece drawn at random turns out to be defective. What is the probability that it came from machine 1?`,
    },
    correct: correct.toString(),
    candidates: [
      cand("prior-share", "other", new Fraction(scn.n1, scn.batch),
        `È la probabilità a priori che un pezzo venga dalla macchina 1: la condizione «sapendo che è difettoso» restringe il campione ai soli difettosi, e in quel gruppo le proporzioni cambiano.`,
        `That is the prior probability that a piece comes from machine 1: the condition “knowing it is defective” restricts the sample to defective pieces only, and within that group the proportions change.`),
      cand("conditioning-inverted", "conditioning-inverted", rate1,
        `Hai confuso P(macchina 1 | difettoso) con il tasso di difetti P(difettoso | macchina 1): il teorema di Bayes inverte proprio la direzione del condizionamento.`,
        `You confused P(machine 1 | defective) with the defect rate P(defective | machine 1): Bayes' theorem reverses exactly the direction of conditioning.`),
      cand("machine2-share", "complement-ignored", new Fraction(d2, d1 + d2),
        `Hai calcolato la quota della macchina 2 fra i difettosi: per la macchina 1 basta prenderne il complementare.`,
        `You computed machine 2's share among the defective pieces: for machine 1 just take the complement.`),
      cand("joint-probability", "other", new Fraction(d1, scn.batch),
        `È la probabilità congiunta P(M₁ ∩ D) = ${d1}/${scn.batch}: va ancora divisa per P(D), perché sappiamo già che il pezzo è difettoso.`,
        `That is the joint probability P(M₁ ∩ D) = ${d1}/${scn.batch}: it must still be divided by P(D), since we already know the piece is defective.`),
    ],
    explanation: {
      it: `Fra i ${d1 + d2} pezzi difettosi, ${d1} vengono dalla macchina 1 e ${d2} dalla macchina 2. Quindi P(M₁|difettoso) = ${d1}/${d1 + d2} = ${correct.toString()}. È il teorema di Bayes: P(M₁|D) = P(D|M₁)·P(M₁) / P(D).`,
      en: `Among the ${d1 + d2} defective pieces, ${d1} come from machine 1 and ${d2} from machine 2. So P(M₁|defective) = ${d1}/${d1 + d2} = ${correct.toString()}. This is Bayes' theorem: P(M₁|D) = P(D|M₁)·P(M₁) / P(D).`,
    },
  };
}

/* ============= Pigeonhole principle ============= */

const drawerContexts: { it: (m: number) => string; en: (m: number) => string }[] = [
  {
    it: (m) => `In un cassetto ci sono calzini di ${m} colori diversi, in gran quantità e confusi fra loro. Quanti calzini occorre estrarre al buio, senza guardare, per essere certi di averne almeno {k} dello stesso colore?`,
    en: (m) => `A drawer holds socks in ${m} different colours, plenty of them and all mixed up. How many socks must be drawn in the dark, without looking, to be sure of getting at least {k} of the same colour?`,
  },
  {
    it: (m) => `Una scatola contiene matite di ${m} colori diversi, in gran quantità. Quante matite occorre estrarre a occhi chiusi per essere certi di averne almeno {k} dello stesso colore?`,
    en: (m) => `A box holds pencils in ${m} different colours, plenty of them. How many pencils must be drawn with your eyes shut to be sure of getting at least {k} of the same colour?`,
  },
  {
    it: (m) => `Un mazzo è diviso in ${m} semi diversi, con tante carte per ciascun seme. Quante carte occorre estrarre dal mazzo mescolato per essere certi di averne almeno {k} dello stesso seme?`,
    en: (m) => `A deck is divided into ${m} different suits, with many cards in each suit. How many cards must be drawn from the shuffled deck to be sure of getting at least {k} of the same suit?`,
  },
];

function pigeonholeExercise(rng: Rng): GeneratedExercise {
  const m = rng.int(2, 4);
  const k = rng.int(2, 3);
  const ctx = rng.pick(drawerContexts);
  const correct = m * (k - 1) + 1;
  const replaceK = (s: string) => s.replace("{k}", `${k}`);
  return {
    archetype: "principio-cassetti-dirichlet",
    difficulty: "intermediate",
    kind: "count",
    params: { m, k },
    text: { it: replaceK(ctx.it(m)), en: replaceK(ctx.en(m)) },
    correct: `${correct}`,
    candidates: [
      cand("best-case", "other", k,
        `È il minimo sperabile: ${k} estrazioni possono anche risultare tutte di colori diversi. La certezza si ottiene solo ragionando sul caso peggiore del principio dei cassetti.`,
        `That is the best you can hope for: ${k} draws may all come out in different colours. Certainty comes only from the worst case of the pigeonhole principle.`),
      cand("last-draw-missing", "other", m * (k - 1),
        `Ci manca l'ultima estrazione: con ${m * (k - 1)} pezzi puoi ancora avere solo ${k - 1} esemplari per ciascun colore; quello successivo crea per forza il ${k}-esimo di un colore.`,
        `The last draw is missing: with ${m * (k - 1)} items you may still have only ${k - 1} of each colour; the next one necessarily creates the ${k}-th of some colour.`),
      cand("k-of-every-colour", "other", m * k,
        `Hai contato ${k} pezzi per ogni colore (${m} · ${k}): basta che un solo colore arrivi a ${k}, non tutti.`,
        `You counted ${k} items for every colour (${m} · ${k}): only one colour has to reach ${k}, not all of them.`),
      cand("k-of-every-colour-plus-one", "other", m * k + 1,
        `Hai applicato la formula con ${k} invece di ${k - 1}: nel caso peggiore ogni colore ha al massimo ${k - 1} pezzi, quindi servono ${m} · ${k - 1} + 1 estrazioni.`,
        `You applied the formula with ${k} instead of ${k - 1}: in the worst case each colour holds at most ${k - 1} items, so ${m} · ${k - 1} + 1 draws are needed.`),
    ],
    explanation: {
      it: `Caso peggiore: le prime ${m * (k - 1)} estrazioni distribuiscono al massimo ${k - 1} pezzi per ciascuno dei ${m} colori. Il pezzo successivo, il numero ${m * (k - 1) + 1}, non ha scelta: completa il ${k}-esimo esemplare di qualche colore. Quindi bastano ${correct} estrazioni.`,
      en: `Worst case: the first ${m * (k - 1)} draws distribute at most ${k - 1} items per each of the ${m} colours. The next item, number ${m * (k - 1) + 1}, has no choice: it completes the ${k}-th of some colour. So ${correct} draws suffice.`,
    },
  };
}

/* ============= At least one ============= */

function atLeastOneExercise(rng: Rng): GeneratedExercise {
  const p = rng.pick([new Fraction(1, 6), new Fraction(1, 2), new Fraction(1, 3), new Fraction(1, 4)]);
  const maxN = p.equals(new Fraction(1, 2)) ? 5 : 4;
  const n = rng.int(2, maxN);
  const q = p.complement();

  const power = (f: Fraction, e: number) => {
    let r = new Fraction(1, 1);
    for (let i = 0; i < e; i += 1) r = r.mul(f);
    return r;
  };
  const qn = power(q, n);
  const correct = qn.complement();

  const candidates: DistractorCandidate[] = [
    cand("added-attempts", "additive-union", new Fraction(n * p.n, p.d),
      `Hai sommato le probabilità dei singoli tentativi (${n} × ${p.toString()}): così conti più volte i casi in cui più tentativi riescono insieme. Il metodo corretto passa dal complementare 1 − qⁿ.`,
      `You added up the single-attempt probabilities (${n} × ${p.toString()}): that counts several times the cases where more attempts succeed together. The correct route goes through the complement 1 − qⁿ.`),
    cand("complement-itself", "complement-ignored", qn,
      `È la probabilità dell'evento contrario, cioè che nessun tentativo riesca: «almeno uno» si ottiene con 1 − qⁿ.`,
      `That is the probability of the opposite event, that no attempt succeeds: “at least one” is obtained with 1 − qⁿ.`),
    cand("success-in-fixed-position", "order-irrelevant", p.mul(power(q, n - 1)),
      `È la probabilità di un successo in una posizione precisa e insuccesso negli altri ${n - 1} tentativi, p · (1 − p)^${n - 1}: «almeno uno» ammette successi in qualsiasi posizione e anche più di uno.`,
      `That is the probability of a success in one specific position and failure in the other ${n - 1} attempts, p · (1 − p)^${n - 1}: “at least one” allows successes in any position, and more than one.`),
    cand("single-attempt", "other", p,
      `È la probabilità di un solo tentativo: con ${n} tentativi indipendenti la probabilità di successo sale.`,
      `That is the probability of a single attempt: with ${n} independent attempts the success probability rises.`),
    cand("all-succeed-complement", "complement-ignored", power(p, n).complement(),
      `Hai calcolato 1 − pⁿ, cioè la probabilità che non tutti i tentativi riescano: il complementare di «almeno uno» è «nessuno», non «tutti».`,
      `You computed 1 − pⁿ, the probability that not every attempt succeeds: the complement of “at least one” is “none”, not “all”.`),
  ];

  const text: Localized = p.equals(new Fraction(1, 2))
    ? {
        it: `Una moneta equa viene lanciata ${n} volte. Qual è la probabilità di ottenere almeno una testa?`,
        en: `A fair coin is tossed ${n} times. What is the probability of getting at least one head?`,
      }
    : p.equals(new Fraction(1, 6))
      ? {
          it: `Un dado equo a sei facce viene lanciato ${n} volte. Qual è la probabilità di ottenere almeno un sei?`,
          en: `A fair six-sided die is rolled ${n} times. What is the probability of getting at least a six?`,
        }
      : {
          it: `La probabilità di centrare il bersaglio a ogni tiro è ${p.toString()}. Effettuando ${n} tiri indipendenti, qual è la probabilità di centrarlo almeno una volta?`,
          en: `The probability of hitting the target on each shot is ${p.toString()}. Taking ${n} independent shots, what is the probability of hitting it at least once?`,
        };

  return {
    archetype: "probabilita-almeno-uno",
    difficulty: "intermediate",
    kind: "probability",
    params: { pd: p.d, n },
    text,
    correct: correct.toString(),
    candidates,
    explanation: {
      it: `Ogni tentativo fallisce con probabilità q = 1 − ${p.toString()} = ${q.toString()}. Tutti i ${n} tentativi falliscono con probabilità q^${n} = ${qn.toString()}. Quindi P(almeno uno) = 1 − ${qn.toString()} = ${correct.toString()}.`,
      en: `Each attempt fails with probability q = 1 − ${p.toString()} = ${q.toString()}. All ${n} attempts fail with probability q^${n} = ${qn.toString()}. So P(at least one) = 1 − ${qn.toString()} = ${correct.toString()}.`,
    },
  };
}

/* ============= Positional constraints on codes ============= */

type Parity = "even" | "odd" | "any";

interface PositionVariant {
  length: number;
  first: Parity;
  last: Parity;
  text: Localized;
  correct: number;
  candidates: DistractorCandidate[];
  detail: Localized;
}

const unconstrained = (value: number, it: string, en: string) =>
  cand("constraint-ignored", "constraint-ignored", value, it, en);
const repeated = (value: number, it: string, en: string) =>
  cand("with-repetition", "repetition", value, it, en);

const positionVariants: PositionVariant[] = [
  {
    length: 4,
    first: "even",
    last: "any",
    text: {
      it: "Quanti codici di 4 cifre tutte diverse iniziano con una cifra pari? (Lo 0 è pari e può comparire ovunque.)",
      en: "How many 4-digit codes with all different digits start with an even digit? (0 is even and may appear anywhere.)",
    },
    correct: 5 * 9 * 8 * 7, // 2520
    candidates: [
      unconstrained(10 * 9 * 8 * 7,
        "Hai contato tutti i codici con cifre distinte senza applicare il vincolo sulla prima cifra pari.",
        "You counted all codes with distinct digits without applying the first-digit-even constraint."),
      repeated(10 ** 4,
        "Hai permesso di ripetere le cifre: «tutte diverse» richiede le disposizioni semplici, in cui ogni cifra scelta si esclude dalle successive.",
        "You allowed digits to repeat: “all different” calls for simple dispositions, where each chosen digit is excluded afterwards."),
      cand("zero-excluded", "other", 4 * 9 * 8 * 7,
        "Hai escluso lo zero dalle cifre pari: 0 è pari e, in un codice, può stare anche al primo posto.",
        "You left zero out of the even digits: 0 is even and, in a code, may well come first."),
      cand("constraint-then-repetition", "repetition", 5 * 10 ** 3,
        "Hai applicato il vincolo sulla prima cifra ma poi hai permesso di ripetere le cifre (5 · 10 · 10 · 10): le cifre devono essere tutte diverse.",
        "You applied the first-digit constraint but then allowed digits to repeat (5 · 10 · 10 · 10): all digits must differ."),
    ],
    detail: {
      it: "La prima cifra ha 5 scelte (0, 2, 4, 6, 8). A quel punto restano 9 cifre, poi 8, poi 7: totale 5 · 9 · 8 · 7 = 2520.",
      en: "The first digit has 5 choices (0, 2, 4, 6, 8). Then 9, 8 and 7 digits remain: total 5 · 9 · 8 · 7 = 2520.",
    },
  },
  {
    length: 4,
    first: "any",
    last: "odd",
    text: {
      it: "Quanti codici di 4 cifre tutte diverse terminano con una cifra dispari?",
      en: "How many 4-digit codes with all different digits end with an odd digit?",
    },
    correct: 9 * 8 * 7 * 5, // 2520
    candidates: [
      unconstrained(10 * 9 * 8 * 7,
        "Hai contato tutti i codici con cifre distinte, senza applicare il vincolo sull'ultima cifra dispari.",
        "You counted all codes with distinct digits, without applying the last-digit-odd constraint."),
      repeated(10 ** 4,
        "Hai permesso di ripetere le cifre: «tutte diverse» esclude i codici in cui una cifra compare più volte.",
        "You allowed digits to repeat: “all different” rules out codes where a digit appears more than once."),
      cand("used-digit-not-removed", "constraint-applied-once", 10 * 9 * 8 * 5,
        "Hai fissato l'ultima cifra prima delle altre ma hai contato 10 scelte per la prima: una delle cifre dispari è già usata alla fine, quindi le restanti sono 9.",
        "You fixed the last digit first but counted 10 choices for the first: one odd digit is already used at the end, so only 9 remain."),
      cand("constraint-then-repetition", "repetition", 10 ** 3 * 5,
        "Hai applicato il vincolo sull'ultima cifra ma poi hai permesso di ripetere le altre (10 · 10 · 10 · 5): le cifre devono essere tutte diverse.",
        "You applied the last-digit constraint but then allowed the other digits to repeat (10 · 10 · 10 · 5): all digits must differ."),
    ],
    detail: {
      it: "Conviene partire dalla posizione vincolata: l'ultima cifra ha 5 scelte (1, 3, 5, 7, 9); le altre si riempiono con le cifre rimaste: 9 · 8 · 7. Totale 9 · 8 · 7 · 5 = 2520.",
      en: "Start from the constrained position: the last digit has 5 choices (1, 3, 5, 7, 9); the others are filled with the remaining digits: 9 · 8 · 7. Total 9 · 8 · 7 · 5 = 2520.",
    },
  },
  {
    length: 4,
    first: "odd",
    last: "even",
    text: {
      it: "Quanti codici di 4 cifre tutte diverse iniziano con una cifra dispari e terminano con una cifra pari?",
      en: "How many 4-digit codes with all different digits start with an odd digit and end with an even digit?",
    },
    correct: 5 * 5 * 8 * 7, // 1400
    candidates: [
      unconstrained(10 * 9 * 8 * 7,
        "Hai contato tutti i codici con cifre distinte, ignorando entrambi i vincoli di parità sulle estremità.",
        "You counted all codes with distinct digits, ignoring both parity constraints on the ends."),
      repeated(10 ** 4,
        "Hai permesso di ripetere le cifre: «tutte diverse» richiede di escludere a ogni passo le cifre già usate.",
        "You allowed digits to repeat: “all different” requires excluding, at every step, the digits already used."),
      cand("reading-order", "other", 5 * 9 * 8 * 5, // 1800
        "Hai scelto le posizioni nell'ordine di lettura: ma dopo le due cifre centrali le pari disponibili non sono sempre 5. Conviene fissare prima le due estremità (5 · 5) e poi riempire il centro (8 · 7).",
        "You filled the positions in reading order: but after the two middle digits the number of available evens is not always 5. Fix the two ends first (5 · 5), then fill the middle (8 · 7)."),
      cand("one-constraint-only", "constraint-applied-once", 5 * 9 * 8 * 7,
        "Hai applicato solo il vincolo sulla prima cifra: anche l'ultima deve essere pari.",
        "You applied only the first-digit constraint: the last digit must be even as well."),
    ],
    detail: {
      it: "Scegli prima le estremità: ultima cifra pari (5 scelte), prima cifra dispari (5 scelte, tutti i dispari sono ancora disponibili). Restano 8 cifre per la seconda e 7 per la terza: 5 · 5 · 8 · 7 = 1400.",
      en: "Choose the ends first: last digit even (5 choices), first digit odd (5 choices, all odds still available). Then 8 digits remain for the second position and 7 for the third: 5 · 5 · 8 · 7 = 1400.",
    },
  },
  {
    length: 3,
    first: "even",
    last: "any",
    text: {
      it: "Quanti codici di 3 cifre tutte diverse iniziano con una cifra pari? (Lo 0 è pari e può comparire ovunque.)",
      en: "How many 3-digit codes with all different digits start with an even digit? (0 is even and may appear anywhere.)",
    },
    correct: 5 * 9 * 8, // 360
    candidates: [
      unconstrained(10 * 9 * 8,
        "Hai contato tutti i codici di 3 cifre con cifre distinte, senza applicare il vincolo sulla prima cifra pari.",
        "You counted all 3-digit codes with distinct digits, without applying the first-digit-even constraint."),
      repeated(10 ** 3,
        "Hai permesso di ripetere le cifre: «tutte diverse» richiede le disposizioni semplici, non quelle con ripetizione.",
        "You allowed digits to repeat: “all different” calls for simple dispositions, not dispositions with repetition."),
      cand("zero-excluded", "other", 4 * 9 * 8,
        "Hai escluso lo zero dalle cifre pari: 0 è pari e, in un codice, può stare anche al primo posto.",
        "You left zero out of the even digits: 0 is even and, in a code, may well come first."),
      cand("constraint-then-repetition", "repetition", 5 * 10 * 10,
        "Hai applicato il vincolo sulla prima cifra ma poi hai permesso di ripetere le cifre (5 · 10 · 10): le cifre devono essere tutte diverse.",
        "You applied the first-digit constraint but then allowed digits to repeat (5 · 10 · 10): all digits must differ."),
    ],
    detail: {
      it: "La prima cifra ha 5 scelte (0, 2, 4, 6, 8); restano 9 e poi 8 cifre: 5 · 9 · 8 = 360.",
      en: "The first digit has 5 choices (0, 2, 4, 6, 8); then 9 and 8 digits remain: 5 · 9 · 8 = 360.",
    },
  },
];

function positionExercise(rng: Rng): GeneratedExercise {
  const v = rng.pick(positionVariants);
  return {
    archetype: "disposizioni-vincolo-posizione",
    difficulty: "intermediate",
    kind: "count",
    params: { length: v.length, first: v.first, last: v.last },
    text: v.text,
    correct: `${v.correct}`,
    candidates: v.candidates,
    explanation: v.detail,
  };
}

export const advancedArchetypes: Archetype[] = [
  {
    id: "probabilita-totale-bayes",
    difficulty: "advanced",
    generate(rng) {
      return bayesExercise(rng.pick(bayesScenarios), rng.pick(["total", "bayes"]));
    },
  },
  {
    id: "principio-cassetti-dirichlet",
    difficulty: "intermediate",
    generate: pigeonholeExercise,
  },
  {
    id: "probabilita-almeno-uno",
    difficulty: "intermediate",
    generate: atLeastOneExercise,
  },
  {
    id: "disposizioni-vincolo-posizione",
    difficulty: "intermediate",
    generate: positionExercise,
  },
];
