import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { PageShell } from "@/components/layout/page-shell";
import { SampleNotice } from "@/components/simulation/scope-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/context/i18n-context";
import { useSectionLabel } from "@/hooks/use-section-label";
import { useSettingsForm } from "@/hooks/use-settings-form";
import { tolcSections } from "@/data/tolc-sections";
import { mathematicsTopics } from "@/data/mathematics-topics";
import { isSimulationTarget, maxQuestions, MIN_QUESTIONS } from "@/services/settings.service";
import type { ExplanationMode, SimulationMode } from "@/types/settings";

export const Route = createFileRoute("/simulation/settings/$sectionId")({
  loader: ({ params }) => {
    if (!isSimulationTarget(params.sectionId)) throw notFound();
    return { target: params.sectionId };
  },
  head: () => ({
    meta: [
      { title: "Impostazioni pre-esame — TOLC-S Trainer" },
      { name: "description", content: "Configura numero di domande, tempo, ordine e spiegazioni della simulazione." },
      { property: "og:title", content: "Impostazioni pre-esame — TOLC-S Trainer" },
      { property: "og:description", content: "Configura la simulazione TOLC-S prima di iniziare." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  notFoundComponent: SettingsNotFound,
  component: SettingsPage,
});

function SettingsNotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-14">
      <p>{t.settings.notFound}</p>
      <Button variant="outline" asChild>
        <Link to="/simulation">{t.common.back}</Link>
      </Button>
    </div>
  );
}

function SettingsPage() {
  const { target } = Route.useLoaderData();
  const { t } = useI18n();
  const label = useSectionLabel();
  const navigate = useNavigate();
  const { form, update, save } = useSettingsForm(target);

  const name =
    target === "full"
      ? t.settings.fullExam
      : label([...tolcSections, ...mathematicsTopics].find((s) => s.id === target)?.labelKey ?? target);
  const max = maxQuestions(target);

  const onSave = () => {
    save();
    toast.success(t.settings.saved);
  };
  const onSaveAndStart = () => {
    save();
    void navigate({ to: "/simulation/run/$sectionId", params: { sectionId: target } });
  };

  return (
    <PageShell title={`${t.settings.titlePrefix}: ${name}`} subtitle={t.settings.subtitle}>
      <div className="mx-0 max-w-2xl">
        <SampleNotice target={target} />
      </div>
      <Card className="max-w-2xl">
        <CardContent className="space-y-8 p-6 md:p-8">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">{t.settings.mode}</legend>
            <RadioGroup
              value={form.mode}
              onValueChange={(v) => update("mode", v as SimulationMode)}
              className="gap-3"
            >
              {(
                [
                  ["practice", t.settings.modePractice, t.settings.modePracticeHint],
                  ["exam", t.settings.modeExam, t.settings.modeExamHint],
                ] as const
              ).map(([value, text, hint]) => (
                <div key={value} className="flex items-start gap-3 rounded-md border border-border p-3">
                  <RadioGroupItem id={`mode-${value}`} value={value} aria-describedby={`mode-${value}-hint`} className="mt-1" />
                  <div>
                    <Label htmlFor={`mode-${value}`}>{text}</Label>
                    <p id={`mode-${value}-hint`} className="text-sm text-muted-foreground">{hint}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
            {form.mode === "exam" && <p className="text-sm text-muted-foreground">{t.settings.examNote}</p>}
          </fieldset>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="q-count">{t.settings.questionCount}</Label>
              <span className="font-semibold tabular-nums">{form.questionCount}</span>
            </div>
            <Slider
              id="q-count"
              min={MIN_QUESTIONS}
              max={max}
              step={1}
              value={[form.questionCount]}
              onValueChange={([v]) => update("questionCount", v ?? MIN_QUESTIONS)}
              aria-label={t.settings.questionCount}
              aria-describedby="q-count-range"
            />
            <p id="q-count-range" className="text-sm text-muted-foreground">
              {t.settings.questionRange.replace("{min}", String(MIN_QUESTIONS)).replace("{max}", String(max))}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-limit">{t.settings.timeLimit}</Label>
            <Input
              id="time-limit"
              type="number"
              min={1}
              max={300}
              className="w-32"
              value={form.timeLimitMinutes}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isFinite(n)) update("timeLimitMinutes", Math.min(300, Math.max(1, Math.round(n))));
              }}
            />
          </div>

          <ToggleRow id="shuffle-q" label={t.settings.shuffleQuestions} checked={form.shuffleQuestions} onChange={(v) => update("shuffleQuestions", v)} />
          <ToggleRow id="shuffle-a" label={t.settings.shuffleAnswers} checked={form.shuffleAnswers} onChange={(v) => update("shuffleAnswers", v)} />

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">{t.settings.explanation}</legend>
            <RadioGroup
              value={form.explanationMode}
              onValueChange={(v) => update("explanationMode", v as ExplanationMode)}
            >
              {(
                [
                  ["after-each", t.settings.explanationAfterEach],
                  ["end", t.settings.explanationEnd],
                  ["never", t.settings.explanationNever],
                ] as const
              ).map(([value, text]) => (
                <div key={value} className="flex items-center gap-3">
                  <RadioGroupItem id={`exp-${value}`} value={value} />
                  <Label htmlFor={`exp-${value}`} className="font-normal">{text}</Label>
                </div>
              ))}
            </RadioGroup>
          </fieldset>

          <ToggleRow id="show-timer" label={t.settings.showTimer} checked={form.showTimer} onChange={(v) => update("showTimer", v)} />

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
            <Button variant="outline" onClick={onSave}>{t.settings.save}</Button>
            <Button variant="accent" onClick={onSaveAndStart}>{t.settings.saveAndStart}</Button>
            <Button variant="ghost" asChild>
              <Link to="/simulation">{t.settings.cancel}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}

function ToggleRow(props: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor={props.id}>{props.label}</Label>
      <Switch id={props.id} checked={props.checked} onCheckedChange={props.onChange} />
    </div>
  );
}
