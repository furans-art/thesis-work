# Benchmark LLM — calcolo combinatorio (seed 20261001)

Dataset v2, motore v2: 96 quesiti, 24 archetipi. Le run v1 sono valutate sugli 87 quesiti validi (9 esclusi perché la chiave v1 era errata).

## Tabella 1 — Accuratezza complessiva (`tab:risultati`)

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

## Tabella 2 — Accuratezza per categoria (`tab:categorie`)

| Modello | Lingua | Disp. | Perm. | Comb. | Urne | Prob. | Avanz. | Tromb. |
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

## Tabella 3 — Distribuzione degli errori per tipo di misconcezione, inglese (`tab:misconcezioni-en`)

| Tipo | Claude Opus 5 | DeepSeek Flash | DeepSeek R1 | GPT-6.1 Sol | Qwen 2.5 7B | Llama 3.2 3B | Frontier |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Ordine ignorato | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| Ripetizione non gestita | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| Gruppi trattati come etichettati | 0 | 0 | 0 | 0 | 1 | 2 | 0 |
| Vincolo ignorato | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| Inclusione-esclusione troncata | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| Complementare errato | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| Altro | 0 | 0 | 0 | 0 | 3 | 6 | 0 |
| Non diagnosticato | 0 | 0 | 0 | 0 | 0 | 1 | 0 |

## Tabella 4 — Distribuzione degli errori per tipo di misconcezione, italiano (`tab:misconcezioni-it`)

| Tipo | Claude Opus 5 | DeepSeek Flash | DeepSeek R1 | GPT-6.1 Sol | Qwen 2.5 7B | Llama 3.2 3B | Frontier |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Ripetizione non gestita | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| Gruppi trattati come etichettati | 0 | 0 | 0 | 0 | 3 | 2 | 0 |
| Vincolo ignorato | 0 | 0 | 0 | 0 | 0 | 4 | 0 |
| Vincolo applicato una sola volta | 0 | 0 | 0 | 0 | 0 | 6 | 0 |
| Unione additiva | 0 | 0 | 0 | 0 | 3 | 6 | 0 |
| Inclusione-esclusione troncata | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| Disposizione circolare come lineare | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| Altro | 0 | 0 | 0 | 0 | 3 | 9 | 0 |
| Non diagnosticato | 0 | 0 | 0 | 0 | 0 | 2 | 0 |

## Tabella 5 — Accordo inter-modello sugli errori condivisi (`tab:accordo`)

Baseline casuale: 1/3 = 33.3%. Solo la coppia Qwen–Llama condivide errori.

| Lingua | Modello A | Modello B | Errori condivisi | Stesso distrattore | Accordo | Baseline |
| --- | --- | --- | --- | --- | --- | --- |
| en | Qwen 2.5 7B | Llama 3.2 3B | 3 | 0 | 0.0% | 33.3% |
| it | Qwen 2.5 7B | Llama 3.2 3B | 8 | 5 | 62.5% | 33.3% |
| en | tutte le coppie | | 3 | 0 | 0.0% | 33.3% |
| it | tutte le coppie | | 8 | 5 | 62.5% | 33.3% |

(Tutte le altre coppie di modelli hanno 0 errori condivisi.)

## Tabella 6 — Errori quesito per quesito (`tab:errori-quesiti`)

Vuota: nessun modello con al più 5 errori ha errori sui quesiti validati (i 4 modelli frontier hanno 0 errori; Qwen e Llama superano la soglia di 5).
