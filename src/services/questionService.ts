import type { Locale } from "@/types/i18n";
import { mathematicsTopics } from "@/data/mathematics-topics";
import type { MathematicsTopicId, PracticeSectionId } from "@/types/tolc";

type Localized = Record<Locale, string>;

export interface Question {
  id: string;
  sectionId: PracticeSectionId;
  text: Localized;
  options: Localized[];
  correctIndex: number;
  explanation: Localized;
  /**
   * Error diagnosis per option (same length as `options`, null where the
   * option is correct or has no known diagnosis). Optional: only generated
   * exercises of the thesis modules provide it.
   */
  rationales?: (Localized | null)[] | undefined;
  /** Combinatorics engine version that generated it; absent on older snapshots. */
  engineVersion?: number | undefined;
}

/** Mock data for the fac-simile. Swap for a real source later. */
const mockQuestions: Omit<Question, "sectionId">[] = [
  {
    id: "q1",
    text: {
      it: "Qual è il valore di x nell'equazione 2x + 6 = 14?",
      en: "What is the value of x in the equation 2x + 6 = 14?",
    },
    options: [
      { it: "x = 2", en: "x = 2" },
      { it: "x = 4", en: "x = 4" },
      { it: "x = 6", en: "x = 6" },
      { it: "x = 8", en: "x = 8" },
    ],
    correctIndex: 1,
    explanation: {
      it: "Sottrai 6 da entrambi i membri: 2x = 8. Poi dividi per 2: x = 4.",
      en: "Subtract 6 from both sides: 2x = 8. Then divide by 2: x = 4.",
    },
  },
  {
    id: "q2",
    text: {
      it: "Quanto vale la somma degli angoli interni di un triangolo?",
      en: "What is the sum of the interior angles of a triangle?",
    },
    options: [
      { it: "90°", en: "90°" },
      { it: "180°", en: "180°" },
      { it: "270°", en: "270°" },
      { it: "360°", en: "360°" },
    ],
    correctIndex: 1,
    explanation: {
      it: "In geometria euclidea la somma degli angoli interni di un triangolo è sempre 180°.",
      en: "In Euclidean geometry the interior angles of a triangle always add up to 180°.",
    },
  },
  {
    id: "q3",
    text: {
      it: "Se log₁₀(x) = 3, quanto vale x?",
      en: "If log₁₀(x) = 3, what is x?",
    },
    options: [
      { it: "30", en: "30" },
      { it: "300", en: "300" },
      { it: "1000", en: "1000" },
      { it: "3", en: "3" },
    ],
    correctIndex: 2,
    explanation: {
      it: "log₁₀(x) = 3 significa 10³ = x, quindi x = 1000. 30 e 300 confondono il logaritmo con una moltiplicazione.",
      en: "log₁₀(x) = 3 means 10³ = x, so x = 1000. 30 and 300 confuse the logarithm with multiplication.",
    },
  },
];

type QuestionSeed = Omit<Question, "id" | "sectionId">;

const q = (
  it: string,
  en: string,
  options: string[],
  correctIndex: number,
  explanationIt: string,
  explanationEn: string,
): QuestionSeed => ({
  text: { it, en },
  options: options.map((option) => ({ it: option, en: option })),
  correctIndex,
  explanation: { it: explanationIt, en: explanationEn },
});

