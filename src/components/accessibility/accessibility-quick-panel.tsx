import { Link } from "@tanstack/react-router";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAccessibility } from "@/context/accessibility-context";
import { useI18n } from "@/context/i18n-context";
import type { FontSize } from "@/types/accessibility";

const sizes: FontSize[] = ["sm", "md", "lg", "xl"];

export function AccessibilityQuickPanel() {
  const { t } = useI18n();
  const { settings, update } = useAccessibility();

  const sizeLabel: Record<FontSize, string> = {
    sm: t.a11y.fontSizeSm,
    md: t.a11y.fontSizeMd,
    lg: t.a11y.fontSizeLg,
    xl: t.a11y.fontSizeXl,
  };

  return (
    <div className="space-y-4">
      <p className="font-serif text-sm font-semibold">{t.nav.quickAccessibility}</p>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="quick-dyslexia" className="text-sm">
          {t.a11y.dyslexiaFont}
        </Label>
        <Switch
          id="quick-dyslexia"
          checked={settings.dyslexiaFont}
          onCheckedChange={(v) => update("dyslexiaFont", v)}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="quick-contrast" className="text-sm">
          {t.a11y.contrast}
        </Label>
        <Switch
          id="quick-contrast"
          checked={settings.contrast === "high"}
          onCheckedChange={(v) => update("contrast", v ? "high" : "normal")}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="quick-motion" className="text-sm">
          {t.a11y.reducedMotion}
        </Label>
        <Switch
          id="quick-motion"
          checked={settings.reducedMotion}
          onCheckedChange={(v) => update("reducedMotion", v)}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">{t.a11y.fontSize}</p>
        <div role="group" aria-label={t.a11y.fontSize} className="flex gap-1">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={settings.fontSize === size}
              onClick={() => update("fontSize", size)}
              className={`min-h-11 flex-1 rounded-md border text-xs font-semibold transition-colors ${
                settings.fontSize === size
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input hover:bg-secondary"
              }`}
            >
              {sizeLabel[size]}
            </button>
          ))}
        </div>
      </div>

      <Link to="/accessibility" className="block text-sm font-medium text-primary hover:underline">
        {t.nav.openAllSettings}
      </Link>
    </div>
  );
}
