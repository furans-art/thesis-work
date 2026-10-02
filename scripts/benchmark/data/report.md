# Benchmark LLM — calcolo combinatorio (seed 20261001)

Dataset: 96 quesiti, 24 archetipi, generazione deterministica.

## Tabella 6.1 — Accuratezza complessiva e allineamento ai distrattori

| Modello | Lingua | Quesiti | Accuratezza | Errati | Allineamento distrattori | Non conformi | Latenza mediana |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Claude Opus 5 (Anthropic) | it | 96 | 99.0% | 1 | 100.0% | 0 | 1946 ms |
| Claude Opus 5 (Anthropic) | en | 96 | 99.0% | 1 | 100.0% | 0 | 2012 ms |
| GPT-6.1 Sol (OpenAI) | en | 96 | 96.9% | 3 | 100.0% | 0 | 3275 ms |
| DeepSeek R1 (reasoning) | it | 96 | 94.8% | 2 | 100.0% | 3 | 1232 ms |
| GPT-6.1 Sol (OpenAI) | it | 96 | 93.8% | 4 | 100.0% | 2 | 3298 ms |
| DeepSeek Flash | it | 96 | 93.8% | 1 | 100.0% | 5 | 1254 ms |
| DeepSeek Flash | en | 96 | 93.8% | 1 | 100.0% | 5 | 1111 ms |
| DeepSeek R1 (reasoning) | en | 96 | 92.7% | 2 | 100.0% | 5 | 1040 ms |
| Qwen 2.5 7B (locale, Ollama) | en | 96 | 88.5% | 11 | 100.0% | 0 | 14269 ms |
| Qwen 2.5 7B (locale, Ollama) | it | 96 | 82.3% | 17 | 100.0% | 0 | 17384 ms |
| Llama 3.2 3B (locale, Ollama) | en | 96 | 76.0% | 20 | 90.0% | 3 | 3859 ms |
| Llama 3.2 3B (locale, Ollama) | it | 96 | 52.1% | 33 | 93.9% | 13 | 15935 ms |

## Tabella 6.2 — Accuratezza per macro-categoria

| Modello | Lingua | disposizioni | permutazioni | combinazioni | urne | probabilita | avanzati | trombetta |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Claude Opus 5 (Anthropic) | it | 100.0% | 100.0% | 100.0% | 100.0% | 91.7% | 100.0% | 100.0% |
| Claude Opus 5 (Anthropic) | en | 100.0% | 100.0% | 100.0% | 100.0% | 91.7% | 100.0% | 100.0% |
| GPT-6.1 Sol (OpenAI) | en | 100.0% | 100.0% | 100.0% | 83.3% | 91.7% | 100.0% | 100.0% |
| DeepSeek R1 (reasoning) | it | 100.0% | 100.0% | 100.0% | 75.0% | 83.3% | 100.0% | 100.0% |
| GPT-6.1 Sol (OpenAI) | it | 100.0% | 91.7% | 100.0% | 75.0% | 83.3% | 100.0% | 100.0% |
| DeepSeek Flash | it | 100.0% | 100.0% | 100.0% | 66.7% | 83.3% | 100.0% | 100.0% |
| DeepSeek Flash | en | 100.0% | 91.7% | 100.0% | 75.0% | 83.3% | 100.0% | 100.0% |
| DeepSeek R1 (reasoning) | en | 100.0% | 100.0% | 100.0% | 66.7% | 75.0% | 100.0% | 100.0% |
| Qwen 2.5 7B (locale, Ollama) | en | 100.0% | 83.3% | 100.0% | 75.0% | 75.0% | 87.5% | 93.8% |
| Qwen 2.5 7B (locale, Ollama) | it | 100.0% | 75.0% | 100.0% | 83.3% | 41.7% | 93.8% | 75.0% |
| Llama 3.2 3B (locale, Ollama) | en | 83.3% | 58.3% | 93.8% | 75.0% | 66.7% | 75.0% | 75.0% |
| Llama 3.2 3B (locale, Ollama) | it | 91.7% | 41.7% | 68.8% | 33.3% | 33.3% | 50.0% | 43.8% |

