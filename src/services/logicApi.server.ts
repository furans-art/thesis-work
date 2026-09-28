/**
 * Server-only client for KevinUniud's TestLogica API (API_Logica thesis project).
 * Endpoint base is configurable; a call that fails (tunnel down, timeout)
 * lets the caller fall back to the local sample questions.
 */

import type { Locale } from "@/types/i18n";

const DEFAULT_LOGIC_API_URL = "https://produce-changed-ist-generators.trycloudflare.com";
const TIMEOUT_MS = 12_000;

export interface LogicQuestion {
  kind: "tvq" | "consequence";
  /** question prompt (Prolog formula for consequence questions) */
  promptProlog: string | null;
  variables: string[];
  /** e.g. ["p-true","q-false"] */
  information: string[];
  /** Prolog formulas, already shuffled by the API */
  optionProlog: string[];
  correctIndex: number;
  /** step-by-step derivation of the correct option, if returned */
  correctSteps: string[];
}

interface ApiOption {
  formula_prolog: string;
  construction?: { steps?: { index: number; result_prolog: string }[] };
  is_true?: boolean;
  is_consequence?: boolean;
}

interface ApiResult {
  variables?: string[];
  information?: string[];
  question_prolog?: string;
  options?: ApiOption[];
}

async function callApi(url: string, body: unknown): Promise<LogicQuestion | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { result?: ApiResult };
    const result = payload.result;
    if (!result?.options || result.options.length < 2) return null;

    const options = result.options;
    let correctIndex = options.findIndex((o) => o.is_true === true || o.is_consequence === true);
    if (correctIndex < 0) correctIndex = 0;
    const correct = options[correctIndex]!;
    return {
      kind: body.kind === "consequence" ? "consequence" : "tvq",
      promptProlog: result.question_prolog ?? null,
      variables: result.variables ?? [],
      information: result.information ?? [],
      optionProlog: options.map((o) => o.formula_prolog),
      correctIndex,
      correctSteps: (correct.construction?.steps ?? [])
        .sort((a, b) => a.index - b.index)
        .map((s) => s.result_prolog),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const IT_SENTENCE = ["Vera", "Falsa"] as const;
const EN_SENTENCE = ["True", "False"] as const;

export const logicApi = {
  async fetchQuestion(locale: Locale): Promise<LogicQuestion | null> {
    const base = (process.env["LOGIC_API_URL"] || DEFAULT_LOGIC_API_URL).replace(/\/$/, "");
    // Alternate between the two exercise types.
    const wantConsequence = Math.random() < 0.5;
    const raw = wantConsequence
      ? await callApi(`${base}/api/generator/build-logical-consequence-question`, {
          variable_count: 3,
          correct_options_count: 1,
          wrong_options_count: 3,
        })
      : await callApi(`${base}/api/generator/build-truth-value-options-question`, {
          predicate_count: 3,
          true_options_count: 1,
          false_options_count: 3,
        });
    if (!raw) return null;
    return wantConsequence
      ? {
          ...raw,
          kind: "consequence" as const,
        }
      : {
          ...raw,
          kind: "tvq" as const,
        };
  },
  sentenceLabels(locale: Locale): readonly [string, string] {
    return locale === "it" ? IT_SENTENCE : EN_SENTENCE;
  },
};
