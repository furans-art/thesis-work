/**
 * Theory lessons for the Mathematical logic module, adapted from the lesson
 * structure of Kevin's Webpage_Logica (lezioni/lezione-1..6.html).
 * Original material by Kevin — https://github.com/KevinUniud/Webpage_Logica
 */

export interface LessonSummary {
  id: number;
  titleKey: `lesson${number}Title`;
  summaryKey: `lesson${number}Summary`;
  bodyKey: `lesson${number}Body`;
  /** API_Logica generator families that exercise this topic */
  practiceTargets: string[];
}

export const lessons: LessonSummary[] = [
  { id: 1, titleKey: "lesson1Title", summaryKey: "lesson1Summary", bodyKey: "lesson1Body", practiceTargets: ["matematica-ragionare"] },
  { id: 2, titleKey: "lesson2Title", summaryKey: "lesson2Summary", bodyKey: "lesson2Body", practiceTargets: ["matematica-ragionare"] },
  { id: 3, titleKey: "lesson3Title", summaryKey: "lesson3Summary", bodyKey: "lesson3Body", practiceTargets: ["matematica-ragionare"] },
  { id: 4, titleKey: "lesson4Title", summaryKey: "lesson4Summary", bodyKey: "lesson4Body", practiceTargets: ["matematica-ragionare"] },
  { id: 5, titleKey: "lesson5Title", summaryKey: "lesson5Summary", bodyKey: "lesson5Body", practiceTargets: ["matematica-ragionare"] },
  { id: 6, titleKey: "lesson6Title", summaryKey: "lesson6Summary", bodyKey: "lesson6Body", practiceTargets: ["matematica-ragionare"] },
];
