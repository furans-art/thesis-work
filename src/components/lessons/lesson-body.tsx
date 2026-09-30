import { AlertTriangle, Info, Lightbulb } from "lucide-react";

import { Math, RichText } from "@/components/lessons/math";
import type { LessonBlock } from "@/types/lessons";

/**
 * Renders the structured blocks of a lesson: readable measure, clear headings,
 * display formulas, accessible tables and separated callouts.
 */
export function LessonBody({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, index) => (
        <LessonBlockView key={index} block={block} />
      ))}
    </div>
  );
}

function LessonBlockView({ block }: { block: LessonBlock }) {
  switch (block.kind) {
    case "h":
      return (
        <h2 className="mt-2 font-serif text-xl font-semibold tracking-tight text-foreground">
          <RichText text={block.text} />
        </h2>
      );

    case "p":
      return (
        <p className="max-w-prose text-[1.0625rem] leading-[1.85] text-foreground/90">
          <RichText text={block.text} />
        </p>
      );

    case "formula":
      return (
        <figure className="rounded-lg border border-border bg-surface px-4 py-4">
          <Math tex={block.tex} display />
          {block.caption !== undefined && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              <RichText text={block.caption} />
            </figcaption>
          )}
        </figure>
      );

    case "list":
      return block.ordered === true ? (
        <ol className="max-w-prose list-decimal space-y-2 pl-6 text-[1.0625rem] leading-[1.8] text-foreground/90">
          {block.items.map((item, index) => (
            <li key={index}>
              <RichText text={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="max-w-prose list-disc space-y-2 pl-6 text-[1.0625rem] leading-[1.8] text-foreground/90">
          {block.items.map((item, index) => (
            <li key={index}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );

    case "table":
      return (
        <figure className="flex flex-col gap-2">
          <figcaption className="text-sm font-semibold text-muted-foreground">
            {block.caption}
          </figcaption>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">{block.caption}</caption>
              <thead className="bg-secondary">
                <tr>
                  {block.head.map((cell, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="border-b border-border px-4 py-2.5 text-left font-semibold"
                    >
                      <RichText text={cell} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="even:bg-muted/40">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border-t border-border px-4 py-2.5">
                        <RichText text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );

    case "example":
      return (
        <section className="rounded-lg border border-primary/25 bg-primary/5 p-5">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Lightbulb aria-hidden="true" className="size-4 shrink-0 text-primary" />
            <RichText text={block.title} />
          </h3>
          <div className="mt-2 flex flex-col gap-2">
            {block.body.map((paragraph, index) => (
              <p key={index} className="max-w-prose leading-[1.8] text-foreground/90">
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
          {block.tex !== undefined && (
            <div className="mt-3">
              <Math tex={block.tex} display />
            </div>
          )}
        </section>
      );

    case "callout": {
      const isWarning = block.tone === "warning";
      const Icon = isWarning ? AlertTriangle : Info;

      return (
        <aside
          className={
            isWarning
              ? "rounded-lg border-l-4 border-l-accent border-y border-r border-border bg-accent/10 p-5"
              : "rounded-lg border-l-4 border-l-primary border-y border-r border-border bg-surface p-5"
          }
        >
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            <RichText text={block.title} />
          </h3>
          <div className="mt-2 flex flex-col gap-2">
            {block.body.map((paragraph, index) => (
              <p key={index} className="max-w-prose leading-[1.8] text-foreground/90">
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
        </aside>
      );
    }
  }
}
