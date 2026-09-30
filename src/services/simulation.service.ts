import { tolcSections } from "@/data/tolc-sections";
import { mathematicsTopics } from "@/data/mathematics-topics";
import { questionService, type Question } from "@/services/questionService";
import { combinatoricsService } from "@/services/combinatorics/combinatorics.service";
import type { SimulationSettings, SimulationTarget } from "@/types/settings";
import type { SessionSnapshotBlock } from "@/types/history";
import type { PracticeSectionId, TolcSection } from "@/types/tolc";

export interface RunQuestion extends Question {
  /** index of the block (section) this question belongs to */
  blockIndex: number;
}

export interface RunBlock {
  section: TolcSection;
  questions: RunQuestion[];
}

export interface RunPlan {
  blocks: RunBlock[];
  questions: RunQuestion[];
  requested: number;
  available: number;
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function shuffleOptions(q: Question): Question {
  const order = shuffle(q.options.map((_, i) => i));
  return { ...q, options: order.map((i) => q.options[i]!), correctIndex: order.indexOf(q.correctIndex) };
}

/** Split a total across sections proportionally to the official counts (largest remainder). */
function splitTotal(total: number, sections: TolcSection[]): number[] {
  const official = sections.reduce((n, s) => n + s.questionCount, 0);
  const raw = sections.map((s) => (total * s.questionCount) / official);
  const counts = raw.map(Math.floor);
  let left = total - counts.reduce((a, b) => a + b, 0);
  const byRemainder = raw.map((r, i) => ({ i, r: r - Math.floor(r) })).sort((a, b) => b.r - a.r);
  for (const { i } of byRemainder) {
    if (left <= 0) break;
    counts[i]! += 1;
    left -= 1;
  }
  return counts;
}

function toBlocks(picked: { section: TolcSection; questions: Question[] }[]): RunBlock[] {
  return picked
    .filter((b) => b.questions.length > 0)
    .map((b, blockIndex) => ({
      section: b.section,
      questions: b.questions.map((q) => ({ ...q, blockIndex })),
    }));
}

export const simulationService = {
  /** Practice plan made only of the given question ids, in official section order. */
  buildReviewPlan(questionIds: string[]): RunPlan {
    const ids = new Set(questionIds);
    const blocks = toBlocks(
      [...tolcSections]
        .sort((a, b) => a.order - b.order)
        .map((section) => ({
          section,
          questions: questionService.getBySection(section.id).filter((q) => ids.has(q.id)),
        })),
    );
    const questions = blocks.flatMap((b) => b.questions);
    return { blocks, questions, requested: questions.length, available: questions.length };
  },

  /**
   * Exact replay of a stored session: rebuilds the plan from the snapshot of
   * questions actually served, so live API-generated questions can be retaken too.
   */
  buildSnapshotPlan(snapshot: SessionSnapshotBlock[]): RunPlan | null {
    const byId = new Map(
      [...tolcSections, ...mathematicsTopics].map((s) => [s.id, s] as const),
    );
    const blocks = toBlocks(
      snapshot
        .filter((b) => byId.has(b.sectionId) && b.questions.length > 0)
        .map((b) => ({ section: byId.get(b.sectionId)!, questions: b.questions })),
    );
    const questions = blocks.flatMap((b) => b.questions);
    if (questions.length === 0) return null;
    return { blocks, questions, requested: questions.length, available: questions.length };
  },



  buildPlan(
    target: SimulationTarget,
    settings: SimulationSettings,
    /** Questions from an external source (e.g. the Logic API), by section id. */
    extraQuestions: Partial<Record<PracticeSectionId, Question[]>> = {},
  ): RunPlan {
    const sections =
      target === "full"
        ? [...tolcSections].sort((a, b) => a.order - b.order)
        : [...tolcSections, ...mathematicsTopics].filter((s) => s.id === target);
    const wanted =
      target === "full" ? splitTotal(settings.questionCount, sections) : [settings.questionCount];

    const blocks: RunBlock[] = sections
      .map((section, idx) => {
        const external = extraQuestions[section.id];
        let pool =
          external && external.length > 0
            ? external
            : combinatoricsService.isEnabled(section.id)
              ? combinatoricsService.generateQuestions(section.id, wanted[idx] ?? 0)
              : questionService.getBySection(section.id);
        if (settings.shuffleQuestions) pool = shuffle(pool);
        if (settings.shuffleAnswers) pool = pool.map(shuffleOptions);
        return { section, picked: pool.slice(0, wanted[idx] ?? 0) };
      })
      .filter((b) => b.picked.length > 0)
      .map((b, blockIndex) => ({
        section: b.section,
        questions: b.picked.map((q) => ({ ...q, blockIndex })),
      }));

    const questions = blocks.flatMap((b) => b.questions);
    return { blocks, questions, requested: settings.questionCount, available: questions.length };
  },
};
