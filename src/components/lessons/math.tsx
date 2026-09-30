import katex from "katex";
import { useMemo } from "react";

import "katex/dist/katex.min.css";

interface MathProps {
  /** LaTeX source without delimiters. */
  tex: string;
  /** Display mode renders centred, full-size math. */
  display?: boolean;
}

/**
 * Renders LaTeX with KaTeX. `output: "htmlAndMathml"` keeps the accessible
 * MathML tree next to the visual output, so screen readers announce the
 * formula instead of the raw glyph soup.
 */
export function Math({ tex, display = false }: MathProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        strict: false,
        output: "htmlAndMathml",
      });
    } catch {
      return null;
    }
  }, [tex, display]);

  if (html === null) {
    // Never break a lesson because of a malformed formula.
    return <code className="rounded bg-muted px-1 py-0.5 text-sm">{tex}</code>;
  }

  if (display) {
    return (
      <span
        className="block overflow-x-auto py-1 text-center"
        // eslint-disable-next-line react/no-danger -- KaTeX output, generated from local literals
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className="inline-block align-middle"
      // eslint-disable-next-line react/no-danger -- KaTeX output, generated from local literals
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Renders a string that mixes prose and inline math written between dollar
 * signs: `"la negazione di $\\forall x$ è $\\exists x$"`.
 */
export function RichText({ text }: { text: string }) {
  const parts = useMemo(() => text.split("$"), [text]);

  return (
    <>
      {parts.map((part, index) =>
        // Odd segments sit between a pair of dollar signs: those are math.
        index % 2 === 1 ? (
          <Math key={index} tex={part} />
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}
