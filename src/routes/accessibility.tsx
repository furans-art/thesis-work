import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";

import { AccessibilityPreview } from "@/components/accessibility/accessibility-preview";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAccessibility } from "@/context/accessibility-context";
import { useI18n } from "@/context/i18n-context";
import type { CvdPalette, FontSize } from "@/types/accessibility";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Impostazioni di accessibilità — TOLC-S Trainer" },
      {
        name: "description",
        content:
          "Font per dislessia, contrasto elevato, palette per daltonismo, scala del testo e riduzione del movimento.",
      },
      { property: "og:title", content: "Impostazioni di accessibilità — TOLC-S Trainer" },
      {
        property: "og:description",
        content:
          "Personalizza lettura, contrasto e colori dell'applicazione di preparazione al TOLC-S.",
      },
    ],
  }),
  component: AccessibilityPage,
});

function ToggleRow({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div className="max-w-md">
        <Label htmlFor={id} className="text-base font-medium">
          {label}
        </Label>
        <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} aria-describedby={`${id}-hint`} />
    </div>
  );
}

function AccessibilityPage() {
  const { t } = useI18n();
  const { settings, update, reset } = useAccessibility();

  const fontSizes: { value: FontSize; label: string }[] = [
    { value: "sm", label: t.a11y.fontSizeSm },
    { value: "md", label: t.a11y.fontSizeMd },
    { value: "lg", label: t.a11y.fontSizeLg },
    { value: "xl", label: t.a11y.fontSizeXl },
  ];

  const palettes: { value: CvdPalette; label: string }[] = [
    { value: "none", label: t.a11y.cvdNone },
    { value: "deuteranopia", label: t.a11y.cvdDeuteranopia },
    { value: "protanopia", label: t.a11y.cvdProtanopia },
    { value: "tritanopia", label: t.a11y.cvdTritanopia },
    { value: "achromatopsia", label: t.a11y.cvdAchromatopsia },
  ];

  return (
    <PageShell title={t.a11y.title} subtitle={t.a11y.subtitle}>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">{t.a11y.reading}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ToggleRow
                id="dyslexia-font"
                label={t.a11y.dyslexiaFont}
                hint={t.a11y.dyslexiaFontHint}
                checked={settings.dyslexiaFont}
                onChange={(v) => update("dyslexiaFont", v)}
              />
              <Separator />
              <fieldset className="py-4">
                <legend className="text-base font-medium">{t.a11y.fontSize}</legend>
                <p className="mt-1 text-sm text-muted-foreground">{t.a11y.fontSizeHint}</p>
                <RadioGroup
                  value={settings.fontSize}
                  onValueChange={(v) => update("fontSize", v as FontSize)}
                  className="mt-4 grid gap-3 sm:grid-cols-2"
                >
                  {fontSizes.map((option) => (
                    <div key={option.value} className="flex items-center gap-3">
                      <RadioGroupItem id={`size-${option.value}`} value={option.value} />
                      <Label htmlFor={`size-${option.value}`} className="text-sm font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </fieldset>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">{t.a11y.colors}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ToggleRow
                id="high-contrast"
                label={t.a11y.contrast}
                hint={t.a11y.contrastHint}
                checked={settings.contrast === "high"}
                onChange={(v) => update("contrast", v ? "high" : "normal")}
              />
              <Separator />
              <ToggleRow
                id="dark-theme"
                label={t.nav.themeDark}
                hint={t.a11y.theme}
                checked={settings.theme === "dark"}
                onChange={(v) => update("theme", v ? "dark" : "light")}
              />
              <Separator />
              <fieldset className="py-4">
                <legend className="text-base font-medium">{t.a11y.cvd}</legend>
                <p className="mt-1 text-sm text-muted-foreground">{t.a11y.cvdHint}</p>
                <RadioGroup
                  value={settings.cvdPalette}
                  onValueChange={(v) => update("cvdPalette", v as CvdPalette)}
                  className="mt-4 grid gap-3 sm:grid-cols-2"
                >
                  {palettes.map((option) => (
                    <div key={option.value} className="flex items-center gap-3">
                      <RadioGroupItem id={`cvd-${option.value}`} value={option.value} />
                      <Label htmlFor={`cvd-${option.value}`} className="text-sm font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </fieldset>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">{t.a11y.motion}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ToggleRow
                id="reduced-motion"
                label={t.a11y.reducedMotion}
                hint={t.a11y.reducedMotionHint}
                checked={settings.reducedMotion}
                onChange={(v) => update("reducedMotion", v)}
              />
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center gap-4">
            <Button variant="outline" onClick={reset}>
              <RotateCcw aria-hidden="true" />
              {t.a11y.resetAll}
            </Button>
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {t.a11y.saved}
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AccessibilityPreview />
        </aside>
      </div>
    </PageShell>
  );
}
