/**
 * Socratic feedback from a small local language model (Ollama).
 *
 * The deterministic engine stays the only source of mathematical truth: the
 * model receives the question, the student's wrong choice and the diagnosed
 * misconception, and may only turn them into a short guiding question. It is
 * never asked to solve the exercise. The browser calls Ollama directly, so the
 * classroom machine must reach it (OLLAMA_ORIGINS must allow this origin).
 */
import type { Locale } from "@/types/i18n";

const URL_KEY = "tolcs.slm.url";
const MODEL_KEY = "tolcs.slm.model";
export const DEFAULT_SLM_URL = "http://localhost:11434";
export const DEFAULT_SLM_MODEL = "qwen2.5:7b";

export interface SlmConfig {
  url: string;
  model: string;
}

export function readSlmConfig(): SlmConfig {
  if (typeof window === "undefined") return { url: DEFAULT_SLM_URL, model: DEFAULT_SLM_MODEL };
  return {
    url: window.localStorage.getItem(URL_KEY) || DEFAULT_SLM_URL,
    model: window.localStorage.getItem(MODEL_KEY) || DEFAULT_SLM_MODEL,
  };
}

export function saveSlmConfig(config: SlmConfig): void {
  window.localStorage.setItem(URL_KEY, config.url.trim());
  window.localStorage.setItem(MODEL_KEY, config.model.trim());
}

export interface SocraticInput {
  locale: Locale;
  question: string;
  chosen: string;
  correct: string;
  diagnosis: string;
}

/** Four-part constrained prompt: role, binding facts, task, explicit bans. */
export function buildSocraticPrompt(input: SocraticInput): { system: string; user: string } {
  if (input.locale === "en") {
    return {
      system: [
        "ROLE: You are a patient maths tutor for a university entrance test.",
        "TASK: Write one or two sentences that help the student notice their mistake, ending with a question.",
        "BANS: Never state or hint at the correct answer, never do calculations, never introduce numbers that are not in the question, never contradict the facts.",
        "Answer in English.",
      ].join("\n"),
      user: `FACTS (verified, binding):\nQuestion: ${input.question}\nStudent's answer: ${input.chosen}\nDiagnosed mistake: ${input.diagnosis}`,
    };
  }
  return {
    system: [
      "RUOLO: Sei un tutor di matematica paziente per un test d'ingresso universitario.",
      "COMPITO: Scrivi una o due frasi che aiutino lo studente ad accorgersi dell'errore, terminando con una domanda.",
      "DIVIETI: Non rivelare né suggerire la risposta corretta, non fare calcoli, non introdurre numeri assenti dal quesito, non contraddire i fatti.",
      "Rispondi in italiano.",
    ].join("\n"),
    user: `FATTI (verificati, vincolanti):\nQuesito: ${input.question}\nRisposta dello studente: ${input.chosen}\nErrore diagnosticato: ${input.diagnosis}`,
  };
}

/** Rejects outputs that leak the correct answer; the caller then shows the deterministic diagnosis. */
export function violatesConstraints(output: string, correct: string): boolean {
  const c = correct.trim();
  if (!c) return false;
  return output.includes(c);
}

export async function requestSocraticHint(
  input: SocraticInput,
  signal?: AbortSignal,
): Promise<string> {
  const { url, model } = readSlmConfig();
  const { system, user } = buildSocraticPrompt(input);
  const res = await fetch(`${url.replace(/\/$/, "")}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: signal ?? null,
    body: JSON.stringify({
      model,
      stream: false,
      options: { temperature: 0.3, num_predict: 160 },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as { message?: { content?: string } };
  const text = json.message?.content?.trim() ?? "";
  if (!text) throw new Error("empty");
  if (violatesConstraints(text, input.correct)) throw new Error("leak");
  return text;
}
