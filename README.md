# TOLC-S Trainer

Study-prep web app for students preparing the **CISIA TOLC-S** admission test for
Computer Science degrees in Italy.

Thesis: _"AI as an aid for self-education: an Application tested against the CISIA
TOLC-S Test"_.

This repository currently contains the **shell**: design system, routing, layout,
i18n (Italian/English) and the full accessibility system. The simulation engine is
not implemented yet.

## Stack

- React 19 + TypeScript (strict) + Vite
- Tailwind CSS v4 + shadcn/ui
- TanStack Router (file-based routes) + TanStack Query
- i18n: hand-rolled typed dictionaries (`it` default, `en`)
- State: React Context + localStorage persistence
- Charts: Recharts (for the future admin analytics)

> Note: routing uses TanStack Router, which is fixed for this project setup. The
> route structure mirrors the intended React Router layout, so the migration
> surface stays small.

## Setup

```bash
bun install      # or: npm install
cp .env.example .env
bun run dev      # http://localhost:8080
```

Other scripts: `bun run build`, `bun run lint`, `bun run format`.

## Routes

| Path                   | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `/`                    | Landing page + CTA                         |
| `/menu`                | Main menu (Simulation / Accessibility)     |
| `/simulation`          | Section list + full exam (placeholder)     |
| `/simulation/settings` | Pre-exam settings (placeholder)            |
| `/accessibility`       | Accessibility settings, fully implemented  |
| `/admin`               | Admin analytics shell (placeholder)        |

## Project structure

```
src/
  components/
    accessibility/   accessibility panel + live preview
    layout/          header, footer, page shell
    ui/              shadcn primitives
  context/           AccessibilityProvider, I18nProvider
  data/              seed data (TOLC-S sections, questions placeholder)
  hooks/             typed hooks over services/contexts
  i18n/              it.ts, en.ts (single source of UI strings)
  routes/            file-based routes
  services/          storage + data access layer (only place touching localStorage)
  types/             typed models
  styles.css         design tokens + accessibility profiles
```

Conventions kept for a future Next.js migration:

- no direct `window` / `localStorage` access in UI components — everything goes
  through `src/services/storage.ts` and the providers
- no hardcoded UI strings in components — all copy lives in `src/i18n/`
- data access isolated in `src/services/`, typed models in `src/types/`
- no framework-specific (`next/*`) imports

## Accessibility system

Settings live in `AccessibilityProvider`, persist to `localStorage`
(`tolcs.accessibility.v1`) and are applied globally by setting data attributes on
`<html>`; `src/styles.css` maps those attributes to CSS variable overrides.

| Setting        | Attribute                                             |
| -------------- | ----------------------------------------------------- |
| Dyslexia font  | `data-dyslexia="true"` (Lexend/Atkinson, wider spacing) |
| Text size      | `data-font-size="sm\|md\|lg\|xl"`                     |
| High contrast  | `data-contrast="high"`                                |
| CVD palette    | `data-cvd="deuteranopia\|protanopia\|tritanopia"`     |
| Reduced motion | `data-reduced-motion="true"`                          |
| Theme          | `.dark` class                                         |

Adding a new profile = add a token override block in `src/styles.css` + a field in
`src/types/accessibility.ts` + a control on `/accessibility`.

## TOLC-S sections (to verify)

Mathematics, Reading comprehension, Reasoning and Problems, Basic sciences,
English — defined in `src/data/tolc-sections.ts`; question counts and timings
still need to be checked against the current official CISIA syllabus.

## Disclaimer

Independent academic project. Not affiliated with CISIA. TOLC® is a trademark of
CISIA.
