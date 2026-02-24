# Health Report

TypeScript CLI tool: Fitbit API + Food Scanner data → PDF health report.

## Commands
- `npm run dev` — Generate report (tsx)
- `npm run auth` — Fitbit OAuth flow
- `npm run build` — Production build (tsup)
- `npm start` — Run production build
- `npm run typecheck` — Type check without emitting
- No test framework or linter configured — typecheck is the only validation

## Architecture
- Data flow: Fetchers → Processors → Charts → PDF sections → Puppeteer → PDF
- Charts: Chart.js + skia-canvas → base64 PNGs embedded in HTML
- Fitbit OAuth 2.0 + PKCE, tokens at `~/.config/health-report/tokens.json`
- Food Scanner: graceful degradation — returns `null` on failure, never throws
- Env: native Node 24 `process.loadEnvFile()` — do NOT add dotenv
- All fetches and chart renders run in parallel via `Promise.all()`

## Code Style
- ES modules with `.js` extensions in all relative imports (e.g., `'./config.js'`)
- Use `import type` for type-only imports
- Named exports only — no default exports

## Key Patterns
- IMPORTANT: `FoodScannerNutritionDay` flows through processors; raw API uses `FoodScannerApiResponse<FoodScannerNutritionSummary>` wrapper
- `ActivityRaw` / `BodyRaw` adapter types bridge Fitbit API kebab-case keys to clean interfaces — adapters `toActivityRaw()` / `toBodyRaw()` live in `src/index.ts`
- IMPORTANT: All Chart.js charts MUST use `animation: false`, `responsive: false` for server-side rendering
- 1-year data uses `weeklyAverage()` to reduce chart data points
- Fitbit 30-day-max endpoints (HRV, vitals, cardio) auto-chunked by fetchers
- Error pattern: `error instanceof Error ? error.message : String(error)`

## Gotchas
- FitbitClient proactively pauses when remaining API calls < 10 and retries on 429/5xx
- Token auto-refresh on 401 with 60s early expiry check — do not duplicate this logic
- `REPORT_DATE` env var overrides report date (defaults to today)
- Food Scanner URL defaults to `http://localhost:3000` — feature fully disabled if unavailable

## Subagents

| Agent | Model | Trigger | Purpose |
|-------|-------|---------|---------|
| verifier | haiku | After code changes, "check types", "verify build" | Typecheck + build validation |
| pr-creator | sonnet | User requests PR creation | Full PR workflow (branch, commit, push, PR) |
| bug-hunter | sonnet | After implementing changes, before commit | Find bugs in uncommitted changes |

## Skills

| Skill | Model | Trigger | Purpose |
|-------|-------|---------|---------|
| tools-improve | — | Creating/modifying skills, agents, or CLAUDE.md | Best practices for Claude Code extensibility |
