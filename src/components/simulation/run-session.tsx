import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Flag, Lightbulb, SkipForward } from "lucide-react";

import { ScopeBadge, SampleNotice } from "@/components/simulation/scope-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useI18n } from "@/context/i18n-context";
import { useRunKeyboard } from "@/hooks/use-run-keyboard";
import { useSettingsStore } from "@/hooks/use-settings-store";
import { useSimulationRun, formatClock } from "@/hooks/use-simulation-run";
import { historyService } from "@/services/history.service";
import { contentScopeService } from "@/services/content-scope.service";
import type { RunPlan } from "@/services/simulation.service";
import type { SimulationSettings, SimulationTarget } from "@/types/settings";

interface RunSessionProps {
  target: SimulationTarget | null;
  plan: RunPlan;
  settings: SimulationSettings;
  onRetry?: () => void;
}

export function RunSession({ target, plan, settings, onRetry }: RunSessionProps) {
  const { t, locale } = useI18n();
  const { refresh } = useSettingsStore();
  const run = useSimulationRun(plan, settings, (answers) => {
    if (target === null) return; // review sessions are never recorded
    historyService.addFromRun(target, settings.mode, plan, answers);
    refresh();
  });
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  useRunKeyboard(run, run.q.options.length, true);
  // ... rest of the component
