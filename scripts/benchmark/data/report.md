# Benchmark LLM — calcolo combinatorio (seed 20261001)

Dataset: 96 quesiti, 24 archetipi, generazione deterministica.

## Tabella 6.1 — Accuratezza complessiva e allineamento ai distrattori

| Modello | Lingua | Quesiti | Accuratezza | Errati | Allineamento distrattori | Non conformi | Latenza mediana |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Mock (offline pipeline check) | it | 96 | 28.1% | 69 | 95.7% | 0 | 0 ms |

## Tabella 6.2 — Accuratezza per macro-categoria

| Modello | disposizioni | permutazioni | combinazioni | urne | probabilita | avanzati | trombetta |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Mock (offline pipeline check) | 33.3% | 41.7% | 25.0% | 16.7% | 33.3% | 25.0% | 25.0% |

