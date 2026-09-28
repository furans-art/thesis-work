export type TolcSectionId =
  | "matematica"
  | "ragionamento"
  | "biologia"
  | "chimica"
  | "fisica"
  | "scienze-terra"
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
