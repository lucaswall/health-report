import type { ChartConfiguration } from 'chart.js';
import type { BodyData } from '../types/report.js';
import type { SectionCharts } from '../types/charts.js';
import { renderChart, makeChartImage } from './chart-renderer.js';
import { formatShortDate, formatMonthYear, weeklyAverage } from '../processors/date-utils.js';

// Medical report color palette
const BLUE = '#2563eb';
const TEAL = '#0d9488';
const BLUE_FILL = '#2563eb33';
const TEAL_FILL = '#0d948833';

export async function renderBodyCharts(
  recent: BodyData,
  historical: BodyData,
): Promise<SectionCharts> {
  const [weightTrend, bodyFatTrend, weightHistorical] = await Promise.all([
    renderWeightTrend(recent),
    renderBodyFatTrend(recent),
    renderWeightHistorical(historical),
  ]);

  return {
    weightTrend,
    bodyFatTrend,
    weightHistorical,
  };
}

async function renderWeightTrend(data: BodyData) {
  const labels = data.weight.map((d) => formatShortDate(d.date));
  const values = data.weight.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Weight',
          data: values,
          borderColor: BLUE,
          backgroundColor: BLUE_FILL,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Weight Trend (30 Days)', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { beginAtZero: false, title: { display: true, text: 'lbs' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}

async function renderBodyFatTrend(data: BodyData) {
  const labels = data.bodyFat.map((d) => formatShortDate(d.date));
  const values = data.bodyFat.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Body Fat %',
          data: values,
          borderColor: TEAL,
          backgroundColor: TEAL_FILL,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Body Fat Trend (30 Days)', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { beginAtZero: false, title: { display: true, text: '% Body Fat' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}

async function renderWeightHistorical(data: BodyData) {
  const weekly = weeklyAverage(data.weight);
  const labels = weekly.map((d) => formatMonthYear(d.date));
  const values = weekly.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Weekly Avg Weight',
          data: values,
          borderColor: BLUE,
          backgroundColor: BLUE_FILL,
          fill: true,
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Weight - Weekly Average (1 Year)', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 12 } },
        y: { beginAtZero: false, title: { display: true, text: 'lbs' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}
