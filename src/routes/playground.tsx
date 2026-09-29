import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpen, Play } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-context";
import { parseFormula, renderFormula, truthTable, FormulaParseError } from "@/services/truth-table.service";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Laboratorio formule — TOLC-S Trainer" },
      {
        name: "description",
        content: "Scrivi una formula logica e osserva la sua tabella di verità riga per riga.",
      },
      { property: "og:title", content: "Laboratorio formule — TOLC-S Trainer" },
      { property: "og:description", content: "Costruisci formule logiche e consulta la loro tabella di verità." },
    ],
  }),
  component: PlaygroundPage,
});

const EXAMPLES = ["p ∧ q → r", "¬(p ∧ q) ↔ (¬p ∨ ¬q)", "(p → q) ∧ p → q", "p ∨ ¬q ↔ ¬(p ∧ q)"];

function PlaygroundPage() {
  const { t } = useI18n();
  const [value, setValue] = useState(EXAMPLES[0]!);
  const [submitted, setSubmitted] = useState(EXAMPLES[0]!);
  const [error, setError] = useState(false);

  const table = useMemo(() => {
    try {
      const f = parseFormula(submitted);
      return { names: truthTable(f).names, rows: truthTable(f).rows, pretty: renderFormula(f) };
    } catch (e) {
      if (e instanceof FormulaParseError) return null;
      throw e;
    }
  }, [submitted]);

  const build = () => {
    try {
      parseFormula(value);
      setError(false);
      setSubmitted(value);
    } catch (e) {
      if (e instanceof FormulaParseError) setError(true);
      else throw e;
    }
  };

  return (
    <PageShell title={t.playground.title} subtitle={t.playground.subtitle}>
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="formula-input" className="text-base font-medium">
                {t.playground.formulaLabel}
              </Label>
              <Input
                id="formula-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && build()}
                aria-describedby="formula-hint"
                aria-invalid={error}
                className="font-mono text-base"
                placeholder="p ∧ q → r"
              />
              <p id="formula-hint" className="text-xs text-muted-foreground">
                {t.playground.formulaHint}
              </p>
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {t.playground.invalid}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={build}>
                <Play aria-hidden="true" className="size-4" />
                {t.playground.build}
              </Button>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">{t.playground.examples}:</span>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => {
                      setValue(ex);
                      setSubmitted(ex);
                      setError(false);
                    }}
                    className="rounded-full border border-input px-3 py-1 font-mono text-xs hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {table ? (
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-mono text-base">
                  {table.pretty}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {t.playground.atoms}: {table.names.join(", ")}
                </span>
              </div>
              <div role="img" aria-label={`${t.playground.tableAria}: ${table.pretty}`} className="overflow-x-auto">
                <table className="w-full text-sm tabular-nums">
                  <thead>
                    <tr className="border-b border-border text-left">
                      {table.names.map((n) => (
                        <th key={n} scope="col" className="px-3 py-2 font-semibold">
                          {n}
                        </th>
                      ))}
                      <th scope="col" className="px-3 py-2 text-right font-semibold">
                        {t.playground.result}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        {table.names.map((n) => (
                          <td key={n} className="px-3 py-2 font-mono">
                            {row.values[n] ? "V" : "F"}
                          </td>
                        ))}
                        <td className="px-3 py-2 text-right font-semibold">
                          {row.result ? t.playground.true : t.playground.false}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className="text-sm text-muted-foreground">{t.playground.emptyState}</p>
        )}

        <Button variant="ghost" asChild>
          <Link to="/lessons">
            <BookOpen aria-hidden="true" className="size-4" />
            {t.playground.goLessons}
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
