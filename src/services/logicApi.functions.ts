import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { logicApi } from "@/services/logicApi.server";
import { logicQuestionToQuestion } from "@/services/logicQuestions";
import type { Question } from "@/services/questionService";

/**
 * Fetches live questions from the Logic API (TestLogica / API_Logica).
 * Returns only the questions the API managed to generate; the caller
 * fills any gap with the local sample bank.
 */
export const fetchLogicQuestions = createServerFn({ method: "POST" })
  .inputValidator((input: { count: number }) => z.object({ count: z.number().int().min(1).max(30) }).parse(input))
  .handler(async ({ data }) => {
    const attempts = Math.min(data.count + 2, 12);
    const requests = Array.from({ length: attempts }, () => logicApi.fetchQuestion());
    const results = await Promise.all(requests);
    const questions: Question[] = [];
    for (const raw of results) {
      if (!raw) continue;
      questions.push(logicQuestionToQuestion(raw, questions.length));
      if (questions.length >= data.count) break;
    }
    return questions;
  });
