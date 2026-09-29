/**
 * Theory lessons for the Mathematical logic module, adapted from the lesson
 * structure of Kevin's Webpage_Logica (lezioni/lezione-1..6.html).
 * Original material by Kevin — https://github.com/KevinUniud/Webpage_Logica
 */

export interface LessonSummary {
  id: number;
  titleKey: LessonTitleKey;
  summaryKey: LessonSummaryKey;
  /** API_Logica generator families that exercise this topic */
  practiceTargets: string[];
}

type LessonTitleKey = `lesson${number}Title`;
type LessonSummaryKey = `lesson${number}Summary`;

export const lessons: LessonSummary[] = [
  {
    id: 1,
    titleKey: "lesson1Title",
    summaryKey: "lesson1Summary",
    practiceTargets: ["matematica-ragionare"],
  },
  {
    id: 2,
    titleKey: "lesson2Title",
    summaryKey: "lesson2Summary",
    practiceTargets: ["matematica-ragionare"],
  },
  {
    id: 3,
    titleKey: "lesson3Title",
    summaryKey: "lesson3Summary",
    practiceTargets: ["matematica-ragionare"],
  },
  {
    id: 4,
    titleKey: "lesson4Title",
    summaryKey: "lesson4Summary",
    practiceTargets: ["matematica-ragionare"],
  },
  {
    id: 5,
    titleKey: "lesson5Title",
    summaryKey: "lesson5Summary",
    practiceTargets: ["matematica-ragionare"],
  },
  {
    id: 6,
    titleKey: "lesson6Title",
    summaryKey: "lesson6Summary",
    practiceTargets: ["matematica-ragionare"],
  },
];
