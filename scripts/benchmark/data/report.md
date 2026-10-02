# Benchmark LLM — calcolo combinatorio (seed 20261001)

Dataset v2, motore v2: 96 quesiti, 24 archetipi.

## Avvisi

- Claude Opus 5 (Anthropic) (en): v1 run, 9 item(s) with a wrong v1 key excluded
- Claude Opus 5 (Anthropic) (it): v1 run, 9 item(s) with a wrong v1 key excluded
- DeepSeek Flash (en): v1 run, 9 item(s) with a wrong v1 key excluded
- DeepSeek Flash (it): v1 run, 9 item(s) with a wrong v1 key excluded
- DeepSeek R1 (reasoning) (en): v1 run, 9 item(s) with a wrong v1 key excluded
- DeepSeek R1 (reasoning) (it): v1 run, 9 item(s) with a wrong v1 key excluded
- GPT-6.1 Sol (OpenAI) (en): v1 run, 9 item(s) with a wrong v1 key excluded
- GPT-6.1 Sol (OpenAI) (it): v1 run, 9 item(s) with a wrong v1 key excluded
- Llama 3.2 3B (locale, Ollama) (en): v1 run, 9 item(s) with a wrong v1 key excluded
- !!! INTEGRITY CHECK FAILED — Llama 3.2 3B (locale, Ollama) (en): 1 of 13 wrong answers landed on an option WITHOUT a misconception id
- Llama 3.2 3B (locale, Ollama) (it): v1 run, 9 item(s) with a wrong v1 key excluded
- !!! INTEGRITY CHECK FAILED — Llama 3.2 3B (locale, Ollama) (it): 2 of 30 wrong answers landed on an option WITHOUT a misconception id
- Qwen 2.5 7B (locale, Ollama) (en): v1 run, 9 item(s) with a wrong v1 key excluded
- Qwen 2.5 7B (locale, Ollama) (it): v1 run, 9 item(s) with a wrong v1 key excluded

## Accuratezza complessiva (dataset seed 20261001; integrità attesa 100%).

| Modello | Lingua | Dataset | Quesiti | Accuratezza | Errati | Non conformi | Latenza mediana | Integrità |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Claude Opus 5 (Anthropic) | en | v1 | 87 | 100.0% | 0 | 0 | 1944 ms | — |
| Claude Opus 5 (Anthropic) | it | v1 | 87 | 100.0% | 0 | 0 | 1843 ms | — |
| DeepSeek Flash | en | v1 | 87 | 100.0% | 0 | 0 | 1050 ms | — |
| DeepSeek Flash | it | v1 | 87 | 100.0% | 0 | 0 | 1230 ms | — |
| DeepSeek R1 (reasoning) | en | v1 | 87 | 100.0% | 0 | 0 | 1025 ms | — |
| DeepSeek R1 (reasoning) | it | v1 | 87 | 100.0% | 0 | 0 | 1228 ms | — |
| GPT-6.1 Sol (OpenAI) | en | v1 | 87 | 100.0% | 0 | 0 | 3175 ms | — |
| GPT-6.1 Sol (OpenAI) | it | v1 | 87 | 100.0% | 0 | 0 | 3276 ms | — |
| Qwen 2.5 7B (locale, Ollama) | en | v1 | 87 | 93.1% | 6 | 0 | 13923 ms | 100.0% |
| Qwen 2.5 7B (locale, Ollama) | it | v1 | 87 | 87.4% | 11 | 0 | 17262 ms | 100.0% |
| Llama 3.2 3B (locale, Ollama) | en | v1 | 87 | 82.8% | 13 | 2 | 3572 ms | 92.3% |
| Llama 3.2 3B (locale, Ollama) | it | v1 | 87 | 56.3% | 30 | 8 | 14544 ms | 93.3% |

## Accuratezza per categoria di rendicontazione.

