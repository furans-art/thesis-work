# Benchmark LLM — Calcolo combinatorio (TOLC-S)

Protocollo sperimentale del Capitolo 6: il motore procedurale a 24 archetipi
fornisce il *ground truth* (risposta esatta, derivazione e diagnosi cognitiva di
ogni distrattore) con cui misurare le prestazioni dei modelli linguistici.

## 1. Generare il dataset (deterministico)

```bash
bun scripts/benchmark/generate-dataset.ts --seed 20261001 --per-archetype 4
```

96 quesiti (4 per ciascuno dei 24 archetipi). Lo stesso seed produce sempre lo
stesso dataset: l'esperimento è riproducibile.

## 2. Eseguire un modello

```bash
# verifica offline dell'intera pipeline, senza rete
bun scripts/benchmark/run-benchmark.ts --model mock

# modelli locali (Ollama su localhost:11434)
bun scripts/benchmark/run-benchmark.ts --model llama32-3b
bun scripts/benchmark/run-benchmark.ts --model qwen25-7b

# modelli via API (chiave in variabile d'ambiente)
OPENAI_API_KEY=... bun scripts/benchmark/run-benchmark.ts --model gpt-61-sol --concurrency 4
DEEPSEEK_API_KEY=... bun scripts/benchmark/run-benchmark.ts --model deepseek-flash
ANTHROPIC_API_KEY=... bun scripts/benchmark/run-benchmark.ts --model claude-opus-5
```

Opzioni: `--locale it|en`, `--limit N`, `--concurrency N`, `--fresh`.
Le esecuzioni sono riprendibili: rilanciando lo stesso comando si completano
soltanto i quesiti mancanti.

Nuovi modelli si aggiungono in `providers.ts` (`MODELS`): qualsiasi endpoint
compatibile con l'API OpenAI funziona cambiando `baseUrl` e `apiKeyEnv`.

## 3. Calcolare le metriche

```bash
bun scripts/benchmark/evaluate.ts                  # tabelle Markdown
bun scripts/benchmark/evaluate.ts --format latex   # tabella LaTeX per la tesi
```

Metriche prodotte:

| Metrica | Significato |
| --- | --- |
| Accuratezza | quota di risposte esatte |
| Accuratezza per macro-categoria | disposizioni, permutazioni, combinazioni, urne, probabilità, avanzati, Trombetta |
| **Allineamento ai distrattori** | quota degli errori che cadono su un'opzione corrispondente a una misconcezione modellata: misura se il modello sbaglia *come sbagliano gli studenti* |
| Non conformi | risposte fuori protocollo o errori di rete |
| Latenza mediana | costo temporale per quesito |

## File prodotti

```
scripts/benchmark/data/dataset.json          dataset con ground truth
scripts/benchmark/data/results/<modello>-<lingua>.json   risposte grezze
scripts/benchmark/data/report.md | .tex      tabelle per il Capitolo 6
```

Le risposte grezze sono conservate integralmente: consentono l'analisi
qualitativa degli errori (§6.1.3) e la verifica a posteriori del parsing.
