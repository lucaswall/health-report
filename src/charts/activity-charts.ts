import type { ChartConfiguration } from 'chart.js';
import type { ActivityData } from '../types/report.js';
import type { SectionCharts } from '../types/charts.js';
import { renderChart, makeChartImage } from './chart-renderer.js';
import { formatShortDate } from '../processors/date-utils.js';

// Medical report color palette
const BLUE = '#2563eb';
const TEAL = '#0d9488';
const GREEN = '#16a34a';
const ORANGE = '#ea580c';
const BLUE_FILL = '#2563eb33';
const ORANGE_FILL = '#ea580c33';

export async function renderActivityCharts(
  data: ActivityData,
): Promise<SectionCharts> {
  const [stepsBar, caloriesLine, activeMinutesStacked] = await Promise.all([
    renderStepsBar(data),
    renderCaloriesLine(data),
    renderActiveMinutesStacked(data),
  ]);

  return {
    stepsBar,
    caloriesLine,
    activeMinutesStacked,
  };
}

async function renderStepsBar(data: ActivityData) {
  const labels = data.daily.steps.map((d) => formatShortDate(d.date));
  const values = data.daily.steps.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Steps',
          data: values,
          backgroundColor: BLUE_FILL,
          borderColor: BLUE,
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Daily Steps', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { beginAtZero: true, title: { display: true, text: 'Steps' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}

async function renderCaloriesLine(data: ActivityData) {
  const labels = data.daily.calories.map((d) => formatShortDate(d.date));
  const values = data.daily.calories.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Calories Burned',
          data: values,
          borderColor: ORANGE,
          backgroundColor: ORANGE_FILL,
          fill: true,
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Daily Calories Burned', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { beginAtZero: false, title: { display: true, text: 'Calories' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}

async function renderActiveMinutesStacked(data: ActivityData) {
  const labels = data.daily.lightlyActiveMinutes.map((d) => formatShortDate(d.date));

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Very Active',
          data: data.daily.veryActiveMinutes.map((d) => d.value),
          backgroundColor: BLUE,
        },
        {
          label: 'Fairly Active',
          data: data.daily.fairlyActiveMinutes.map((d) => d.value),
          backgroundColor: TEAL,
        },
        {
          label: 'Lightly Active',
          data: data.daily.lightlyActiveMinutes.map((d) => d.value),
          backgroundColor: GREEN,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Active Minutes by Intensity', font: { size: 16 } },
        legend: { display: true, position: 'bottom' },
      },
      scales: {
        x: { stacked: true, ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Minutes' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}