| Modello | Lingua | disposizioni | permutazioni | combinazioni | urne | probabilita-elementare | probabilita-avanzata | trombetta |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Claude Opus 5 (Anthropic) | en | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| Claude Opus 5 (Anthropic) | it | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| DeepSeek Flash | en | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| DeepSeek Flash | it | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| DeepSeek R1 (reasoning) | en | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| DeepSeek R1 (reasoning) | it | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| GPT-6.1 Sol (OpenAI) | en | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| GPT-6.1 Sol (OpenAI) | it | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| Qwen 2.5 7B (locale, Ollama) | en | 100.0% | 81.8% | 100.0% | 87.5% | 100.0% | 83.3% | 93.8% |
| Qwen 2.5 7B (locale, Ollama) | it | 100.0% | 72.7% | 100.0% | 100.0% | 62.5% | 91.7% | 75.0% |
| Llama 3.2 3B (locale, Ollama) | en | 81.3% | 63.6% | 93.8% | 100.0% | 100.0% | 75.0% | 75.0% |
| Llama 3.2 3B (locale, Ollama) | it | 68.8% | 45.5% | 68.8% | 50.0% | 50.0% | 58.3% | 43.8% |

## Distribuzione degli errori per tipo di misconcezione (en); «Frontier» somma i quattro modelli remoti.

| Tipo | Claude Opus 5 (Anthropic) | DeepSeek Flash | DeepSeek R1 (reasoning) | GPT-6.1 Sol (OpenAI) | Qwen 2.5 7B (locale, Ollama) | Llama 3.2 3B (locale, Ollama) | Frontier |
| --- | --- | --- | --- | --- | --- | --- | --- |
| order-irrelevant | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| repetition | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| labelled-groups | 0 | 0 | 0 | 0 | 1 | 2 | 0 |
| constraint-ignored | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| inclusion-exclusion-truncated | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| complement-ignored | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| other | 0 | 0 | 0 | 0 | 3 | 6 | 0 |
| untyped | 0 | 0 | 0 | 0 | 0 | 1 | 0 |

## Distribuzione degli errori per tipo di misconcezione (it); «Frontier» somma i quattro modelli remoti.

| Tipo | Claude Opus 5 (Anthropic) | DeepSeek Flash | DeepSeek R1 (reasoning) | GPT-6.1 Sol (OpenAI) | Qwen 2.5 7B (locale, Ollama) | Llama 3.2 3B (locale, Ollama) | Frontier |
| --- | --- | --- | --- | --- | --- | --- | --- |
| repetition | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| labelled-groups | 0 | 0 | 0 | 0 | 3 | 2 | 0 |
| constraint-ignored | 0 | 0 | 0 | 0 | 0 | 4 | 0 |
| constraint-applied-once | 0 | 0 | 0 | 0 | 0 | 6 | 0 |
| additive-union | 0 | 0 | 0 | 0 | 3 | 6 | 0 |
| inclusion-exclusion-truncated | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| circular-as-linear | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| other | 0 | 0 | 0 | 0 | 3 | 9 | 0 |
| untyped | 0 | 0 | 0 | 0 | 0 | 2 | 0 |

## Accordo inter-modello sugli errori condivisi (baseline casuale 1/3 = 33.3%).

