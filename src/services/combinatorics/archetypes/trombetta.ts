/**
 * Four archetypes modelled on Maurizio Trombetta, "Calcolo combinatorio —
 * Teoria e problemi": distributions of identical objects (stars and bars,
 * Example 6.1), circular permutations (Example 6.2 and Solution 6.1),
 * Newton's binomial (§2.5–2.6) and inclusion–exclusion (Chapter 5).
 *
 * Every distractor models one documented cognitive mistake and carries its
 * own diagnosis, so the feedback panel can name the error the student made.
 */

import { combinations, factorial } from "../math-utils";
import type { Archetype, DistractorCandidate, GeneratedExercise } from "../types";
import type { Rng } from "../math-utils";
import { cand } from "./candidate";

/* ============= 1. Distributing identical objects (stars and bars) ============= */

interface StarsContext {
  it: { object: string; objects: string; holder: string; holders: string; verb: string };
  en: { object: string; objects: string; holder: string; holders: string; verb: string };
}

const starsContexts: StarsContext[] = [
  {
    it: { object: "caramella", objects: "caramelle identiche", holder: "bambino", holders: "bambini", verb: "distribuire" },
    en: { object: "sweet", objects: "identical sweets", holder: "child", holders: "children", verb: "hand out" },
  },
  {
    it: { object: "pallina", objects: "palline identiche", holder: "scatola", holders: "scatole distinte", verb: "sistemare" },
    en: { object: "ball", objects: "identical balls", holder: "box", holders: "distinct boxes", verb: "place" },
  },
  {
    it: { object: "euro", objects: "monete da un euro identiche", holder: "salvadanaio", holders: "salvadanai distinti", verb: "ripartire" },
    en: { object: "coin", objects: "identical one-euro coins", holder: "piggy bank", holders: "distinct piggy banks", verb: "split" },
  },
];

