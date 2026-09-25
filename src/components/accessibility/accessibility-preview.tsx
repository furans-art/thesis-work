import { Check, Circle, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";

export function AccessibilityPreview() {
  const { t } = useI18n();
  const choices = t.a11y.previewChoices;

  const states = [
    {
      icon: Check,
      label: t.a11y.previewCorrect,
      className: "border-success bg-success/10 text-success",
    },
    {
      icon: X,
      label: t.a11y.previewWrong,
      className: "border-destructive bg-destructive/10 text-destructive",
    },
    {
      icon: Circle,
      label: t.a11y.previewNeutral,
      className: "border-border bg-muted text-muted-foreground",
    },
  ];

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-serif text-lg">{t.a11y.preview}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            {t.a11y.previewHeading}
          </p>
          <p className="mt-2 text-base">{t.a11y.previewQuestion}</p>
        </div>

        <ul className="space-y-2">
          {choices.map((choice, index) => (
            <li
              key={choice}
              className={`flex items-center gap-3 rounded-md border px-4 py-3 text-sm ${
                index === 1
                  ? "border-success bg-success/10 font-semibold"
                  : "border-border bg-background"
              }`}
            >
              <span className="font-mono text-xs text-muted-foreground">
                {String.fromCharCode(65 + index)}
              </span>
              {choice}
            </li>
          ))}
        </ul>

        <ul className="space-y-2">
          {states.map(({ icon: Icon, label, className }) => (
            <li
              key={label}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${className}`}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
