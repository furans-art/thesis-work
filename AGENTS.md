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

- Nine 2026 CISIA Basic Maths syllabus areas aggregate into the single 20-question, 50-minute Mathematics block in full exams (not separate exam sections).
- Logica: live questions from TestLogica API via server fn (`logicApi.functions.ts` -> `logicApi.server.ts`); browser never calls it (no CORS); `LOGIC_API_URL` (default trycloudflare tunnel), unreachable -> local fallback.
- Combinatoria e probabilità (20/50 min): local generation in `src/services/combinatorics/` — 24 archetypes (incl. Bayes, pigeonhole, "at least one", Trombetta: stars-and-bars, cyclic permutations, Newton binomial, inclusion-exclusion), exact reduced fractions, per-distractor diagnoses in `rationales`; wired into `buildPlan`.
- Session records store the exact questions served in `SessionRecord.snapshot`; retakes (`/simulation/retake/$sessionId`) and wrong-answer review rebuild via `buildSnapshotPlan`, never by re-reading the pool.
- Data export/import via `src/services/backup.service.ts` (format `tolcs.backup` v1, page `/admin`); only app-owned keys (`tolcs.*`, `settings:*`).
- Quiz keyboard controls (arrows / 1–4 / A–D select, Enter confirm) live in `src/hooks/use-run-keyboard.ts`; suppressed while dialogs are open or focus is in an input.
- Lessons live in `src/data/lessons.ts` (1–6 from Kevin's Webpage_Logica, 7–11 Combinatoria) with KaTeX structured bodies in `lesson-content.it/.en.ts`; grouping data-driven via `practiceTargets` in `lesson-groups.ts`; detail route `lessons_.$lessonId.tsx` (flat) so /lessons is not a layout route.
- Accessibility icon is neutral (SlidersHorizontal), never the disability icon; quick customisation in the header, full page at /accessibility only other entry point; footer links Privacy | Data | About.
- CVD palettes include achromatopsia (lightness-only, no hue); success/error must stay distinguishable by lightness in that palette.
- Socratic feedback: browser calls a local Ollama (`src/services/socratic-feedback.service.ts`, URL/model set on /admin) with the deterministic diagnosis as binding facts; outputs leaking the correct answer are discarded — the engine stays the only source of mathematical truth.
