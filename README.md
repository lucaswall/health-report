# Health Report PDF Generator

A TypeScript CLI tool that generates a professional PDF health report by pulling data from the **Fitbit API** and a local **Food Scanner** app. The report includes 30-day detailed views and 1-year historical trends across 10 health sections.

## Report Sections

1. **Header & Summary** — Patient info, date ranges, auto-generated key highlights
2. **Activity & Steps** — Daily steps, calories burned, active minutes, distance
3. **Exercise / Workouts** — Exercise log, frequency by type, duration totals
4. **Heart Health** — Resting HR trend, HRV trend, HR zone time distribution
5. **Sleep** — Duration, efficiency, stage breakdown (deep/light/REM/wake)
6. **Body Composition** — Weight trend, BMI, body fat %
7. **Vitals** — SpO2, breathing rate, skin temperature variation
8. **Cardio Fitness** — VO2 Max trend
9. **Nutrition** — Calorie intake, protein/carbs/fat breakdown, fiber, sodium
10. **Fasting** — Eating windows, fasting duration patterns

Each section shows **30-day detail** with charts and stats alongside **1-year historical** trends.

## Tech Stack

| Component | Choice |
|-----------|--------|
| Runtime | Node.js 24 (ES modules) |
| Language | TypeScript 5.9 (strict) |
| PDF | Puppeteer (HTML → A4 PDF) |
| Charts | Chart.js 4 + skia-canvas (server-side PNG rendering) |
| Build | tsup (production) / tsx (dev) |
| Auth | OAuth 2.0 + PKCE (Fitbit Personal app) |

## Prerequisites

- **Node.js 24+**
- A **Fitbit developer account** with a Personal app registered at [dev.fitbit.com/apps/new](https://dev.fitbit.com/apps/new)
  - OAuth 2.0 Application Type: **Personal**
  - Callback URL: `http://localhost:9876/callback`
- *(Optional)* A running [Food Scanner](https://github.com/your-org/food-scanner) instance with an API key

## Setup

1. **Clone and install:**

   ```bash
   git clone <repo-url> health-report
   cd health-report
   npm install
   ```

2. **Configure environment:**

   ```bash
   cp .env.sample .env
   ```

   Edit `.env` with your credentials:

   ```env
   FITBIT_CLIENT_ID=your_client_id
   FITBIT_CLIENT_SECRET=your_client_secret

   # Optional — Food Scanner
   FOOD_SCANNER_URL=http://localhost:3000
   FOOD_SCANNER_API_KEY=your_api_key

   # Optional — Override report end date (default: today)
   # REPORT_DATE=2026-02-23
   ```

3. **Authenticate with Fitbit:**

   ```bash
   npm run auth
   ```

   This opens your browser to complete the Fitbit OAuth flow. Tokens are saved to `~/.config/health-report/tokens.json` and automatically refresh when expired.

## Usage

### Generate a report (development)

```bash
npm run dev
```

### Generate a report (production)

```bash
npm run build
npm start
```

The PDF is written to `./output/health-report-YYYY-MM-DD.pdf`.

### Override report date

```bash
REPORT_DATE=2026-01-15 npm run dev
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Generate report using tsx (dev mode) |
| `npm run auth` | Run Fitbit OAuth 2.0 + PKCE flow |
| `npm run build` | Production build with tsup |
| `npm start` | Run production build |
| `npm run typecheck` | Type check without emitting |

## Architecture

```
Fitbit API ──┐                                   ┌── Chart PNGs (base64)
             ├→ fetch-all.ts → processors/*.ts →──┤
Food Scanner ┘                                    └── Stats / tables
                                                          │
                                                          ▼
                                              pdf/sections/*.ts → HTML
                                                          │
                                                          ▼
                                              pdf/template.ts → full HTML doc
                                                          │
                                                          ▼
                                              Puppeteer → PDF → output/
```

### Project Structure

```
src/
  index.ts                  # CLI entry point — orchestrates full pipeline
  config.ts                 # Env loading, validation, constants
  auth/                     # OAuth 2.0 + PKCE flow, token persistence
  fetchers/                 # Fitbit API client, data fetchers, Food Scanner client
  processors/               # Transform raw data → report-ready structures
  charts/                   # Chart.js + skia-canvas → base64 PNG renderers
  pdf/
    styles.ts               # Professional medical report CSS
    helpers.ts              # Shared HTML helpers (stat cards, trend badges, etc.)
    template.ts             # Compose all sections into full HTML document
    render-pdf.ts           # Puppeteer HTML → PDF
    sections/               # HTML template per report section
  types/                    # TypeScript type definitions
```

## Fitbit API Notes

- **Scopes:** activity, heartrate, sleep, weight, oxygen_saturation, respiratory_rate, temperature, cardio_fitness, profile
- **Rate limits:** ~110 API calls per report generation, within the 150/hr Personal app limit
- **Auto-chunking:** Endpoints with 30-day maximums (HRV, breathing rate, skin temperature, VO2 Max) are automatically chunked by the fetchers
- **Token refresh:** Tokens auto-refresh on 401 responses

## Food Scanner Integration

If `FOOD_SCANNER_API_KEY` is set, the tool fetches daily nutrition data from the Food Scanner API to populate the Nutrition and Fasting sections. If the Food Scanner is unavailable, those sections gracefully show "Data unavailable".

## License

Private