function starsAndBarsExercise(rng: Rng): GeneratedExercise {
  const n = rng.int(3, 4); // holders
  const minEach = rng.pick([0, 0, 1, 2]); // Trombetta discusses both variants
  const k = rng.int(n * Math.max(minEach, 1) + 2, 10); // objects
  const free = k - n * minEach;
  const ctx = rng.pick(starsContexts);

  const correct = combinations(free + n - 1, n - 1);
  const constraintIt =
    minEach === 0
      ? "senza alcun vincolo (qualcuno può restare a bocca asciutta)"
      : `con il vincolo che ciascun${ctx.it.holder === "bambino" ? "o" : "a"} ne riceva almeno ${minEach}`;
  const constraintEn =
    minEach === 0
      ? "with no constraint (someone may get none at all)"
      : `with the constraint that each ${ctx.en.holder} gets at least ${minEach}`;

  return {
    archetype: "distribuzione-oggetti-stelle-barre",
    difficulty: "advanced",
    kind: "count",
    params: { k, n, minEach },
    text: {
      it: `In quanti modi distinti si possono ${ctx.it.verb} ${k} ${ctx.it.objects} fra ${n} ${ctx.it.holders}, ${constraintIt}?`,
      en: `In how many distinct ways can you ${ctx.en.verb} ${k} ${ctx.en.objects} among ${n} ${ctx.en.holders}, ${constraintEn}?`,
    },
    correct: `${correct}`,
    candidates: [
      cand("objects-distinguished", "labelled-groups", n ** k,
        `Hai trattato ${ctx.it.objects} come distinguibili: ${n}^${k} conta le assegnazioni di oggetti diversi. Qui gli oggetti sono identici, quindi conta solo quanti ne riceve ciascun${ctx.it.holder === "bambino" ? "o" : "a"}.`,
        `You treated the ${ctx.en.objects} as distinguishable: ${n}^${k} counts assignments of different objects. Here the objects are identical, so only how many each ${ctx.en.holder} receives matters.`),
      cand("simple-combinations", "repetition", combinations(k, n - 1),
        `Hai usato le combinazioni semplici C(${k}, ${n - 1}): qui le ripetizioni sono ammesse (uno stesso destinatario può ricevere più oggetti), quindi serve la formula delle combinazioni con ripetizione C(k + n − 1, n − 1).`,
        `You used simple combinations C(${k}, ${n - 1}): repetitions are allowed here (one recipient may receive several objects), so you need combinations with repetition, C(k + n − 1, n − 1).`),
      ...(minEach > 0
        ? [
            cand("minimum-ignored", "constraint-ignored", combinations(k + n - 1, n - 1),
              `Hai dimenticato la pre-assegnazione: prima si consegnano ${minEach} ${ctx.it.objects} a testa (${n * minEach} in tutto) e solo le ${free} restanti si distribuiscono liberamente.`,
              `You forgot the pre-assignment: first give ${minEach} to each (${n * minEach} in total) and only the remaining ${free} are distributed freely.`),
            cand("minimum-applied-once", "constraint-applied-once", combinations(k - minEach + n - 1, n - 1),
              `Hai tolto il minimo una sola volta (${k} − ${minEach}): la quota di ${minEach} va consegnata a ciascuno degli ${n} destinatari, quindi si tolgono ${n * minEach} oggetti.`,
              `You removed the minimum only once (${k} − ${minEach}): the quota of ${minEach} goes to each of the ${n} recipients, so ${n * minEach} objects are removed.`),
          ]
        : [
            cand("minimum-one-imposed", "other", combinations(k - 1, n - 1),
              `Hai imposto che ciascun${ctx.it.holder === "bambino" ? "o" : "a"} riceva almeno un oggetto, C(${k} − 1, ${n} − 1): il testo non pone alcun minimo, quindi qualcuno può non ricevere nulla.`,
              `You required each ${ctx.en.holder} to get at least one object, C(${k} − 1, ${n} − 1): the text sets no minimum, so someone may receive nothing.`),
          ]),
      cand("wrong-lower-index", "other", combinations(free + n - 1, n),
        `Hai scelto ${n} posizioni invece di ${n - 1}: per separare ${n} destinatari bastano ${n - 1} barre, quindi C(${free + n - 1}, ${n - 1}).`,
        `You chose ${n} positions instead of ${n - 1}: separating ${n} recipients takes only ${n - 1} bars, hence C(${free + n - 1}, ${n - 1}).`),
    ],
    explanation: {
      it:
        minEach === 0
          ? `Oggetti identici e destinatari distinti: è il modello «stelle e barre». Disponiamo ${k} stelle e ${n - 1} barre separatrici, e scegliamo dove mettere le barre: C(${k} + ${n} − 1, ${n} − 1) = C(${k + n - 1}, ${n - 1}) = ${correct}.`
          : `Prima soddisfiamo il vincolo: ${minEach} a testa consuma ${n * minEach} oggetti, e ne restano ${free}. Su questi si applica il modello «stelle e barre»: C(${free} + ${n} − 1, ${n} − 1) = C(${free + n - 1}, ${n - 1}) = ${correct}.`,
      en:
        minEach === 0
          ? `Identical objects and distinct recipients: this is the "stars and bars" model. Lay out ${k} stars and ${n - 1} separating bars and choose where the bars go: C(${k} + ${n} − 1, ${n} − 1) = C(${k + n - 1}, ${n - 1}) = ${correct}.`
          : `First satisfy the constraint: ${minEach} each uses up ${n * minEach} objects, leaving ${free}. On those apply "stars and bars": C(${free} + ${n} − 1, ${n} − 1) = C(${free + n - 1}, ${n - 1}) = ${correct}.`,
    },
  };
}

/* ============= 2. Circular permutations ============= */

const circularContexts: { it: string; en: string; round: boolean }[] = [
  { it: "attorno a un tavolo rotondo", en: "around a round table", round: true },
  { it: "attorno a un falò circolare", en: "around a circular campfire", round: true },
  { it: "su una giostra a posti equidistanti", en: "on a carousel with evenly spaced seats", round: true },
];

