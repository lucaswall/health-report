import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { config } from './config.js';
import { getReportDate, get30DayRange, get1YearRange } from './processors/date-utils.js';
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

  // 1. Determine date ranges
  const reportDate = getReportDate(config.report.date);
  const recentRange = get30DayRange(reportDate);
  const historicalRange = get1YearRange(reportDate);

  console.log(`Report date: ${reportDate}`);
  console.log(`30-day range: ${recentRange.start} to ${recentRange.end}`);
  console.log(`1-year range: ${historicalRange.start} to ${historicalRange.end}\n`);

  // 2. Fetch all data
  console.log('Step 1/4: Fetching data...');
  const raw = await fetchAll(recentRange, historicalRange);

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

  const activity = {
    recent: processActivity(toActivityRaw(raw.fitbit.activity.recent)),
    historical: processActivity(toActivityRaw(raw.fitbit.activity.historical)),
  };

  const exercise = {
    recent: processExercise(raw.fitbit.exercise.recent),
    historical: processExercise(raw.fitbit.exercise.historical),
  };

  const heart = {
    recent: processHeart(raw.fitbit.heartRate.recent, raw.fitbit.hrv.recent),
    historical: processHeart(raw.fitbit.heartRate.historical, raw.fitbit.hrv.historical),
  };

  const sleep = {
    recent: processSleep(raw.fitbit.sleep.recent),
    historical: processSleep(raw.fitbit.sleep.historical),
  };

  const body = {
    recent: processBody(toBodyRaw(raw.fitbit.body.recent)),
    historical: processBody(toBodyRaw(raw.fitbit.body.historical)),
  };

  const vitals = {
    recent: processVitals(raw.fitbit.spo2.recent, raw.fitbit.breathingRate.recent, raw.fitbit.skinTemp.recent),
    historical: processVitals(raw.fitbit.spo2.historical, raw.fitbit.breathingRate.historical, raw.fitbit.skinTemp.historical),
  };

  const cardio = {
    recent: processCardio(raw.fitbit.cardioScore.recent),
    historical: processCardio(raw.fitbit.cardioScore.historical),
  };

  const nutrition = {
    recent: processNutrition(raw.nutrition.recent),
    historical: processNutrition(raw.nutrition.historical),
  };

  const fasting = {
    recent: processFasting(raw.nutrition.recent),
    historical: processFasting(raw.nutrition.historical),
  };

  const reportData: HealthReportData = {
    profile,
    dateRange: recentRange,
    historicalRange,
    activity,
    exercise,
    heart,
    sleep,
    body,
    vitals,
    cardio,
    nutrition,
    fasting,
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
  ] = await Promise.all([
    renderActivityCharts(activity.recent, activity.historical),
    renderExerciseCharts(exercise.recent, exercise.historical),
    renderHeartCharts(heart.recent, heart.historical),
    renderSleepCharts(sleep.recent, sleep.historical),
    renderBodyCharts(body.recent, body.historical),
    renderVitalsCharts(vitals.recent, vitals.historical),
    renderCardioCharts(cardio.recent, cardio.historical),
    renderNutritionCharts(nutrition.recent, nutrition.historical),
    renderFastingCharts(fasting.recent, fasting.historical),
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