| Lingua | Modello A | Modello B | Errori condivisi | Stesso distrattore | Accordo | Baseline |
| --- | --- | --- | --- | --- | --- | --- |
| en | Claude Opus 5 (Anthropic) | DeepSeek Flash | 0 | 0 | — | 33.3% |
| en | Claude Opus 5 (Anthropic) | DeepSeek R1 (reasoning) | 0 | 0 | — | 33.3% |
| en | Claude Opus 5 (Anthropic) | GPT-6.1 Sol (OpenAI) | 0 | 0 | — | 33.3% |
| en | Claude Opus 5 (Anthropic) | Qwen 2.5 7B (locale, Ollama) | 0 | 0 | — | 33.3% |
| en | Claude Opus 5 (Anthropic) | Llama 3.2 3B (locale, Ollama) | 0 | 0 | — | 33.3% |
| en | DeepSeek Flash | DeepSeek R1 (reasoning) | 0 | 0 | — | 33.3% |
| en | DeepSeek Flash | GPT-6.1 Sol (OpenAI) | 0 | 0 | — | 33.3% |
| en | DeepSeek Flash | Qwen 2.5 7B (locale, Ollama) | 0 | 0 | — | 33.3% |
| en | DeepSeek Flash | Llama 3.2 3B (locale, Ollama) | 0 | 0 | — | 33.3% |
| en | DeepSeek R1 (reasoning) | GPT-6.1 Sol (OpenAI) | 0 | 0 | — | 33.3% |
| en | DeepSeek R1 (reasoning) | Qwen 2.5 7B (locale, Ollama) | 0 | 0 | — | 33.3% |
| en | DeepSeek R1 (reasoning) | Llama 3.2 3B (locale, Ollama) | 0 | 0 | — | 33.3% |
| en | GPT-6.1 Sol (OpenAI) | Qwen 2.5 7B (locale, Ollama) | 0 | 0 | — | 33.3% |
| en | GPT-6.1 Sol (OpenAI) | Llama 3.2 3B (locale, Ollama) | 0 | 0 | — | 33.3% |
| en | Qwen 2.5 7B (locale, Ollama) | Llama 3.2 3B (locale, Ollama) | 3 | 0 | 0.0% | 33.3% |
| it | Claude Opus 5 (Anthropic) | DeepSeek Flash | 0 | 0 | — | 33.3% |
| it | Claude Opus 5 (Anthropic) | DeepSeek R1 (reasoning) | 0 | 0 | — | 33.3% |
| it | Claude Opus 5 (Anthropic) | GPT-6.1 Sol (OpenAI) | 0 | 0 | — | 33.3% |
| it | Claude Opus 5 (Anthropic) | Qwen 2.5 7B (locale, Ollama) | 0 | 0 | — | 33.3% |
| it | Claude Opus 5 (Anthropic) | Llama 3.2 3B (locale, Ollama) | 0 | 0 | — | 33.3% |
| it | DeepSeek Flash | DeepSeek R1 (reasoning) | 0 | 0 | — | 33.3% |
| it | DeepSeek Flash | GPT-6.1 Sol (OpenAI) | 0 | 0 | — | 33.3% |
| it | DeepSeek Flash | Qwen 2.5 7B (locale, Ollama) | 0 | 0 | — | 33.3% |
| it | DeepSeek Flash | Llama 3.2 3B (locale, Ollama) | 0 | 0 | — | 33.3% |
| it | DeepSeek R1 (reasoning) | GPT-6.1 Sol (OpenAI) | 0 | 0 | — | 33.3% |
| it | DeepSeek R1 (reasoning) | Qwen 2.5 7B (locale, Ollama) | 0 | 0 | — | 33.3% |
| it | DeepSeek R1 (reasoning) | Llama 3.2 3B (locale, Ollama) | 0 | 0 | — | 33.3% |
| it | GPT-6.1 Sol (OpenAI) | Qwen 2.5 7B (locale, Ollama) | 0 | 0 | — | 33.3% |
| it | GPT-6.1 Sol (OpenAI) | Llama 3.2 3B (locale, Ollama) | 0 | 0 | — | 33.3% |
| it | Qwen 2.5 7B (locale, Ollama) | Llama 3.2 3B (locale, Ollama) | 8 | 5 | 62.5% | 33.3% |
| en | tutte le coppie |  | 3 | 0 | 0.0% | 33.3% |
| it | tutte le coppie |  | 8 | 5 | 62.5% | 33.3% |

## Errori quesito per quesito dei modelli con al più 5 errori.

| Modello | Lingua | Quesito | Archetipo | Opzione scelta | Misconcezione |
| --- | --- | --- | --- | --- | --- |

