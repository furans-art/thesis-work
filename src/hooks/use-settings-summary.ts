import { useI18n } from "@/context/i18n-context";
import type { SimulationSettings } from "@/types/settings";

/** "20 domande · 50 min · mescolate · tutte le difficoltà" */
export function useSettingsSummary() {
  const { t } = useI18n();
  return (s: SimulationSettings) => {
    const parts = [`${s.questionCount} ${t.common.questions}`, `${s.timeLimitMinutes} ${t.common.minutes}`];
    if (s.shuffleQuestions || s.shuffleAnswers) parts.push(t.settings.summaryShuffled);
    parts.push(t.settings.summaryDifficulty[s.difficulty]);
    return parts.join(" · ");
  };
}
