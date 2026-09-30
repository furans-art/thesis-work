/**
 * Theory lessons for the two active thesis modules:
 * - Mathematical logic (lessons 1–6), adapted from the lesson structure of
 *   Kevin's Webpage_Logica (lezioni/lezione-1..6.html).
 *   Original material by Kevin — https://github.com/KevinUniud/Webpage_Logica
 * - Combinatorics & probability (lessons 7–10), written for this thesis app
 *   against the official CISIA TOLC-S syllabus.
 */

export interface LessonSummary {
  id: number;
  titleKey: `lesson${number}Title`;
  summaryKey: `lesson${number}Summary`;
  bodyKey: `lesson${number}Body`;
  /** practice areas that exercise this topic */
  practiceTargets: string[];
}

export const lessons: LessonSummary[] = [
  { id: 1, titleKey: "lesson1Title", summaryKey: "lesson1Summary", bodyKey: "lesson1Body", practiceTargets: ["matematica-ragionare"] },
  { id: 2, titleKey: "lesson2Title", summaryKey: "lesson2Summary", bodyKey: "lesson2Body", practiceTargets: ["matematica-ragionare"] },
  { id: 3, titleKey: "lesson3Title", summaryKey: "lesson3Summary", bodyKey: "lesson3Body", practiceTargets: ["matematica-ragionare"] },
  { id: 4, titleKey: "lesson4Title", summaryKey: "lesson4Summary", bodyKey: "lesson4Body", practiceTargets: ["matematica-ragionare"] },
  { id: 5, titleKey: "lesson5Title", summaryKey: "lesson5Summary", bodyKey: "lesson5Body", practiceTargets: ["matematica-ragionare"] },
  { id: 6, titleKey: "lesson6Title", summaryKey: "lesson6Summary", bodyKey: "lesson6Body", practiceTargets: ["matematica-ragionare"] },
  { id: 7, titleKey: "lesson7Title", summaryKey: "lesson7Summary", bodyKey: "lesson7Body", practiceTargets: ["matematica-combinatoria-probabilita"] },
  { id: 8, titleKey: "lesson8Title", summaryKey: "lesson8Summary", bodyKey: "lesson8Body", practiceTargets: ["matematica-combinatoria-probabilita"] },
  { id: 9, titleKey: "lesson9Title", summaryKey: "lesson9Summary", bodyKey: "lesson9Body", practiceTargets: ["matematica-combinatoria-probabilita"] },
  { id: 10, titleKey: "lesson10Title", summaryKey: "lesson10Summary", bodyKey: "lesson10Body", practiceTargets: ["matematica-combinatoria-probabilita"] },
  { id: 11, titleKey: "lesson11Title", summaryKey: "lesson11Summary", bodyKey: "lesson11Body", practiceTargets: ["matematica-combinatoria-probabilita"] },
];
