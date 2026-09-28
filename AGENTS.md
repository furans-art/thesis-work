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
