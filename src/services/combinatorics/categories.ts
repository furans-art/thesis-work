/**
 * Single source of truth for the seven reporting categories used by the
 * benchmark, the catalog export and any per-category statistic.
 */
export const REPORTING_CATEGORIES = {
  disposizioni: [
    "disposizioni-semplici-codice",
    "disposizioni-ripetizione-targa",
    "disposizioni-podio",
    "disposizioni-vincolo-posizione",
  ],
  permutazioni: [
    "permutazioni-semplici-anagrammi",
    "permutazioni-ripetizione-anagrammi",
    "permutazioni-vincolo-vicinanza",
  ],
  combinazioni: [
    "combinazioni-semplici-commissione",
    "combinazioni-sottoinsiemi",
    "combinazioni-quote-gruppi",
    "combinazioni-diagonali-poligono",
  ],
  urne: [
    "urna-senza-reimmissione-entrambe-rosse",
    "urna-senza-reimmissione-stesso-colore",
    "urna-almeno-uno",
  ],
  "probabilita-elementare": [
    "probabilita-dadi-somma",
    "probabilita-unione-eventi",
    "probabilita-almeno-uno",
  ],
  "probabilita-avanzata": [
    "probabilita-totale-bayes",
    "bernoulli-esattamente-k",
    "principio-cassetti-dirichlet",
  ],
  trombetta: [
    "distribuzione-oggetti-stelle-barre",
    "permutazioni-cicliche",
    "binomio-newton",
    "inclusione-esclusione",
  ],
} as const satisfies Record<string, readonly string[]>;

export type ReportingCategory = keyof typeof REPORTING_CATEGORIES;

export const CATEGORY_IDS = Object.keys(REPORTING_CATEGORIES) as ReportingCategory[];

const CATEGORY_OF = new Map<string, ReportingCategory>();
for (const id of CATEGORY_IDS) for (const a of REPORTING_CATEGORIES[id]) CATEGORY_OF.set(a, id);

export function categoryOf(archetypeId: string): ReportingCategory {
  const c = CATEGORY_OF.get(archetypeId);
  if (!c) throw new Error(`archetype without reporting category: ${archetypeId}`);
  return c;
}
