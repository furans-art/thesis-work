/**
 * Model providers for the benchmark.
 *
 * Three transports cover every case needed by the thesis:
 *  - "openai"    : any OpenAI-compatible /chat/completions endpoint. This also
 *                  covers Ollama, llama.cpp, vLLM, LM Studio, OpenRouter,
 *                  DeepSeek and Groq, by changing baseUrl + apiKeyEnv.
 *  - "anthropic" : Anthropic Messages API.
 *  - "mock"      : no network. Answers deterministically (and deliberately
 *                  imperfectly) so the whole pipeline — parsing, scoring,
 *                  table generation — can be validated offline.
 */

export type Transport = "openai" | "anthropic" | "mock";

export interface ModelConfig {
  /** short id used in filenames and result tables */
  id: string;
  label: string;
  transport: Transport;
  /** provider-side model name */
  model: string;
  baseUrl?: string;
  /** env var holding the API key; omitted for local endpoints and mock */
  apiKeyEnv?: string;
  temperature?: number;
  maxTokens?: number;
}

/** Registry: edit freely, the runner selects entries by id. */
export const MODELS: ModelConfig[] = [
  {
    id: "mock",
    label: "Mock (offline pipeline check)",
    transport: "mock",
    model: "mock",
  },
  {
    id: "llama32-3b",
    label: "Llama 3.2 3B (locale, Ollama)",
    transport: "openai",
    model: "llama3.2:3b",
    baseUrl: "http://localhost:11434/v1",
  },
  {
    id: "qwen25-7b",
    label: "Qwen 2.5 7B (locale, Ollama)",
    transport: "openai",
    model: "qwen2.5:7b",
    baseUrl: "http://localhost:11434/v1",
  },
  {
    id: "gpt-61-sol",
    label: "GPT-6.1 Sol (OpenAI)",
    transport: "openai",
    model: "gpt-6.1-sol",
    baseUrl: "https://api.openai.com/v1",
    apiKeyEnv: "OPENAI_API_KEY",
  },
  {
    id: "gpt-6-astra",
    label: "GPT-6 Astra (OpenAI)",
    transport: "openai",
    model: "gpt-6-astra",
    baseUrl: "https://api.openai.com/v1",
    apiKeyEnv: "OPENAI_API_KEY",
  },
  {
    id: "deepseek-reasoner",
    label: "DeepSeek R1 (reasoning)",
    transport: "openai",
    model: "deepseek-reasoner",
    baseUrl: "https://api.deepseek.com/v1",
    apiKeyEnv: "DEEPSEEK_API_KEY",
  },
  {
    id: "claude-opus-5",
    label: "Claude Opus 5 (Anthropic)",
    transport: "anthropic",
    model: "claude-opus-5",
    baseUrl: "https://api.anthropic.com/v1",
    apiKeyEnv: "ANTHROPIC_API_KEY",
  },
];


export interface CompletionResult {
  raw: string;
  error?: string;
}

async function callOpenAi(
  config: ModelConfig,
  system: string,
  user: string,
): Promise<CompletionResult> {
  const key = config.apiKeyEnv ? process.env[config.apiKeyEnv] : undefined;
  if (config.apiKeyEnv && !key) {
    return { raw: "", error: `missing env ${config.apiKeyEnv}` };
  }
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
    },
    body: JSON.stringify({
      model: config.model,
      temperature: config.temperature ?? 0,
      max_tokens: config.maxTokens ?? 1200,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!response.ok) {
    return { raw: "", error: `HTTP ${response.status}: ${(await response.text()).slice(0, 200)}` };
  }
  const json = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return { raw: json.choices?.[0]?.message?.content ?? "" };
}

async function callAnthropic(
  config: ModelConfig,
  system: string,
  user: string,
): Promise<CompletionResult> {
  const key = config.apiKeyEnv ? process.env[config.apiKeyEnv] : undefined;
  if (!key) return { raw: "", error: `missing env ${config.apiKeyEnv}` };
  const response = await fetch(`${config.baseUrl}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens ?? 1200,
      temperature: config.temperature ?? 0,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!response.ok) {
    return { raw: "", error: `HTTP ${response.status}: ${(await response.text()).slice(0, 200)}` };
  }
  const json = (await response.json()) as { content?: { text?: string }[] };
  return { raw: json.content?.map((c) => c.text ?? "").join("") ?? "" };
}

/** Deterministic pseudo-model: picks an option from a hash of the prompt. */
function callMock(user: string): CompletionResult {
  let h = 0;
  for (let i = 0; i < user.length; i += 1) h = (h * 31 + user.charCodeAt(i)) >>> 0;
  const letter = ["A", "B", "C", "D"][h % 4]!;
  return {
    raw: JSON.stringify({ reasoning: "mock deterministic answer", choice: letter }),
  };
}

export async function complete(
  config: ModelConfig,
  system: string,
  user: string,
): Promise<CompletionResult> {
  try {
    if (config.transport === "mock") return callMock(user);
    if (config.transport === "anthropic") return await callAnthropic(config, system, user);
    return await callOpenAi(config, system, user);
  } catch (error) {
    return { raw: "", error: error instanceof Error ? error.message : String(error) };
  }
}