function circularExercise(rng: Rng): GeneratedExercise {
  const variant = rng.pick(["plain", "separated", "mirror"] as const);
  // the "two people not adjacent" count only makes sense with at least 6 people
  const n = variant === "separated" ? rng.int(6, 8) : rng.int(5, 8);
  const ctx = rng.pick(circularContexts);

  if (variant === "plain") {
    const correct = factorial(n - 1);
    return {
      archetype: "permutazioni-cicliche",
      difficulty: "intermediate",
      kind: "count",
      params: { variant, n },
      text: {
        it: `In quanti modi distinti si possono far sedere ${n} persone ${ctx.it}, se due sistemazioni che differiscono solo per una rotazione si considerano uguali?`,
        en: `In how many distinct ways can ${n} people be seated ${ctx.en}, if two arrangements differing only by a rotation count as the same?`,
      },
      correct: `${correct}`,
      candidates: [
        cand("linear-arrangement", "circular-as-linear", factorial(n),
          `Hai contato come se fosse una fila: ${n}! conta anche le ${n} rotazioni di una stessa disposizione circolare, che il testo dichiara indistinguibili.`,
          `You counted as if it were a line: ${n}! also counts the ${n} rotations of the same circular arrangement, which the text declares indistinguishable.`),
        cand("mirror-removed", "other", factorial(n - 1) / 2,
          "Hai diviso anche per le simmetrie speculari: il testo identifica solo le rotazioni, non le riflessioni (orario e antiorario restano diversi).",
          "You also divided by mirror symmetries: the text identifies rotations only, not reflections (clockwise and anticlockwise stay different)."),
        cand("two-fixed", "other", factorial(n - 2),
          "Hai fissato due persone come riferimento invece di una sola: per eliminare le rotazioni basta bloccare un unico posto.",
          "You fixed two people as reference instead of one: removing rotations requires blocking a single seat only."),
        cand("linear-halved", "circular-as-linear", factorial(n) / 2,
          `Hai diviso ${n}! per 2 invece che per ${n}: le rotazioni di una disposizione circolare sono ${n}, non 2.`,
          `You divided ${n}! by 2 instead of ${n}: a circular arrangement has ${n} rotations, not 2.`),
      ],
      explanation: {
        it: `Fissiamo una persona come riferimento per eliminare le rotazioni: le altre ${n - 1} si dispongono liberamente, quindi (${n} − 1)! = ${correct}. Equivalentemente ${n}!/${n}.`,
        en: `Fix one person as reference to remove rotations: the other ${n - 1} are arranged freely, so (${n} − 1)! = ${correct}. Equivalently ${n}!/${n}.`,
      },
    };
  }

  if (variant === "mirror") {
    const correct = factorial(n - 1) / 2;
    return {
      archetype: "permutazioni-cicliche",
      difficulty: "advanced",
      kind: "count",
      params: { variant, n },
      text: {
        it: `Si infilano ${n} perline di colori diversi su un braccialetto chiuso ad anello. Quante collane distinte si ottengono, se due sistemazioni che differiscono per una rotazione o per un ribaltamento si considerano uguali?`,
        en: `You thread ${n} beads of different colours onto a closed bracelet. How many distinct bracelets are obtained, if two arrangements differing by a rotation or by a flip count as the same?`,
      },
      correct: `${correct}`,
      candidates: [
        cand("flip-ignored", "other", factorial(n - 1),
          "Hai eliminato solo le rotazioni: su un braccialetto si può anche ribaltare, quindi ogni collana viene contata due volte e serve dividere per 2.",
          "You removed rotations only: a bracelet can also be flipped over, so each one is counted twice and you must divide by 2."),
        cand("linear-arrangement", "circular-as-linear", factorial(n),
          `Hai contato come una fila: ${n}! ignora sia le ${n} rotazioni sia il ribaltamento.`,
          `You counted as a line: ${n}! ignores both the ${n} rotations and the flip.`),
        cand("flip-only", "circular-as-linear", factorial(n) / 2,
          "Hai diviso solo per il ribaltamento: restano da eliminare anche le rotazioni, fissando una perlina come riferimento.",
          "You divided by the flip only: the rotations still have to be removed by fixing one bead as reference."),
        cand("two-fixed", "other", factorial(n - 2),
          "Hai fissato due perline come riferimento: per eliminare le rotazioni basta una perlina, e il ribaltamento si elimina dividendo per 2.",
          "You fixed two beads as reference: one bead suffices to remove rotations, and the flip is removed by dividing by 2."),
      ],
      explanation: {
        it: `Fissata una perlina si eliminano le rotazioni: (${n} − 1)! = ${factorial(n - 1)}. Poiché il braccialetto si può ribaltare, ogni collana compare due volte: ${factorial(n - 1)}/2 = ${correct}.`,
        en: `Fixing one bead removes the rotations: (${n} − 1)! = ${factorial(n - 1)}. Since the bracelet can be flipped, each one appears twice: ${factorial(n - 1)}/2 = ${correct}.`,
      },
    };
  }

  // two special people must not sit next to each other
  const correct = (n - 3) * factorial(n - 2);
  return {
    archetype: "permutazioni-cicliche",
    difficulty: "advanced",
    kind: "count",
    params: { variant, n },
    text: {
      it: `In quanti modi distinti si possono far sedere ${n} persone ${ctx.it}, se due di loro non devono sedersi vicine e le sistemazioni che differiscono per una rotazione si considerano uguali?`,
      en: `In how many distinct ways can ${n} people be seated ${ctx.en}, if two of them must not sit next to each other and arrangements differing by a rotation count as the same?`,
    },
    correct: `${correct}`,
    candidates: [
      cand("constraint-ignored", "constraint-ignored", factorial(n - 1),
        "Hai contato tutte le sistemazioni circolari senza applicare il vincolo: vanno escluse quelle in cui le due persone sono adiacenti.",
        "You counted every circular arrangement without applying the constraint: the ones where the two people are adjacent must be excluded."),
      cand("excluded-cases", "complement-ignored", 2 * factorial(n - 2),
        "Hai contato proprio i casi da escludere, cioè quelli con le due persone vicine: il risultato cercato è il complementare.",
        "You counted exactly the cases to exclude, the ones with the two people adjacent: the answer is the complement."),
      cand("one-neighbour-excluded", "constraint-applied-once", (n - 2) * factorial(n - 2),
        `Hai contato ${n - 2} posti liberi per la seconda persona: dopo aver fissato la prima, i posti da evitare sono i due adiacenti, quindi ne restano ${n - 3}.`,
        `You allowed ${n - 2} free seats for the second person: after fixing the first, the two adjacent seats are forbidden, so ${n - 3} remain.`),
      cand("linear-non-adjacent", "circular-as-linear", factorial(n) - 2 * factorial(n - 1),
        `Hai contato le file non circolari con le due persone separate (${n}! − 2 · ${n - 1}!): al tavolo rotondo le rotazioni coincidono e anche il primo e l'ultimo posto sono vicini.`,
        `You counted straight lines with the two people apart (${n}! − 2 · ${n - 1}!): at a round table rotations coincide and the first and last seats are adjacent too.`),
    ],
    explanation: {
      it: `Fissiamo la prima persona speciale per eliminare le rotazioni. La seconda non può occupare i due posti adiacenti, quindi ha ${n} − 3 = ${n - 3} scelte; le altre ${n - 2} persone si dispongono in (${n} − 2)! modi. Totale: ${n - 3} · ${factorial(n - 2)} = ${correct}.`,
      en: `Fix the first special person to remove rotations. The second cannot take either adjacent seat, so it has ${n} − 3 = ${n - 3} choices; the other ${n - 2} people are arranged in (${n} − 2)! ways. Total: ${n - 3} · ${factorial(n - 2)} = ${correct}.`,
    },
  };
}

