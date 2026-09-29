import { lessons } from "./lessons";
import { mathematicsTopics } from "./mathematics-topics";
import { tolcSections } from "./tolc-sections";
import type { PracticeSectionId } from "@/types/tolc";

/**
 * Theory index organised by TOLC-S section, mirroring the taxonomy used by the
 * simulation pages. Only the Mathematical logic module currently ships lessons
 * (adapted from Kevin's Webpage_Logica); every other area is listed with its
 * official syllabus outline so the structure of the test stays visible.
 */
export interface LessonTopicEntry {
  /** Practice target id, used for the "practise this area" link and scope badge. */
  id: PracticeSectionId;
  /** Key inside t.sections. */
  labelKey: string;
  /** Key inside t.sections for mathematics areas, else null. */
  descriptionKey: string | null;
  /** Key inside t.lessonOutline for whole sections, else null. */
  outlineKey: string | null;
  lessonIds: number[];
}

export interface LessonSectionGroup {
  sectionId: PracticeSectionId;
  labelKey: string;
  topics: LessonTopicEntry[];
}

/** The only area with fully developed theory so far. */
const LESSONS_TOPIC_ID = "matematica-ragionare" satisfies PracticeSectionId;

const mathematicsGroup: LessonSectionGroup = {
  sectionId: "matematica",
  labelKey: "matematica",
  topics: mathematicsTopics.map((topic) => ({
    id: topic.id,
    labelKey: topic.labelKey,
    descriptionKey: topic.descriptionKey,
    outlineKey: null,
    lessonIds: topic.id === LESSONS_TOPIC_ID ? lessons.map((lesson) => lesson.id) : [],
  })),
};

export const lessonGroups: LessonSectionGroup[] = [
  mathematicsGroup,
  ...tolcSections
    .filter((section) => section.id !== "matematica")
    .map((section) => ({
      sectionId: section.id,
      labelKey: section.labelKey,
      topics: [
        {
          id: section.id,
          labelKey: section.labelKey,
          descriptionKey: null,
          outlineKey: section.labelKey,
          lessonIds: [],
        },
      ],
    })),
];
