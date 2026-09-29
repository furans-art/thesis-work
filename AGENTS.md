<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Treat the nine official 2026 CISIA Basic Mathematics syllabus areas as practice targets, but aggregate them into the single 20-question, 50-minute Mathematics block in full exams because the syllabus areas are not separate exam sections.
- The Mathematical logic module fetches live questions from the TestLogica API (API_Logica) through a server function (`src/services/logicApi.functions.ts` -> `logicApi.server.ts`); the browser never calls the API directly because the FastAPI backend sends no CORS headers. The base URL lives in `LOGIC_API_URL` (default: the current trycloudflare tunnel); when unreachable, fall back to local sample questions.
- Session records store a `snapshot` (the exact questions served, including API-generated ones) in `SessionRecord.snapshot`; retakes (`/simulation/retake/$sessionId`) and wrong-answer review rebuild the plan from the snapshot via `buildSnapshotPlan`, never by re-reading the local pool.
- All data export/import goes through `src/services/backup.service.ts` (format `tolcs.backup` v1) on the Data page (`/admin`); it only accepts app-owned keys (`tolcs.*`, `settings:*`).
- Quiz keyboard controls (arrows / 1–4 / A–D to select, Enter to confirm and advance) live in `src/hooks/use-run-keyboard.ts` and are suppressed while dialogs are open or focus is in an input.
- Theory lessons come from `src/data/lessons.ts` (adapted from Kevin's Webpage_Logica, 6 lessons credited); the lesson detail route is `lessons_.$lessonId.tsx` (flat, not nested under /lessons) so the list page is not turned into a layout route.
- The accessibility icon is neutral (SlidersHorizontal), never the disability icon; quick customisation lives in the header, the full page at /accessibility is the only other entry point, and the footer links Privacy | Data | About.
- CVD palettes include achromatopsia (lightness-only, no hue); success/error must stay distinguishable by lightness in that palette.
