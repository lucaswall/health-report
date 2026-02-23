import type { ChartConfiguration } from 'chart.js';
import type { HeartData } from '../types/report.js';
import type { SectionCharts } from '../types/charts.js';
import { renderChart, makeChartImage } from './chart-renderer.js';
import { formatShortDate, formatMonthYear, weeklyAverage } from '../processors/date-utils.js';

// Medical report color palette
const RED = '#dc2626';
const PURPLE = '#7c3aed';
const BLUE = '#2563eb';
const TEAL = '#0d9488';
const GREEN = '#16a34a';
const ORANGE = '#ea580c';
const RED_FILL = '#dc262633';
const PURPLE_FILL = '#7c3aed33';
const BLUE_FILL = '#2563eb33';

export async function renderHeartCharts(
  recent: HeartData,
  historical: HeartData,
): Promise<SectionCharts> {
  const [restingHRLine, hrvLine, zonesDoughnut, restingHRHistorical] = await Promise.all([
    renderRestingHRLine(recent),
    renderHRVLine(recent),
    renderZonesDoughnut(recent),
    renderRestingHRHistorical(historical),
  ]);

  return {
    restingHRLine,
    hrvLine,
    zonesDoughnut,
    restingHRHistorical,
  };
}

async function renderRestingHRLine(data: HeartData) {
  const labels = data.restingHR.map((d) => formatShortDate(d.date));
  const values = data.restingHR.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Resting Heart Rate',
          data: values,
          borderColor: RED,
          backgroundColor: RED_FILL,
          fill: true,
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Resting Heart Rate (30 Days)', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { beginAtZero: false, title: { display: true, text: 'BPM' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}

async function renderHRVLine(data: HeartData) {
  const labels = data.hrv.map((d) => formatShortDate(d.date));
  const values = data.hrv.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'HRV (RMSSD)',
          data: values,
          borderColor: PURPLE,
          backgroundColor: PURPLE_FILL,
          fill: true,
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Heart Rate Variability (30 Days)', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { beginAtZero: false, title: { display: true, text: 'ms (RMSSD)' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}

async function renderZonesDoughnut(data: HeartData) {
  const config: ChartConfiguration = {
    type: 'doughnut',
    data: {
      labels: ['Out of Range', 'Fat Burn', 'Cardio', 'Peak'],
      datasets: [
        {
          data: [data.zones.outOfRange, data.zones.fatBurn, data.zones.cardio, data.zones.peak],
          backgroundColor: [BLUE, GREEN, ORANGE, RED],
          borderColor: [BLUE, GREEN, ORANGE, RED],
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Heart Rate Zones (Minutes)', font: { size: 16 } },
        legend: { display: true, position: 'right' },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}

async function renderRestingHRHistorical(data: HeartData) {
  const weekly = weeklyAverage(data.restingHR);
  const labels = weekly.map((d) => formatMonthYear(d.date));
  const values = weekly.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Weekly Avg Resting HR',
          data: values,
          borderColor: RED,
          backgroundColor: RED_FILL,
          fill: true,
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Resting Heart Rate - Weekly Average (1 Year)', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 12 } },
        y: { beginAtZero: false, title: { display: true, text: 'BPM' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}
