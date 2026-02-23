import type { ChartConfiguration } from 'chart.js';
import type { SleepData } from '../types/report.js';
import type { SectionCharts } from '../types/charts.js';
import { renderChart, makeChartImage } from './chart-renderer.js';
import { formatShortDate, formatMonthYear, weeklyAverage } from '../processors/date-utils.js';

// Medical report color palette
const BLUE = '#2563eb';
const TEAL = '#0d9488';
const PURPLE = '#7c3aed';
const ORANGE = '#ea580c';
const GREEN = '#16a34a';
const BLUE_FILL = '#2563eb33';
const GREEN_FILL = '#16a34a33';

export async function renderSleepCharts(
  recent: SleepData,
  historical: SleepData,
): Promise<SectionCharts> {
  const [durationBars, stageStackedBars, efficiencyLine, durationHistorical] = await Promise.all([
    renderDurationBars(recent),
    renderStageStackedBars(recent),
    renderEfficiencyLine(recent),
    renderDurationHistorical(historical),
  ]);

  return {
    durationBars,
    stageStackedBars,
    efficiencyLine,
    durationHistorical,
  };
}

async function renderDurationBars(data: SleepData) {
  const labels = data.daily.duration.map((d) => formatShortDate(d.date));
  const values = data.daily.duration.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Sleep Duration',
          data: values,
          backgroundColor: BLUE_FILL,
          borderColor: BLUE,
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Sleep Duration (30 Days)', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { beginAtZero: true, title: { display: true, text: 'Hours' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}

async function renderStageStackedBars(data: SleepData) {
  const labels = data.daily.deep.map((d) => formatShortDate(d.date));

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Deep',
          data: data.daily.deep.map((d) => d.value),
          backgroundColor: BLUE,
        },
        {
          label: 'REM',
          data: data.daily.rem.map((d) => d.value),
          backgroundColor: PURPLE,
        },
        {
          label: 'Light',
          data: data.daily.light.map((d) => d.value),
          backgroundColor: TEAL,
        },
        {
          label: 'Wake',
          data: data.daily.wake.map((d) => d.value),
          backgroundColor: ORANGE,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Sleep Stages (30 Days)', font: { size: 16 } },
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

async function renderEfficiencyLine(data: SleepData) {
  const labels = data.daily.efficiency.map((d) => formatShortDate(d.date));
  const values = data.daily.efficiency.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Sleep Efficiency',
          data: values,
          borderColor: GREEN,
          backgroundColor: GREEN_FILL,
          fill: true,
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Sleep Efficiency (30 Days)', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: {
          beginAtZero: false,
          min: 50,
          max: 100,
          title: { display: true, text: '% Efficiency' },
        },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}

async function renderDurationHistorical(data: SleepData) {
  const weekly = weeklyAverage(data.daily.duration);
  const labels = weekly.map((d) => formatMonthYear(d.date));
  const values = weekly.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Weekly Avg Duration',
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
        title: { display: true, text: 'Sleep Duration - Weekly Average (1 Year)', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 12 } },
        y: { beginAtZero: false, title: { display: true, text: 'Hours' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}
