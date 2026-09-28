import type { Locale } from "@/types/i18n";
import type { TolcSectionId } from "@/types/tolc";

type Localized = Record<Locale, string>;

export interface Question {
  id: string;
  sectionId: TolcSectionId;
  text: Localized;
  options: Localized[];
  correctIndex: number;
  explanation: Localized;
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

export const questionService = {
  getBySection(sectionId: TolcSectionId): Question[] {
    return mockQuestions.map((q) => ({ ...q, id: `${sectionId}-${q.id}`, sectionId }));
  },
  async listBySection(sectionId: TolcSectionId): Promise<Question[]> {
    return questionService.getBySection(sectionId);
  },
};