/* ============= 3. Newton's binomial ============= */

function binomialExercise(rng: Rng): GeneratedExercise {
  const n = rng.int(4, 7);
  const k = rng.int(1, n - 1);
  const a = rng.pick([1, 2, 3]);
  const b = rng.pick([1, 2, 3]);
  const bin = combinations(n, k);

  const correct = bin * a ** k * b ** (n - k);

  const aPart = a === 1 ? "x" : `${a}x`;
  const bPart = `+ ${b}`;
  const expr = `(${aPart} ${bPart})^${n}`;

  // candidate mistakes, each with its own diagnosis; colliding or
  // coincidentally-correct values are skipped in order
  const raw: { id: string; type: DistractorCandidate["type"]; value: number; why: { it: string; en: string } }[] = [
    {
      id: "coefficient-only",
      type: "other",
      value: bin,
      why: {
        it: `Hai preso solo il coefficiente binomiale C(${n},${k}) = ${bin}: va moltiplicato anche per le potenze delle basi, ${a}^${k} e ${b}^${n - k}.`,
        en: `You took only the binomial coefficient C(${n},${k}) = ${bin}: it must also be multiplied by the powers of the bases, ${a}^${k} and ${b}^${n - k}.`,
      },
    },
    {
      id: "exponents-swapped",
      type: "other",
      value: bin * a ** (n - k) * b ** k,
      why: {
        it: `Hai scambiato gli esponenti: nel termine in x^${k} la potenza ${k} spetta al primo addendo e la potenza ${n - k} al secondo, non il contrario.`,
        en: `You swapped the exponents: in the x^${k} term the power ${k} belongs to the first addend and ${n - k} to the second, not the other way round.`,
      },
    },
    {
      id: "dispositions-used",
      type: "order-irrelevant",
      value: (factorial(n) / factorial(n - k)) * a ** k * b ** (n - k),
      why: {
        it: `Hai usato le disposizioni ${n}!/(${n}−${k})! al posto del coefficiente binomiale: nel binomio di Newton serve C(${n},${k}) = ${bin}, che divide anche per ${k}!.`,
        en: `You used dispositions ${n}!/(${n}−${k})! instead of the binomial coefficient: Newton's binomial needs C(${n},${k}) = ${bin}, which also divides by ${k}!.`,
      },
    },
    {
      id: "exponent-plus-one",
      type: "other",
      value: combinations(n, k + 1) * a ** (k + 1) * b ** (n - k - 1),
      why: {
        it: `Hai letto l'esponente della variabile sbagliato: il termine richiesto ha x^${k}, non x^${k + 1}.`,
        en: `You read the wrong exponent of the variable: the requested term has x^${k}, not x^${k + 1}.`,
      },
    },
    {
      id: "exponent-minus-one",
      type: "other",
      value: combinations(n, k - 1) * a ** (k - 1) * b ** (n - k + 1),
      why: {
        it: `Hai letto l'esponente della variabile sbagliato: il termine richiesto ha x^${k}, non x^${k - 1}.`,
        en: `You read the wrong exponent of the variable: the requested term has x^${k}, not x^${k - 1}.`,
      },
    },
    {
      id: "second-base-forgotten",
      type: "other",
      value: bin * a ** k,
      why: {
        it: `Hai dimenticato la potenza della seconda base: manca il fattore ${b}^${n - k} = ${b ** (n - k)}.`,
        en: `You forgot the power of the second base: the factor ${b}^${n - k} = ${b ** (n - k)} is missing.`,
      },
    },
    {
      id: "first-base-forgotten",
      type: "other",
      value: bin * b ** (n - k),
      why: {
        it: `Hai dimenticato la potenza della prima base: manca il fattore ${a}^${k} = ${a ** k}.`,
        en: `You forgot the power of the first base: the factor ${a}^${k} = ${a ** k} is missing.`,
      },
    },
    {
      id: "sum-of-coefficients",
      type: "other",
      value: 2 ** n,
      why: {
        it: `Hai confuso il coefficiente del singolo termine con la somma di tutti i coefficienti dello sviluppo, che è 2^${n}.`,
        en: `You confused the coefficient of the single term with the sum of all the expansion's coefficients, which is 2^${n}.`,
      },
    },
    {
      id: "wrong-degree",
      type: "other",
      value: combinations(n + 1, k) * a ** k * b ** (n - k),
      why: {
        it: `Hai letto la potenza sbagliata del binomio: il coefficiente C(${n + 1},${k}) appartiene allo sviluppo di grado ${n + 1}, non ${n}.`,
        en: `You read the wrong power of the binomial: coefficient C(${n + 1},${k}) belongs to the expansion of degree ${n + 1}, not ${n}.`,
      },
    },
  ];

  const candidates = raw.map((c) => cand(c.id, c.type, c.value, c.why.it, c.why.en));

  return {
    archetype: "binomio-newton",
    difficulty: "advanced",
    kind: "count",
    params: { n, k, a, b },
    text: {
      it: `Nello sviluppo di ${expr} secondo la formula del binomio di Newton, quale è il coefficiente numerico del termine in x^${k}?`,
      en: `In the expansion of ${expr} by Newton's binomial formula, what is the numerical coefficient of the x^${k} term?`,
    },
    correct: `${correct}`,
    candidates,
    explanation: {
      it: `La formula del binomio dà il termine generale C(${n},k)·(${aPart})^k·(${b})^(${n}−k). Per k = ${k}: C(${n},${k}) = ${bin}, ${a}^${k} = ${a ** k} e ${b}^${n - k} = ${b ** (n - k)}. Coefficiente = ${bin} · ${a ** k} · ${b ** (n - k)} = ${correct}.`,
      en: `The binomial formula gives the general term C(${n},k)·(${aPart})^k·(${b})^(${n}−k). For k = ${k}: C(${n},${k}) = ${bin}, ${a}^${k} = ${a ** k} and ${b}^${n - k} = ${b ** (n - k)}. Coefficient = ${bin} · ${a ** k} · ${b ** (n - k)} = ${correct}.`,
    },
  };
}

