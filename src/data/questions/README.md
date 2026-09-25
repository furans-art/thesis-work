# Question seed data

Placeholder folder for TOLC-S mock/seed questions. Nothing here yet.

Planned shape (one file per section, e.g. `matematica.ts`):

```ts
import type { Question } from "@/types/question";

export const matematicaQuestions: Question[] = [
  // { id, sectionId, prompt: { it, en }, choices, correctChoiceId, explanation }
];
```

Load them through `src/services/` (never imported directly into UI components)
so the source can later be swapped for an API or database.
