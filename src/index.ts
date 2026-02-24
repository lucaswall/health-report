import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { config } from './config.js';
import { getReportDate, getCurrentMonthRange } from './processors/date-utils.js';
import { fetchAll } from './fetchers/fetch-all.js';

// Processors
import { processActivity, type ActivityRaw } from './processors/activity.js';
import { processExercise } from './processors/exercise.js';
import { processHeart } from './processors/heart.js';
import { processSleep } from './processors/sleep.js';
import { processBody, type BodyRaw } from './processors/body.js';
import { processVitals } from './processors/vitals.js';
import { processCardio } from './processors/cardio.js';
import { processNutrition } from './processors/nutrition.js';
import { processFasting } from './processors/fasting.js';
import { processWater } from './processors/water.js';
import { processGlucose } from './processors/glucose.js';

// Charts
import { renderActivityCharts } from './charts/activity-charts.js';
import { renderExerciseCharts } from './charts/exercise-charts.js';
import { renderHeartCharts } from './charts/heart-charts.js';
import { renderSleepCharts } from './charts/sleep-charts.js';
import { renderBodyCharts } from './charts/body-charts.js';
import { renderVitalsCharts } from './charts/vitals-charts.js';
import { renderCardioCharts } from './charts/cardio-charts.js';
import { renderNutritionCharts } from './charts/nutrition-charts.js';
import { renderFastingCharts } from './charts/fasting-charts.js';
import { renderWaterCharts } from './charts/water-charts.js';
import { renderGlucoseCharts } from './charts/glucose-charts.js';

// PDF
import { composeHtml } from './pdf/template.js';
import { renderPdf } from './pdf/render-pdf.js';

import type { HealthReportData, ProfileData } from './types/report.js';
import type { AllCharts } from './types/charts.js';
import type { FitbitActivityTimeSeries } from './types/fitbit.js';

function toActivityRaw(ts: FitbitActivityTimeSeries): ActivityRaw {
  return {
    steps: ts['activities-steps'],
    calories: ts['activities-calories'],
    distance: ts['activities-distance'],
    floors: ts['activities-floors'],
    sedentaryMinutes: ts['activities-minutesSedentary'],
    lightlyActiveMinutes: ts['activities-minutesLightlyActive'],
    fairlyActiveMinutes: ts['activities-minutesFairlyActive'],
    veryActiveMinutes: ts['activities-minutesVeryActive'],
  };
}

function toBodyRaw(ts: { 'body-weight': { dateTime: string; value: string }[]; 'body-bmi': { dateTime: string; value: string }[]; 'body-fat': { dateTime: string; value: string }[] }): BodyRaw {
  return {
    weight: ts['body-weight'],
    bmi: ts['body-bmi'],
    fat: ts['body-fat'],
  };
}

async function main() {
  console.log('Health Report Generator');
  console.log('=======================\n');

  // 1. Determine date range
  const reportDate = getReportDate(config.report.date);
  const dateRange = getCurrentMonthRange(reportDate);

  console.log(`Report date: ${reportDate}`);
  console.log(`Date range: ${dateRange.start} to ${dateRange.end}\n`);

  // 2. Fetch all data
  console.log('Step 1/4: Fetching data...');
  const raw = await fetchAll(dateRange);

  // 3. Process data
  console.log('Step 2/4: Processing data...');

  const profile: ProfileData = {
    name: raw.fitbit.profile.user.fullName || raw.fitbit.profile.user.displayName,
    age: raw.fitbit.profile.user.age,
    gender: raw.fitbit.profile.user.gender,
    height: raw.fitbit.profile.user.height,
    weight: raw.fitbit.profile.user.weight,
    memberSince: raw.fitbit.profile.user.memberSince,
  };

  const activity = processActivity(toActivityRaw(raw.fitbit.activity));
  const exercise = processExercise(raw.fitbit.exercise);
  const heart = processHeart(raw.fitbit.heartRate, raw.fitbit.hrv);
  const sleep = processSleep(raw.fitbit.sleep);
  const body = processBody(toBodyRaw(raw.fitbit.body));
  const vitals = processVitals(raw.fitbit.spo2, raw.fitbit.breathingRate, raw.fitbit.skinTemp);
  const cardio = processCardio(raw.fitbit.cardioScore);
  const nutrition = processNutrition(raw.nutrition);
  const fasting = processFasting(raw.nutrition);
  const water = processWater(raw.fitbit.water);
  const glucose = processGlucose(raw.fitbit.glucose);

  const reportData: HealthReportData = {
    profile,
    dateRange,
    activity,
    exercise,
    heart,
    sleep,
    body,
    vitals,
    cardio,
    nutrition,
    fasting,
    water,
    glucose,
  };

  // 4. Render charts
  console.log('Step 3/4: Rendering charts...');

  const [
    activityCharts,
    exerciseCharts,
    heartCharts,
    sleepCharts,
    bodyCharts,
    vitalsCharts,
    cardioCharts,
    nutritionCharts,
    fastingCharts,
    waterCharts,
    glucoseCharts,
  ] = await Promise.all([
    renderActivityCharts(activity),
    renderExerciseCharts(exercise),
    renderHeartCharts(heart),
    renderSleepCharts(sleep),
    renderBodyCharts(body),
    renderVitalsCharts(vitals),
    renderCardioCharts(cardio),
    renderNutritionCharts(nutrition),
    renderFastingCharts(fasting),
    renderWaterCharts(water),
    renderGlucoseCharts(glucose),
  ]);

  const charts: AllCharts = {
    activity: activityCharts,
    exercise: exerciseCharts,
    heart: heartCharts,
    sleep: sleepCharts,
    body: bodyCharts,
    vitals: vitalsCharts,
    cardio: cardioCharts,
    nutrition: nutritionCharts,
    fasting: fastingCharts,
    water: waterCharts,
    glucose: glucoseCharts,
  };

  // 5. Generate PDF
  console.log('Step 4/4: Generating PDF...');

  const html = composeHtml(reportData, charts);
  const pdfBuffer = await renderPdf(html);

  // 6. Write output
  const outputDir = resolve(config.report.outputDir);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const filename = `health-report-${reportDate}.pdf`;
  const outputPath = resolve(outputDir, filename);
  writeFileSync(outputPath, pdfBuffer);

  console.log(`\nReport generated successfully!`);
  console.log(`Output: ${outputPath}`);
  console.log(`Size: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);
}

main().catch((error) => {
  console.error('Failed to generate report:', error);
  process.exit(1);
});
