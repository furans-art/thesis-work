/**
 * Maps questions from the TestLogica Logic API into the app's Question shape.
 * Client-safe: imported by the server-function module and by components.
 */

import { formatAssignment, formatFormula } from "@/lib/logic-formula";
import type { LogicQuestion } from "@/services/logicApi.server";
import type { Question } from "@/services/questionService";
import type { Locale } from "@/types/i18n";

const CONSTRUCTION_SEP = " \u21d2 "; // ⇒

export function logicQuestionToQuestion(raw: LogicQuestion, index: number): Question {
  const correct = formatFormula(raw.optionProlog[raw.correctIndex]!);
  const chain = raw.correctSteps.map(formatFormula).join(CONSTRUCTION_SEP);

  let text: Record<Locale, string>;
  let explanation: Record<Locale, string>;
  if (raw.kind === "consequence" && raw.promptProlog) {
    const premise = formatFormula(raw.promptProlog);
    text = {
      it: `Quale delle seguenti formule è conseguenza logica di ${premise}?`,
      en: `Which of the following formulas is a logical consequence of ${premise}?`,
    };
    explanation = {
      it: `Dalla premessa ${premise} segue logicamente ${correct}. Costruzione della conseguenza: ${chain}.`,
      en: `From the premise ${premise}, ${correct} logically follows. Construction of the consequence: ${chain}.`,
    };
  } else {
    const assignments = raw.information.map((entry) => formatAssignment(entry, "it")).join(", ");
    const assignmentsEn = raw.information.map((entry) => formatAssignment(entry, "en")).join(", ");
    text = {
      it: `Sia ${assignments}. Quale delle seguenti formule è vera?`,
      en: `Let ${assignmentsEn}. Which of the following formulas is true?`,
    };
    explanation = {
      it: `Sotto l'assegnazione ${assignments}, l'unica formula vera è ${correct}. Costruzione: ${chain}.`,
      en: `Under the assignment ${assignmentsEn}, the only true formula is ${correct}. Construction: ${chain}.`,
    };
  }

  return {
    id: `logic-api-${raw.kind}-${index}-${Date.now()}`,
    sectionId: "matematica-ragionare",
    text,
    options: raw.optionProlog.map((formula) => {
      const rendered = formatFormula(formula);
      return { it: rendered, en: rendered };
    }),
    correctIndex: raw.correctIndex,
    explanation,
  };
}