/* ============= 4. Inclusion–exclusion ============= */

function inclusionExclusionExercise(rng: Rng): GeneratedExercise {
  const three = rng.pick([true, false]);

  if (!three) {
    const total = rng.pick([100, 120, 150, 200]);
    // a+b must stay below the total and `both` below the leftovers, otherwise
    // the "school total" distractor coincides with the correct answer
    let a = 0;
    let b = 0;
    let both = 0;
    do {
      a = rng.int(40, Math.floor((total - 10) / 2));
      b = rng.int(30, total - a - 10);
      both = rng.int(10, Math.min(a, b) - 5);
    } while (both >= total - a - b);
    const correct = a + b - both;
    return {
      archetype: "inclusione-esclusione",
      difficulty: "intermediate",
      kind: "count",
      params: { sets: 2, total, a, b, both },
      text: {
        it: `In una scuola di ${total} studenti, ${a} praticano il nuoto e ${b} praticano l'atletica; ${both} praticano entrambe le discipline. Quanti studenti praticano almeno una delle due discipline?`,
        en: `In a school of ${total} students, ${a} do swimming and ${b} do athletics; ${both} do both. How many students do at least one of the two?`,
      },
      correct: `${correct}`,
      candidates: [
        cand("intersection-not-removed", "additive-union", a + b,
          `Hai sommato i due gruppi senza togliere l'intersezione: i ${both} studenti che praticano entrambe le discipline vengono così contati due volte.`,
          `You added the two groups without removing the intersection: the ${both} students doing both get counted twice.`),
        cand("intersection-removed-twice", "inclusion-exclusion-truncated", a + b - 2 * both,
          `Hai sottratto l'intersezione due volte: chi pratica entrambe le discipline va contato una volta, quindi si toglie ${both} una sola volta.`,
          `You subtracted the intersection twice: those doing both must be counted once, so ${both} is removed only once.`),
        cand("school-total", "other", total - both,
          "Hai lavorato sul totale della scuola: la domanda riguarda solo chi pratica almeno una disciplina, non chi resta escluso.",
          "You worked from the school total: the question is only about those doing at least one sport, not about who is left out."),
        cand("neither", "complement-ignored", total - (a + b - both),
          "Hai contato chi non pratica nessuna delle due discipline: è il complementare dell'insieme richiesto.",
          "You counted those doing neither sport: that is the complement of the requested set."),
      ],
      explanation: {
        it: `Principio di inclusione-esclusione per due insiemi: |A ∪ B| = |A| + |B| − |A ∩ B| = ${a} + ${b} − ${both} = ${correct}.`,
        en: `Inclusion–exclusion for two sets: |A ∪ B| = |A| + |B| − |A ∩ B| = ${a} + ${b} − ${both} = ${correct}.`,
      },
    };
  }

  const n = rng.pick([60, 90, 120, 180]);
  const [p, q, r] = [2, 3, 5];
  const cA = Math.floor(n / p);
  const cB = Math.floor(n / q);
  const cC = Math.floor(n / r);
  const cAB = Math.floor(n / (p * q));
  const cAC = Math.floor(n / (p * r));
  const cBC = Math.floor(n / (q * r));
  const cABC = Math.floor(n / (p * q * r));
  const correct = cA + cB + cC - cAB - cAC - cBC + cABC;

  return {
    archetype: "inclusione-esclusione",
    difficulty: "advanced",
    kind: "count",
    params: { sets: 3, n },
    text: {
      it: `Quanti interi da 1 a ${n} sono divisibili per ${p}, per ${q} oppure per ${r}?`,
      en: `How many integers from 1 to ${n} are divisible by ${p}, by ${q} or by ${r}?`,
    },
    correct: `${correct}`,
    candidates: [
      cand("overlaps-not-removed", "additive-union", cA + cB + cC,
        "Hai sommato i tre insiemi senza togliere le sovrapposizioni: i multipli comuni (per esempio quelli divisibili sia per 2 sia per 3) verrebbero contati più volte.",
        "You added the three sets without removing the overlaps: common multiples (for instance those divisible by both 2 and 3) would be counted several times."),
      cand("triple-not-added-back", "inclusion-exclusion-truncated", cA + cB + cC - cAB - cAC - cBC,
        `Hai sottratto le intersezioni a due a due ma non hai ri-aggiunto l'intersezione tripla: i ${cABC} numeri divisibili per ${p}·${q}·${r} sono stati tolti una volta di troppo.`,
        `You subtracted the pairwise intersections but did not add the triple intersection back: the ${cABC} numbers divisible by ${p}·${q}·${r} were removed once too many.`),
      cand("triple-subtracted", "inclusion-exclusion-truncated", cA + cB + cC - cAB - cAC - cBC - cABC,
        "Hai sottratto l'intersezione tripla invece di sommarla: nel principio di inclusione-esclusione i termini si alternano di segno, quindi il termine triplo va sommato.",
        "You subtracted the triple intersection instead of adding it: the signs in inclusion–exclusion alternate, so the triple term is added."),
      cand("none-divisible", "complement-ignored", n - correct,
        `Hai contato gli interi non divisibili per nessuno dei tre numeri: è il complementare dell'insieme richiesto.`,
        `You counted the integers divisible by none of the three numbers: that is the complement of the requested set.`),
    ],
    explanation: {
      it: `Contiamo i multipli: ${cA} di ${p}, ${cB} di ${q}, ${cC} di ${r}. Togliamo le coppie: ${cAB} di ${p * q}, ${cAC} di ${p * r}, ${cBC} di ${q * r}. Ri-aggiungiamo la tripla: ${cABC} di ${p * q * r}. Totale ${cA} + ${cB} + ${cC} − ${cAB} − ${cAC} − ${cBC} + ${cABC} = ${correct}.`,
      en: `Count the multiples: ${cA} of ${p}, ${cB} of ${q}, ${cC} of ${r}. Remove the pairs: ${cAB} of ${p * q}, ${cAC} of ${p * r}, ${cBC} of ${q * r}. Add the triple back: ${cABC} of ${p * q * r}. Total ${cA} + ${cB} + ${cC} − ${cAB} − ${cAC} − ${cBC} + ${cABC} = ${correct}.`,
    },
  };
}

export const trombettaArchetypes: Archetype[] = [
  {
    id: "distribuzione-oggetti-stelle-barre",
    difficulty: "advanced",
    generate: starsAndBarsExercise,
  },
  {
    id: "permutazioni-cicliche",
    difficulty: "intermediate",
    generate: circularExercise,
  },
  {
    id: "binomio-newton",
    difficulty: "advanced",
    generate: binomialExercise,
  },
  {
    id: "inclusione-esclusione",
    difficulty: "intermediate",
    generate: inclusionExclusionExercise,
  },
];
