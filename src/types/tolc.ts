export type TolcSectionId =
  | "matematica"
  | "comprensione-testo"
  | "ragionamento-problemi"
  | "scienze-base"
  | "inglese";

export interface TolcSection {
  id: TolcSectionId;
  /** i18n key suffix under sections.* */
  labelKey: string;
  questionCount: number;
  durationMinutes: number;
  /** position in the official full-exam order */
  order: number;
}
