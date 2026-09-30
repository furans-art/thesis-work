import { Fraction } from "../math-utils";
import type { Archetype, GeneratedExercise, Localized } from "../types";

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

  if (ask === "total") {
    const correct = new Fraction(d1 + d2, scn.batch);
    return {
      archetype: "probabilita-totale-bayes",
      difficulty: "advanced",
      text: {
        it: `In una fabbrica la macchina 1 produce ${scn.n1} pezzi su ${scn.batch} e ne difetta il ${scn.r1[0]}/${scn.r1[1]}, mentre la macchina 2 ne produce ${scn.n2} su ${scn.batch} con tasso di difetti ${scn.r2[0]}/${scn.r2[1]}. Si estrae a caso un pezzo dell'intera produzione. Qual è la probabilità che sia difettoso?`,
        en: `In a factory machine 1 produces ${scn.n1} of the ${scn.batch} pieces with a defect rate of ${scn.r1[0]}/${scn.r1[1]}, while machine 2 produces ${scn.n2} of them with a defect rate of ${scn.r2[0]}/${scn.r2[1]}. One piece is drawn at random from the whole output. What is the probability that it is defective?`,
      },
      correct: correct.toString(),
      distractors: [
        rate1.toString(),
        new Fraction(d1, scn.batch).toString(),
        new Fraction(d2, scn.batch).toString(),
      ],
      diagnoses: [
        {
          it: `Hai dato il tasso di difetti della sola macchina 1 (${rate1.toString()}): la domanda riguarda l'intera produzione, quindi pesa anche la quota di pezzi delle due macchine.`,
          en: `You gave the defect rate of machine 1 alone (${rate1.toString()}): the question concerns the whole output, so the share of pieces each machine produces matters too.`,
        },
        {
          it: `Hai contato solo i difetti della macchina 1: la macchina 2 ne produce anch'essa ${d2} su ${scn.batch}, e tutti finiscono nello stesso lotto.`,
          en: `You counted only machine 1's defects: machine 2 also produces ${d2} defective pieces out of ${scn.batch}, and they all end up in the same batch.`,
        },
        {
          it: `Hai contato solo i difetti della macchina 2: la macchina 1 ne produce anch'essa ${d1} su ${scn.batch}, e tutti finiscono nello stesso lotto.`,
          en: `You counted only machine 2's defects: machine 1 also produces ${d1} defective pieces out of ${scn.batch}, and they all end up in the same batch.`,
        },
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
    text: {
      it: `In una fabbrica la macchina 1 produce ${scn.n1} pezzi su ${scn.batch} e ne difetta il ${scn.r1[0]}/${scn.r1[1]}, mentre la macchina 2 ne produce ${scn.n2} su ${scn.batch} con tasso di difetti ${scn.r2[0]}/${scn.r2[1]}. Si estrae a caso un pezzo e si scopre che è difettoso. Qual è la probabilità che provenga dalla macchina 1?`,
      en: `In a factory machine 1 produces ${scn.n1} of the ${scn.batch} pieces with a defect rate of ${scn.r1[0]}/${scn.r1[1]}, while machine 2 produces ${scn.n2} of them with a defect rate of ${scn.r2[0]}/${scn.r2[1]}. A piece drawn at random turns out to be defective. What is the probability that it came from machine 1?`,
    },
    correct: correct.toString(),
    distractors: [
      new Fraction(scn.n1, scn.batch).toString(),
      rate1.toString(),
      new Fraction(d2, d1 + d2).toString(),
    ],
    diagnoses: [
      {
        it: `È la probabilità a priori che un pezzo venga dalla macchina 1: la condizione «sapendo che è difettoso» restringe il campione ai soli difettosi, e in quel gruppo le proporzioni cambiano.`,
        en: `That is the prior probability that a piece comes from machine 1: the condition “knowing it is defective” restricts the sample to defective pieces only, and within that group the proportions change.`,
      },
      {
        it: `Hai confuso P(macchina 1 | difettoso) con il tasso di difetti P(difettoso | macchina 1): il teorema di Bayes inverte proprio la direzione del condizionamento.`,
        en: `You confused P(machine 1 | defective) with the defect rate P(defective | machine 1): Bayes' theorem reverses exactly the direction of conditioning.`,
      },
      {
        it: `Hai calcolato la quota della macchina 2 fra i difettosi: per la macchina 1 basta prenderne il complementare.`,
        en: `You computed machine 2's share among the defective pieces: for machine 1 just take the complement.`,
      },
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

function pigeonholeExercise(rng: import("../math-utils").Rng): GeneratedExercise {
  const m = rng.int(2, 4);
  const k = rng.int(2, 3);
  const ctx = rng.pick(drawerContexts);
  const correct = m * (k - 1) + 1;
  const replaceK = (s: string) => s.replace("{k}", `${k}`);
  return {
    archetype: "principio-cassetti-dirichlet",
    difficulty: "intermediate",
    text: { it: replaceK(ctx.it(m)), en: replaceK(ctx.en(m)) },
    correct: `${correct}`,
    distractors: [`${k}`, `${m * (k - 1)}`, `${m * k}`],
    diagnoses: [
      {
        it: `È il minimo sperabile: ${k} estrazioni possono anche risultare tutte di colori diversi. La certezza si ottiene solo ragionando sul caso peggiore del principio dei cassetti.`,
        en: `That is the best you can hope for: ${k} draws may all come out in different colours. Certainty comes only from the worst case of the pigeonhole principle.`,
      },
      {
        it: `Ci manca l'ultima estrazione: con ${m * (k - 1)} pezzi puoi ancora avere solo ${k - 1} esemplari per ciascun colore; quello successivo crea per forza il ${k}-esimo di un colore.`,
        en: `The last draw is missing: with ${m * (k - 1)} items you may still have only ${k - 1} of each colour; the next one necessarily creates the ${k}-th of some colour.`,
      },
      {
        it: `Ne conta ${m - 1} di troppo: il ${k}-esimo pezzo dello stesso colore compare già con ${m * (k - 1) + 1} estrazioni, senza doverne riunire ${k} per ogni colore.`,
        en: `That is ${m - 1} too many: the ${k}-th item of the same colour already appears after ${m * (k - 1) + 1} draws, without gathering ${k} of every colour.`,
      },
    ],
    explanation: {
      it: `Caso peggiore: le prime ${m * (k - 1)} estrazioni distribuiscono al massimo ${k - 1} pezzi per ciascuno dei ${m} colori. Il pezzo successivo, il numero ${m * (k - 1) + 1}, non ha scelta: completa il ${k}-esimo esemplare di qualche colore. Quindi bastano ${correct} estrazioni.`,
      en: `Worst case: the first ${m * (k - 1)} draws distribute at most ${k - 1} items per each of the ${m} colours. The next item, number ${m * (k - 1) + 1}, has no choice: it completes the ${k}-th of some colour. So ${correct} draws suffice.`,
    },
  };
}

/* ============= At least one ============= */

interface AtLeastVariant {
  text: (n: number) => Localized;
  p: Fraction;
  n: number;
  distractors: { value: Fraction; why: Localized }[];
  details: (n: number, p: Fraction) => Localized;
}

function atLeastOneExercise(rng: import("../math-utils").Rng): GeneratedExercise {
  const p = rng.pick([new Fraction(1, 6), new Fraction(1, 2), new Fraction(1, 3), new Fraction(1, 4)]);
  const maxN = p.equals(new Fraction(1, 2)) ? 5 : 4;
  const n = rng.int(2, maxN);
  const q = p.complement();

  // 1 − qⁿ with exact arithmetic
  let qn = new Fraction(1, 1);
  for (let i = 0; i < n; i += 1) qn = qn.mul(q);
  const correct = qn.complement();

  // Candidate distractors, filtered to stay valid probabilities
  const candidates: { value: Fraction; why: Localized }[] = [
    {
      value: new Fraction(n * p.n, p.d),
      why: {
        it: `Hai sommato le probabilità dei singoli tentativi (${n} × ${p.toString()}): così conti più volte i casi in cui più tentativi riescono insieme. Il metodo corretto passa dal complementare 1 − qⁿ.`,
        en: `You added up the single-attempt probabilities (${n} × ${p.toString()}): that counts several times the cases where more attempts succeed together. The correct route goes through the complement 1 − qⁿ.`,
      },
    },
    {
      value: qn,
      why: {
        it: `È la probabilità dell'evento contrario, cioè che nessun tentativo riesca: «almeno uno» si ottiene con 1 − qⁿ.`,
        en: `That is the probability of the opposite event, that no attempt succeeds: “at least one” is obtained with 1 − qⁿ.`,
      },
    },
    {
      value: p.mul(qn),
      why: {
        it: `Corrisponde a un successo in una posizione precisa (per esempio solo il primo tentativo), non a un successo in qualsiasi posizione.`,
        en: `That corresponds to one success in a specific position (for instance only the first attempt), not a success in any position.`,
      },
    },
    {
      value: p,
      why: {
        it: `È la probabilità di un solo tentativo: con ${n} tentativi indipendenti la probabilità di successo sale.`,
        en: `That is the probability of a single attempt: with ${n} independent attempts the success probability rises.`,
      },
    },
  ];

  const unit = p.equals(new Fraction(1, 2))
    ? { it: "testa", en: "heads" }
    : p.equals(new Fraction(1, 6))
      ? { it: "un sei", en: "a six" }
      : { it: "il bersaglio", en: "the target" };

  const text: AtLeastVariant["text"] = (nn) =>
    p.equals(new Fraction(1, 2))
      ? {
          it: `Una moneta equa viene lanciata ${nn} volte. Qual è la probabilità di ottenere almeno una testa?`,
          en: `A fair coin is tossed ${nn} times. What is the probability of getting at least one head?`,
        }
      : p.equals(new Fraction(1, 6))
        ? {
            it: `Un dado equo a sei facce viene lanciato ${nn} volte. Qual è la probabilità di ottenere almeno ${unit.it}?`,
            en: `A fair six-sided die is rolled ${nn} times. What is the probability of getting at least ${unit.en}?`,
          }
        : {
            it: `La probabilità di centrare il bersaglio a ogni tiro è ${p.toString()}. Effettuando ${nn} tiri indipendenti, qual è la probabilità di centrarlo almeno una volta?`,
            en: `The probability of hitting the target on each shot is ${p.toString()}. Taking ${nn} independent shots, what is the probability of hitting it at least once?`,
          };

  const details: AtLeastVariant["details"] = (nn, pp) => ({
    it: `Ogni tentativo fallisce con probabilità q = 1 − ${pp.toString()} = ${q.toString()}. Tutti i ${nn} tentativi falliscono con probabilità q^${nn} = ${qn.toString()}. Quindi P(almeno uno) = 1 − ${qn.toString()} = ${correct.toString()}.`,
    en: `Each attempt fails with probability q = 1 − ${pp.toString()} = ${q.toString()}. All ${nn} attempts fail with probability q^${nn} = ${qn.toString()}. So P(at least one) = 1 − ${qn.toString()} = ${correct.toString()}.`,
  });

  const chosen: { value: Fraction; why: Localized }[] = [];
  const used = new Set<string>([correct.toString()]);
  for (const c of candidates) {
    if (chosen.length === 3) break;
    if (c.value.value >= 1 || c.value.n <= 0) continue;
    if (used.has(c.value.toString())) continue;
    used.add(c.value.toString());
    chosen.push(c);
  }

  return {
    archetype: "probabilita-almeno-uno",
    difficulty: "intermediate",
    text: text(n),
    correct: correct.toString(),
    distractors: chosen.map((c) => c.value.toString()),
    diagnoses: chosen.map((c) => c.why),
    explanation: details(n, p),
  };
}

/* ============= Positional constraints on codes ============= */

interface PositionVariant {
  text: Localized;
  correct: number;
  distractors: { value: number; why: Localized }[];
  detail: Localized;
}

const positionVariants: PositionVariant[] = [
  {
    text: {
      it: "Quanti codici di 4 cifre tutte diverse iniziano con una cifra pari? (Lo 0 è pari e può comparire ovunque.)",
      en: "How many 4-digit codes with all different digits start with an even digit? (0 is even and may appear anywhere.)",
    },
    correct: 5 * 9 * 8 * 7, // 2520
    distractors: [
      {
        value: 10 * 9 * 8 * 7, // 5040, no constraint
        why: {
          it: "Hai contato tutti i codici con cifre distinte senza applicare il vincolo sulla prima cifra pari.",
          en: "You counted all codes with distinct digits without applying the first-digit-even constraint.",
        },
      },
      {
        value: 10 ** 4, // repetition allowed
        why: {
          it: "Hai permesso di ripetere le cifre: «tutte diverse» richiede le disposizioni semplici, in cui ogni cifra scelta si esclude dalle successive.",
          en: "You allowed digits to repeat: “all different” calls for simple dispositions, where each chosen digit is excluded afterwards.",
        },
      },
      {
        value: 4 * 9 * 8 * 7, // zero excluded
        why: {
          it: "Hai escluso lo zero dalle cifre pari: 0 è pari e, in un codice, può stare anche al primo posto.",
          en: "You left zero out of the even digits: 0 is even and, in a code, may well come first.",
        },
      },
    ],
    detail: {
      it: "La prima cifra ha 5 scelte (0, 2, 4, 6, 8). A quel punto restano 9 cifre, poi 8, poi 7: totale 5 · 9 · 8 · 7 = 2520.",
      en: "The first digit has 5 choices (0, 2, 4, 6, 8). Then 9, 8 and 7 digits remain: total 5 · 9 · 8 · 7 = 2520.",
    },
  },
  {
    text: {
      it: "Quanti codici di 4 cifre tutte diverse terminano con una cifra dispari?",
      en: "How many 4-digit codes with all different digits end with an odd digit?",
    },
    correct: 9 * 8 * 7 * 5, // 2520
    distractors: [
      {
        value: 10 * 9 * 8 * 7,
        why: {
          it: "Hai contato tutti i codici con cifre distinte, senza applicare il vincolo sull'ultima cifra dispari.",
          en: "You counted all codes with distinct digits, without applying the last-digit-odd constraint.",
        },
      },
      {
        value: 10 ** 4,
        why: {
          it: "Hai permesso di ripetere le cifre: «tutte diverse» esclude i codici in cui una cifra compare più volte.",
          en: "You allowed digits to repeat: “all different” rules out codes where a digit appears more than once.",
        },
      },
      {
        value: 10 * 9 * 8 * 5,
        why: {
          it: "Hai fissato l'ultima cifra prima delle altre ma hai contato 10 scelte per la prima: una delle cifre dispari è già usata alla fine, quindi le restanti sono 9.",
          en: "You fixed the last digit first but counted 10 choices for the first: one odd digit is already used at the end, so only 9 remain.",
        },
      },
    ],
    detail: {
      it: "Conviene partire dalla posizione vincolata: l'ultima cifra ha 5 scelte (1, 3, 5, 7, 9); le altre si riempiono con le cifre rimaste: 9 · 8 · 7. Totale 9 · 8 · 7 · 5 = 2520.",
      en: "Start from the constrained position: the last digit has 5 choices (1, 3, 5, 7, 9); the others are filled with the remaining digits: 9 · 8 · 7. Total 9 · 8 · 7 · 5 = 2520.",
    },
  },
  {
    text: {
      it: "Quanti codici di 4 cifre tutte diverse iniziano con una cifra dispari e terminano con una cifra pari?",
      en: "How many 4-digit codes with all different digits start with an odd digit and end with an even digit?",
    },
    correct: 5 * 5 * 8 * 7, // 1400
    distractors: [
      {
        value: 10 * 9 * 8 * 7,
        why: {
          it: "Hai contato tutti i codici con cifre distinte, ignorando entrambi i vincoli di parità sulle estremità.",
          en: "You counted all codes with distinct digits, ignoring both parity constraints on the ends.",
        },
      },
      {
        value: 10 ** 4,
        why: {
          it: "Hai permesso di ripetere le cifre: «tutte diverse» richiede di escludere a ogni passo le cifre già usate.",
          en: "You allowed digits to repeat: “all different” requires excluding, at every step, the digits already used.",
        },
      },
      {
        value: 5 * 9 * 8 * 5, // 1800, choices made in the wrong order
        why: {
          it: "Hai scelto le posizioni nell'ordine di lettura: ma dopo le due cifre centrali le pari disponibili non sono sempre 5. Conviene fissare prima le due estremità (5 · 5) e poi riempire il centro (8 · 7).",
          en: "You filled the positions in reading order: but after the two middle digits the number of available evens is not always 5. Fix the two ends first (5 · 5), then fill the middle (8 · 7).",
        },
      },
    ],
    detail: {
      it: "Scegli prima le estremità: ultima cifra pari (5 scelte), prima cifra dispari (5 scelte, tutti i dispari sono ancora disponibili). Restano 8 cifre per la seconda e 7 per la terza: 5 · 5 · 8 · 7 = 1400.",
      en: "Choose the ends first: last digit even (5 choices), first digit odd (5 choices, all odds still available). Then 8 digits remain for the second position and 7 for the third: 5 · 5 · 8 · 7 = 1400.",
    },
  },
  {
    text: {
      it: "Quanti codici di 3 cifre tutte diverse iniziano con una cifra pari? (Lo 0 è pari e può comparire ovunque.)",
      en: "How many 3-digit codes with all different digits start with an even digit? (0 is even and may appear anywhere.)",
    },
    correct: 5 * 9 * 8, // 360
    distractors: [
      {
        value: 10 * 9 * 8,
        why: {
          it: "Hai contato tutti i codici di 3 cifre con cifre distinte, senza applicare il vincolo sulla prima cifra pari.",
          en: "You counted all 3-digit codes with distinct digits, without applying the first-digit-even constraint.",
        },
      },
      {
        value: 10 ** 3,
        why: {
          it: "Hai permesso di ripetere le cifre: «tutte diverse» richiede le disposizioni semplici, non quelle con ripetizione.",
          en: "You allowed digits to repeat: “all different” calls for simple dispositions, not dispositions with repetition.",
        },
      },
      {
        value: 4 * 9 * 8,
        why: {
          it: "Hai escluso lo zero dalle cifre pari: 0 è pari e, in un codice, può stare anche al primo posto.",
          en: "You left zero out of the even digits: 0 is even and, in a code, may well come first.",
        },
      },
    ],
    detail: {
      it: "La prima cifra ha 5 scelte (0, 2, 4, 6, 8); restano 9 e poi 8 cifre: 5 · 9 · 8 = 360.",
      en: "The first digit has 5 choices (0, 2, 4, 6, 8); then 9 and 8 digits remain: 5 · 9 · 8 = 360.",
    },
  },
];

function positionExercise(rng: import("../math-utils").Rng): GeneratedExercise {
  const v = rng.pick(positionVariants);
  return {
    archetype: "disposizioni-vincolo-posizione",
    difficulty: "intermediate",
    text: v.text,
    correct: `${v.correct}`,
    distractors: v.distractors.map((d) => `${d.value}`),
    diagnoses: v.distractors.map((d) => d.why),
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
