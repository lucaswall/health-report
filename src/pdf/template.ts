// Compose full HTML document for PDF rendering

import type { HealthReportData } from '../types/report.js';
import type { AllCharts } from '../types/charts.js';
import { getStyles } from './styles.js';
import { renderHeader } from './sections/header.js';
import { renderSummary } from './sections/summary.js';
import { renderActivitySection } from './sections/activity.js';
import { renderExerciseSection } from './sections/exercise.js';
import { renderHeartSection } from './sections/heart.js';
import { renderSleepSection } from './sections/sleep.js';
import { renderBodySection } from './sections/body.js';
import { renderVitalsSection } from './sections/vitals.js';
import { renderCardioSection } from './sections/cardio.js';
import { renderNutritionSection } from './sections/nutrition.js';
import { renderFastingSection } from './sections/fasting.js';
import { renderWaterSection } from './sections/water.js';

export function composeHtml(data: HealthReportData, charts: AllCharts): string {
  const styles = getStyles();

  const header = renderHeader(data.profile, data.dateRange);
  const summary = renderSummary(data);
  const activity = renderActivitySection(data.activity, charts.activity);
  const exercise = renderExerciseSection(data.exercise, charts.exercise);
  const heart = renderHeartSection(data.heart, charts.heart);
  const sleep = renderSleepSection(data.sleep, charts.sleep);
  const body = renderBodySection(data.body, charts.body);
  const vitals = renderVitalsSection(data.vitals, charts.vitals);
  const cardio = renderCardioSection(data.cardio, charts.cardio);
  const nutrition = renderNutritionSection(data.nutrition, charts.nutrition);
  const fasting = renderFastingSection(data.fasting, charts.fasting);
  const water = renderWaterSection(data.water, charts.water);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=210mm" />
  <title>Health Report</title>
  <style>${styles}</style>
</head>
<body>
  ${header}
  ${summary}

  <div class="page-break"></div>
  ${nutrition}

  ${fasting}

  <div class="page-break"></div>
  ${water}

  ${body}

  <div class="page-break"></div>
  ${activity}

  <div class="page-break"></div>
  ${exercise}

  <div class="page-break"></div>
  ${heart}

  <div class="page-break"></div>
  ${sleep}

  ${vitals}

  ${cardio}
</body>
</html>`;
}
