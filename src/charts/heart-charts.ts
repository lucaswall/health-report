import type { ChartConfiguration } from 'chart.js';
import type { HeartData } from '../types/report.js';
import type { SectionCharts } from '../types/charts.js';
import { renderChart, makeChartImage } from './chart-renderer.js';
import { formatShortDate } from '../processors/date-utils.js';

// Medical report color palette
const RED = '#dc2626';
const PURPLE = '#7c3aed';
const BLUE = '#2563eb';
const GREEN = '#16a34a';
const ORANGE = '#ea580c';
const RED_FILL = '#dc262633';
const PURPLE_FILL = '#7c3aed33';

export async function renderHeartCharts(
  data: HeartData,
): Promise<SectionCharts> {
  const [restingHRLine, hrvLine, zonesDoughnut] = await Promise.all([
    renderRestingHRLine(data),
    renderHRVLine(data),
    renderZonesDoughnut(data),
  ]);

  return {
    restingHRLine,
    hrvLine,
    zonesDoughnut,
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
        title: { display: true, text: 'Resting Heart Rate', font: { size: 16 } },
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
        title: { display: true, text: 'Heart Rate Variability', font: { size: 16 } },
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
