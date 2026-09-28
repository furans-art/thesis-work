import { tolcSections } from "@/data/tolc-sections";
import { questionService, type Question } from "@/services/questionService";
import type { SimulationSettings, SimulationTarget } from "@/types/settings";
import type { TolcSection } from "@/types/tolc";

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

export const simulationService = {
  buildPlan(target: SimulationTarget, settings: SimulationSettings): RunPlan {
    const sections =
      target === "full"
        ? [...tolcSections].sort((a, b) => a.order - b.order)
        : tolcSections.filter((s) => s.id === target);
    const wanted =
      target === "full" ? splitTotal(settings.questionCount, sections) : [settings.questionCount];

    const blocks: RunBlock[] = sections
      .map((section, idx) => {
        let pool = questionService.getBySection(section.id);
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
