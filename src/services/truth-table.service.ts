/**
 * Pure truth-table engine for the formula playground ("Laboratorio di logica",
 * inspired by the sandbox area of Kevin's Webpage_Logica). Client-safe.
 */

export type Formula = {
  kind: "atom";
  name: string;
} | {
  kind: "not";
  arg: Formula;
} | {
  kind: "binary";
  op: "and" | "or" | "imp" | "iff";
  left: Formula;
  right: Formula;
};

export class FormulaParseError extends Error {}

/**
 * Parses a friendly infix formula: p ∧ q → r, using ∧ & * for AND,
 * ∨ | + for OR, → -> for implication, ↔ <-> for biconditional, ¬ ! ~ for NOT.
 */
export function parseFormula(input: string): Formula {
  let s = input.replace(/\s+/g, "");
  if (!s) throw new FormulaParseError("empty");
  s = s
    .replace(/∧/g, "&")
    .replace(/∨/g, "|")
    .replace(/→/g, "->")
    .replace(/↔/g, "<->")
    .replace(/¬/g, "!")
    .replace(/\*/g, "&")
    .replace(/\+/g, "|")
    .replace(/~/g, "!");
  const pos = { i: 0 };
  const f = parseOr(s, pos);
  if (pos.i < s.length) throw new FormulaParseError("trailing");
  return f;
}

function parseOr(s: string, pos: { i: number }): Formula {
  let left = parseAnd(s, pos);
  while (s.slice(pos.i).startsWith("<->")) {
    pos.i += 3;
    const right = parseAnd(s, pos);
    left = { kind: "binary", op: "iff", left, right };
  }
  while (s[pos.i] === "|") {
    pos.i += 1;
    const right = parseAnd(s, pos);
    left = { kind: "binary", op: "or", left, right };
  }
  return left;
}

function parseAnd(s: string, pos: { i: number }): Formula {
  let left = parseUnary(s, pos);
  while (s.slice(pos.i).startsWith("->") || s[pos.i] === "&") {
    const op = s.slice(pos.i).startsWith("->") ? "imp" : "and";
    pos.i += op === "imp" ? 2 : 1;
    const right = parseUnary(s, pos);
    left = { kind: "binary", op, left, right };
  }
  return left;
}

function parseUnary(s: string, pos: { i: number }): Formula {
  if (s[pos.i] === "!") {
    pos.i += 1;
    return { kind: "not", arg: parseUnary(s, pos) };
  }
  if (s[pos.i] === "(") {
    pos.i += 1;
    const f = parseOr(s, pos);
    if (s[pos.i] !== ")") throw new FormulaParseError("unclosed");
    pos.i += 1;
    return f;
  }
  let name = "";
  while (pos.i < s.length && /[A-Za-z0-9_]/.test(s[pos.i]!)) name += s[pos.i++]!;
  if (!name) throw new FormulaParseError("unexpected");
  return { kind: "atom", name };
}

export function atoms(f: Formula): string[] {
  switch (f.kind) {
    case "atom":
      return [f.name];
    case "not":
      return atoms(f.arg);
    case "binary":
      return [...atoms(f.left), ...atoms(f.right)];
  }
}

export function evaluate(f: Formula, env: Record<string, boolean>): boolean {
  switch (f.kind) {
    case "atom":
      return env[f.name] === true;
    case "not":
      return !evaluate(f.arg, env);
    case "binary": {
      const a = evaluate(f.left, env);
      const b = evaluate(f.right, env);
      if (f.op === "and") return a && b;
      if (f.op === "or") return a || b;
      if (f.op === "imp") return !a || b;
      return a === b;
    }
  }
}

type BinaryOp = "and" | "or" | "imp" | "iff";

export const OP_LABEL: Record<BinaryOp, string> = {
  and: "∧",
  or: "∨",
  imp: "→",
  iff: "↔",
};

/** Renders a parsed formula back to standard logic typography. */
export function renderFormula(f: Formula, top = true): string {
  switch (f.kind) {
    case "atom":
      return f.name;
    case "not":
      return `¬${renderFormula(f.arg, false)}`;
    case "binary": {
      const body = `${renderFormula(f.left, false)} ${OP_LABEL[f.op]} ${renderFormula(f.right, false)}`;
      return top ? body : `(${body})`;
    }
  }
}

export interface TruthRow {
  values: Record<string, boolean>;
  result: boolean;
}

/** All rows of the truth table, atoms sorted alphabetically for stability. */
export function truthTable(f: Formula): { names: string[]; rows: TruthRow[] } {
  const names = Array.from(new Set(atoms(f))).sort();
  const rows: TruthRow[] = [];
  const total = 2 ** names.length;
  for (let i = 0; i < total; i += 1) {
    const values: Record<string, boolean> = {};
    names.forEach((n, bit) => {
      values[n] = ((i >> (names.length - 1 - bit)) & 1) === 1;
    });
    rows.push({ values, result: evaluate(f, values) });
  }
  return { names, rows };
}
