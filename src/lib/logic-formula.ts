/**
 * Renders the Prolog-style propositional formulas produced by the Logic API
 * (`imp(p,q)`, `and(p,not(q))`, ...) as standard logic typography.
 * Pure and client-safe: no network, no browser APIs.
 */

const BINARY: Record<string, string> = {
  and: "\u2227", // ∧
  or: "\u2228", // ∨
  imp: "\u2192", // →
  iff: "\u2194", // ↔
  xor: "\u2295", // ⊕
  nand: "\u2191",
  nor: "\u2193",
};

const NOT = "\u00ac"; // ¬

interface Node {
  name: string;
  args: Node[];
}

function parse(input: string, at = { i: 0 }): Node {
  const s = input;
  let name = "";
  while (at.i < s.length && /[A-Za-z0-9_]/.test(s[at.i]!)) name += s[at.i++]!;
  const node: Node = { name, args: [] };
  if (s[at.i] === "(") {
    at.i += 1;
    for (;;) {
      node.args.push(parse(s, at));
      if (s[at.i] === ",") {
        at.i += 1;
        continue;
      }
      if (s[at.i] === ")") at.i += 1;
      break;
    }
  }
  return node;
}

function render(node: Node, top = false): string {
  if (node.args.length === 0) return node.name;
  if (node.name === "not") return `${NOT}${render(node.args[0]!)}`;
  const op = BINARY[node.name];
  if (op && node.args.length === 2) {
    const body = `${render(node.args[0]!)} ${op} ${render(node.args[1]!)}`;
    return top ? body : `(${body})`;
  }
  return `${node.name}(${node.args.map((a) => render(a)).join(", ")})`;
}

/** `imp(q,imp(p,r))` -> `q → (p → r)` */
export function formatFormula(prolog: string): string {
  if (!prolog) return "";
  try {
    return render(parse(prolog.replace(/\s+/g, "")), true);
  } catch {
    return prolog;
  }
}

/** `p-true` / `q-false` -> `p = V` (it) or `p = T` (en) */
export function formatAssignment(entry: string, locale: "it" | "en"): string {
  const [name = entry, value = ""] = entry.split("-");
  const isTrue = value.toLowerCase() === "true";
  const label = locale === "it" ? (isTrue ? "V" : "F") : isTrue ? "T" : "F";
  return `${name} = ${label}`;
}
