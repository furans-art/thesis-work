export type TolcSectionId =
  | "matematica"
  | "ragionamento"
  | "biologia"
  | "chimica"
  | "fisica"
  | "scienze-terra"
  | "inglese";

export type MathematicsTopicId =
  | "matematica-numeri"
  | "matematica-algebra"
  | "matematica-geometria"
  | "matematica-funzioni-grafici"
  | "matematica-combinatoria-probabilita"
  | "matematica-medie-variabilita"
  | "matematica-comprendere-rappresentare"
  | "matematica-ragionare"
  | "matematica-modellizzare-risolvere";

export type PracticeSectionId = TolcSectionId | MathematicsTopicId;

export interface TolcSection {
  id: PracticeSectionId;
  /** i18n key suffix under sections.* */
  labelKey: string;
  questionCount: number;
  durationMinutes: number;
  /** position in the official full-exam order */
  order: number;
}

export interface MathematicsTopic extends TolcSection {
  id: MathematicsTopicId;
  descriptionKey: string;
  parentId: "matematica";
}
