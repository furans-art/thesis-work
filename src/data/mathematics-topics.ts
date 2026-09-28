import type { MathematicsTopic } from "@/types/tolc";

/**
 * The six knowledge areas and three transversal areas in the official
 * CISIA TOLC-S 2026 Basic Mathematics syllabus.
 * Counts and times are practice defaults; CISIA defines 20 questions and
 * 50 minutes for Mathematics as a whole, not quotas for individual areas.
 */
export const mathematicsTopics: MathematicsTopic[] = [
  { id: "matematica-numeri", labelKey: "matematicaNumeri", descriptionKey: "matematicaNumeriDesc", parentId: "matematica", questionCount: 5, durationMinutes: 15, order: 1 },
  { id: "matematica-algebra", labelKey: "matematicaAlgebra", descriptionKey: "matematicaAlgebraDesc", parentId: "matematica", questionCount: 5, durationMinutes: 15, order: 2 },
  { id: "matematica-geometria", labelKey: "matematicaGeometria", descriptionKey: "matematicaGeometriaDesc", parentId: "matematica", questionCount: 5, durationMinutes: 15, order: 3 },
  { id: "matematica-funzioni-grafici", labelKey: "matematicaFunzioni", descriptionKey: "matematicaFunzioniDesc", parentId: "matematica", questionCount: 5, durationMinutes: 15, order: 4 },
  { id: "matematica-combinatoria-probabilita", labelKey: "matematicaProbabilita", descriptionKey: "matematicaProbabilitaDesc", parentId: "matematica", questionCount: 5, durationMinutes: 15, order: 5 },
  { id: "matematica-medie-variabilita", labelKey: "matematicaStatistica", descriptionKey: "matematicaStatisticaDesc", parentId: "matematica", questionCount: 5, durationMinutes: 15, order: 6 },
  { id: "matematica-comprendere-rappresentare", labelKey: "matematicaComprendere", descriptionKey: "matematicaComprendereDesc", parentId: "matematica", questionCount: 5, durationMinutes: 15, order: 7 },
  { id: "matematica-ragionare", labelKey: "matematicaRagionare", descriptionKey: "matematicaRagionareDesc", parentId: "matematica", questionCount: 5, durationMinutes: 15, order: 8 },
  { id: "matematica-modellizzare-risolvere", labelKey: "matematicaModellizzare", descriptionKey: "matematicaModellizzareDesc", parentId: "matematica", questionCount: 5, durationMinutes: 15, order: 9 },
];