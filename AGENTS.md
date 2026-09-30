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

- Nine official 2026 CISIA Basic Mathematics syllabus areas are practice targets, aggregated into the single 20-question, 50-minute Mathematics block in full exams (they are not separate exam sections).
- Logica module: live questions from TestLogica API via server fn (`logicApi.functions.ts` -> `logicApi.server.ts`); browser never calls it directly (no CORS); `LOGIC_API_URL` (default trycloudflare tunnel), unreachable -> local fallback.
- Combinatoria e probabilità (default 20/50 min): fully local generation in `src/services/combinatorics/` — 20 archetypes (incl. Bayes/total probability, pigeonhole, "at least one", positional constraints), exact reduced fractions, per-distractor error diagnoses in `rationales`; wired into `buildPlan` for snapshots/retakes.
- Session records store a `snapshot` (the exact questions served) in `SessionRecord.snapshot`; retakes (`/simulation/retake/$sessionId`) and wrong-answer review rebuild via `buildSnapshotPlan`, never by re-reading the pool.
- Data export/import goes through `src/services/backup.service.ts` (format `tolcs.backup` v1, page `/admin`); only app-owned keys (`tolcs.*`, `settings:*`).
- Quiz keyboard controls (arrows / 1–4 / A–D to select, Enter to confirm and advance) live in `src/hooks/use-run-keyboard.ts`; suppressed while dialogs are open or focus is in an input.
- Theory lessons live in `src/data/lessons.ts` (1–6 adapted from Kevin's Webpage_Logica for Logica matematica, 7–10 for Combinatoria e probabilità); grouping is data-driven via `practiceTargets` in `lesson-groups.ts`; detail route `lessons_.$lessonId.tsx` (flat) so /lessons is not a layout route.
- The accessibility icon is neutral (SlidersHorizontal), never the disability icon; quick customisation lives in the header, the full page at /accessibility is the only other entry point, and the footer links Privacy | Data | About.
- CVD palettes include achromatopsia (lightness-only, no hue); success/error must stay distinguishable by lightness in that palette.
Benchmark tooling: scripts/benchmark/ (dataset deterministico, runner LLM, metriche) è fuori dall'app; usa solo bun. Non toccare il motore a 24 archetipi.
