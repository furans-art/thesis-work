/**
 * Server-only client for KevinUniud's TestLogica API (the API_Logica thesis
 * project by the previous student). The base URL is configurable through the
 * LOGIC_API_URL environment variable; a failed call (tunnel down, timeout)
 * returns null so callers can fall back to local sample questions.
 */

export interface LogicQuestion {
  kind: "tvq" | "consequence";
  /** premise formula (Prolog syntax) for consequence questions */
  promptProlog: string | null;
  variables: string[];
  /** e.g. ["p-true","q-false"] — only for truth-value questions */
  information: string[];
  /** Prolog formulas (options), in the order returned by the API */
  optionProlog: string[];
  correctIndex: number;
  /** construction steps of the correct option, in order */
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

const TIMEOUT_MS = 12_000;

async function callApi(url: string, body: Record<string, unknown>): Promise<ApiResult | null> {
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
    return result;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function toLogicQuestion(kind: "tvq" | "consequence", result: ApiResult): LogicQuestion | null {
  const options = result.options;
  if (!options) return null;
  let correctIndex = options.findIndex((o) => o.is_true === true || o.is_consequence === true);
  if (correctIndex < 0) correctIndex = 0;
  const correct = options[correctIndex]!;
  return {
    kind,
    promptProlog: result.question_prolog ?? null,
    variables: result.variables ?? [],
    information: result.information ?? [],
    optionProlog: options.map((o) => o.formula_prolog),
    correctIndex,
    correctSteps: (correct.construction?.steps ?? [])
      .sort((a, b) => a.index - b.index)
      .map((s) => s.result_prolog),
  };
}

export const logicApi = {
  /** Fetches one generated question; null when the API is unreachable. */
  async fetchQuestion(): Promise<LogicQuestion | null> {
    const base = (process.env["LOGIC_API_URL"] || "https://produce-changed-ist-generators.trycloudflare.com").replace(
      /\/$/,
      "",
    );
    const wantConsequence = Math.random() < 0.5;
    const result = wantConsequence
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
    return result ? toLogicQuestion(wantConsequence ? "consequence" : "tvq", result) : null;
  },
};
