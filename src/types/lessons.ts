/**
 * Structured lesson content model.
 *
 * Lesson bodies are authored as a list of semantic blocks instead of one long
 * paragraph, so the reader gets headings, worked examples, truth tables and
 * "common mistake" callouts instead of a wall of text. Mathematical and logical
 * notation is written as LaTeX and rendered with KaTeX (accessible MathML +
 * visual output).
 *
 * Inline math inside any `text` field is written between dollar signs:
 *   "La negazione di $\\forall x\\, P(x)$ è $\\exists x\\, \\neg P(x)$."
 */

/** A paragraph of prose; may contain inline `$...$` math. */
export interface LessonParagraph {
  kind: "p";
  text: string;
}

/** A section heading inside the lesson body. */
export interface LessonHeading {
  kind: "h";
  text: string;
}

/** A centred, display-size formula. */
export interface LessonFormula {
  kind: "formula";
  /** LaTeX source, without delimiters. */
  tex: string;
  /** Optional caption shown under the formula. */
  caption?: string;
}

/** A bullet list; each item may contain inline `$...$` math. */
export interface LessonList {
  kind: "list";
  items: string[];
  ordered?: boolean;
}

/** A data table (truth tables, operator tables, equivalences). */
export interface LessonTable {
  kind: "table";
  caption: string;
  /** Column headers; may contain inline `$...$` math. */
  head: string[];
  /** Rows of cells; may contain inline `$...$` math. */
  rows: string[][];
}

/** A worked example, visually separated from the main exposition. */
export interface LessonExample {
  kind: "example";
  title: string;
  /** Paragraphs of the example; may contain inline `$...$` math. */
  body: string[];
  /** Optional display formula shown after the paragraphs. */
  tex?: string;
}

/** A callout for the frequent mistake or a rule worth remembering. */
export interface LessonCallout {
  kind: "callout";
  tone: "warning" | "note";
  title: string;
  body: string[];
}

export type LessonBlock =
  | LessonParagraph
  | LessonHeading
  | LessonFormula
  | LessonList
  | LessonTable
  | LessonExample
  | LessonCallout;

/** Lesson id → ordered blocks, for one locale. */
export type LessonContentMap = Record<number, LessonBlock[]>;
