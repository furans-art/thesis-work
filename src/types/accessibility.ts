export type FontSize = "sm" | "md" | "lg" | "xl";
export type ContrastMode = "normal" | "high";
export type CvdPalette = "none" | "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia";
export type ThemeMode = "light" | "dark";

export interface AccessibilitySettings {
  dyslexiaFont: boolean;
  fontSize: FontSize;
  contrast: ContrastMode;
  cvdPalette: CvdPalette;
  reducedMotion: boolean;
  theme: ThemeMode;
}

export const defaultAccessibilitySettings: AccessibilitySettings = {
  dyslexiaFont: false,
  fontSize: "md",
  contrast: "normal",
  cvdPalette: "none",
  reducedMotion: false,
  theme: "light",
};
