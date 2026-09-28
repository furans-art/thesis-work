import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { logicApi } from "@/services/logicApi.server";
import { logicQuestionToQuestion } from "@/services/logicQuestions";
import type { Question } from "@/services/questionService";

/**
 * Fetches live questions from the Logic API (TestLogica / API_Logica).
 * Returns only the questions the API managed to generate; the caller
 * fills any gap with the local sample bank.
 *
 * The generator answers one exercise per request, so larger sessions are
 * fetched in parallel waves until the requested count is met or the
 * attempt budget is exhausted (keeps each wave within timeout limits).
 */
export const fetchLogicQuestions = createServerFn({ method: "POST" })
  .inputValidator((input: { count: number }) => z.object({ count: z.number().int().min(1).max(50) }).parse(input))
  .handler(async ({ data }) => {
    const questions: Question[] = [];
    const seen = new Set<string>();
    const WAVE = 20;
    const MAX_ATTEMPTS = 70;
    let attempts = 0;
    while (questions.length < data.count && attempts < MAX_ATTEMPTS) {
      const size = Math.min(WAVE, data.count - questions.length + 4, MAX_ATTEMPTS - attempts);
      const results = await Promise.all(Array.from({ length: size }, () => logicApi.fetchQuestion()));
      attempts += size;
      for (const raw of results) {
        if (!raw) continue;
        const fingerprint = `${raw.promptProlog}|${raw.optionProlog}`;
        if (seen.has(fingerprint)) continue;
        seen.add(fingerprint);
        questions.push(logicQuestionToQuestion(raw, questions.length));
        if (questions.length >= data.count) break;
      }
    }
    return questions;
  });