const mathematicsQuestions: Record<MathematicsTopicId, QuestionSeed[]> = {
  "matematica-numeri": [
    q("Quanto vale il 15% di 200?", "What is 15% of 200?", ["15", "30", "35", "45"], 1, "Il 10% è 20 e il 5% è 10: in totale 30.", "10% is 20 and 5% is 10: the total is 30."),
    q("Qual è il massimo comune divisore di 18 e 24?", "What is the greatest common divisor of 18 and 24?", ["3", "6", "9", "12"], 1, "I divisori comuni sono 1, 2, 3 e 6; il maggiore è 6.", "The common divisors are 1, 2, 3 and 6; the greatest is 6."),
    q("Quanto vale 2⁻³?", "What is 2⁻³?", ["−8", "−6", "1/6", "1/8"], 3, "Un esponente negativo indica il reciproco: 2⁻³ = 1/2³ = 1/8.", "A negative exponent means the reciprocal: 2⁻³ = 1/2³ = 1/8."),
  ],
  "matematica-algebra": [
    q("Qual è il valore di x nell'equazione 2x + 6 = 14?", "What is the value of x in 2x + 6 = 14?", ["2", "4", "6", "8"], 1, "Sottrai 6 e dividi per 2: x = 4.", "Subtract 6 and divide by 2: x = 4."),
    q("Quale espressione equivale a (a + b)²?", "Which expression equals (a + b)²?", ["a²+b²", "a²+2ab+b²", "2a²+2b²", "a²−2ab+b²"], 1, "Il quadrato di un binomio è a² + 2ab + b².", "The square of a binomial is a² + 2ab + b²."),
    q("Quali sono le soluzioni di x² − 9 = 0?", "What are the solutions of x² − 9 = 0?", ["3", "−3", "±3", "9"], 2, "x² = 9, quindi x può essere 3 oppure −3.", "x² = 9, so x can be 3 or −3."),
  ],
  "matematica-geometria": [
    q("Quanto vale la somma degli angoli interni di un triangolo?", "What is the sum of a triangle's interior angles?", ["90°", "180°", "270°", "360°"], 1, "In geometria euclidea la somma è 180°.", "In Euclidean geometry the sum is 180°."),
    q("Un triangolo rettangolo ha cateti 3 e 4. Quanto misura l'ipotenusa?", "A right triangle has legs 3 and 4. What is its hypotenuse?", ["5", "6", "7", "8"], 0, "Per Pitagora: √(3² + 4²) = √25 = 5.", "By Pythagoras: √(3² + 4²) = √25 = 5."),
    q("Qual è l'area di un cerchio di raggio 2?", "What is the area of a circle with radius 2?", ["2π", "4π", "6π", "8π"], 1, "L'area è πr² = π·2² = 4π.", "The area is πr² = π·2² = 4π."),
  ],
  "matematica-funzioni-grafici": [
    q("Se f(x)=2x+1, quanto vale f(3)?", "If f(x)=2x+1, what is f(3)?", ["5", "6", "7", "8"], 2, "Sostituendo x=3 si ottiene 2·3+1=7.", "Substituting x=3 gives 2·3+1=7."),
    q("Se log₁₀(x)=3, quanto vale x?", "If log₁₀(x)=3, what is x?", ["30", "300", "1000", "3"], 2, "Per definizione di logaritmo, x=10³=1000.", "By the definition of logarithm, x=10³=1000."),
    q("Quale funzione è crescente su tutti i numeri reali?", "Which function is increasing over all real numbers?", ["f(x)=−x", "f(x)=x", "f(x)=−x²", "f(x)=0"], 1, "La funzione f(x)=x cresce al crescere di x.", "The function f(x)=x increases as x increases."),
  ],
  "matematica-combinatoria-probabilita": [
    q("Lanciando una moneta equa, qual è la probabilità di testa?", "When tossing a fair coin, what is the probability of heads?", ["0", "1/4", "1/2", "1"], 2, "Uno dei due esiti equiprobabili è testa: 1/2.", "One of the two equally likely outcomes is heads: 1/2."),
    q("Quanti esiti possibili ci sono lanciando due monete?", "How many outcomes are possible when tossing two coins?", ["2", "3", "4", "8"], 2, "Gli esiti sono TT, TC, CT e CC: quattro.", "The outcomes are HH, HT, TH and TT: four."),
    q("Da un dado equo, qual è la probabilità di ottenere un numero pari?", "For a fair die, what is the probability of rolling an even number?", ["1/6", "1/3", "1/2", "2/3"], 2, "Tre esiti su sei sono pari: 2, 4 e 6. Quindi 3/6=1/2.", "Three of six outcomes are even: 2, 4 and 6. Thus 3/6=1/2."),
  ],
  "matematica-medie-variabilita": [
    q("Qual è la media di 2, 4 e 6?", "What is the mean of 2, 4 and 6?", ["3", "4", "5", "6"], 1, "(2+4+6)/3 = 4.", "(2+4+6)/3 = 4."),
    q("Qual è la mediana di 1, 3, 8, 10, 12?", "What is the median of 1, 3, 8, 10, 12?", ["3", "6", "8", "10"], 2, "Il valore centrale della sequenza ordinata è 8.", "The middle value of the ordered sequence is 8."),
    q("In 20 osservazioni, un valore compare 5 volte. Qual è la frequenza relativa?", "In 20 observations, a value occurs 5 times. What is its relative frequency?", ["5%", "20%", "25%", "40%"], 2, "5/20 = 0,25, cioè 25%.", "5/20 = 0.25, or 25%."),
  ],
  "matematica-comprendere-rappresentare": [
    q("Quale simbolo indica che 3 appartiene all'insieme A?", "Which notation says that 3 belongs to set A?", ["3 ∈ A", "3 ⊂ A", "A ∈ 3", "3 ∪ A"], 0, "Il simbolo ∈ indica l'appartenenza di un elemento a un insieme.", "The symbol ∈ indicates that an element belongs to a set."),
    q("Se A={1,2} e B={2,3}, quanto vale A∩B?", "If A={1,2} and B={2,3}, what is A∩B?", ["{1,2,3}", "{1}", "{2}", "∅"], 2, "L'intersezione contiene gli elementi comuni: solo 2.", "The intersection contains common elements: only 2."),
    q("La frase 'almeno uno' indica quale quantità minima?", "What minimum quantity does 'at least one' indicate?", ["0", "1", "2", "Tutti"], 1, "Almeno uno significa uno o più.", "At least one means one or more."),
  ],
  "matematica-ragionare": [
    q("Se tutti gli A sono B e x è A, cosa segue?", "If all A are B and x is A, what follows?", ["x non è B", "x è B", "B è A", "Nulla"], 1, "Applicando l'implicazione, x appartiene anche a B.", "Applying the implication, x also belongs to B."),
    q("Qual è la negazione di 'tutti gli studenti sono presenti'?", "What is the negation of 'all students are present'?", ["Nessuno è presente", "Almeno uno non è presente", "Uno è presente", "Tutti sono assenti"], 1, "Per negare 'tutti', basta che esista almeno un controesempio.", "To negate 'all', at least one counterexample must exist."),
    q("Se P implica Q e Q è falsa, cosa si può concludere?", "If P implies Q and Q is false, what follows?", ["P è vera", "P è falsa", "Q è vera", "Nulla"], 1, "È il modus tollens: se Q è falsa, P non può essere vera.", "This is modus tollens: if Q is false, P cannot be true."),
  ],
  "matematica-modellizzare-risolvere": [
    q("Tre quaderni costano 12 €. Quanto costano cinque allo stesso prezzo unitario?", "Three notebooks cost €12. How much do five cost at the same unit price?", ["15 €", "18 €", "20 €", "24 €"], 2, "Ogni quaderno costa 4 €; cinque costano 20 €.", "Each notebook costs €4; five cost €20."),
    q("Un serbatoio da 100 L è pieno al 70%. Quanti litri contiene?", "A 100 L tank is 70% full. How many litres does it contain?", ["30", "60", "70", "170"], 2, "Il 70% di 100 L è 70 L.", "70% of 100 L is 70 L."),
    q("Un'auto percorre 120 km in 2 ore a velocità costante. Qual è la velocità?", "A car travels 120 km in 2 hours at constant speed. What is its speed?", ["40 km/h", "60 km/h", "90 km/h", "240 km/h"], 1, "Velocità = spazio/tempo = 120/2 = 60 km/h.", "Speed = distance/time = 120/2 = 60 km/h."),
  ],
};

function interleaveMathematicsTopics(): Question[] {
  const topicQuestions = mathematicsTopics.map((topic) => questionService.getBySection(topic.id));
  const maxLength = Math.max(...topicQuestions.map((questions) => questions.length));
  const interleaved: Question[] = [];
  for (let index = 0; index < maxLength; index += 1) {
    for (const questions of topicQuestions) {
      const question = questions[index];
      if (question) interleaved.push(question);
    }
  }
  return interleaved;
}

export const questionService = {
  getBySection(sectionId: PracticeSectionId): Question[] {
    if (sectionId === "matematica") {
      return interleaveMathematicsTopics();
    }
    if (sectionId in mathematicsQuestions) {
      return mathematicsQuestions[sectionId as MathematicsTopicId].map((question, index) => ({
        ...question,
        id: `${sectionId}-q${index + 1}`,
        sectionId,
      }));
    }
    return mockQuestions.map((q) => ({ ...q, id: `${sectionId}-${q.id}`, sectionId }));
  },
  async listBySection(sectionId: PracticeSectionId): Promise<Question[]> {
    return questionService.getBySection(sectionId);
  },
};
