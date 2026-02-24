import type { ChartConfiguration } from 'chart.js';
import type { VitalsData } from '../types/report.js';
import type { SectionCharts } from '../types/charts.js';
import { renderChart, makeChartImage } from './chart-renderer.js';
import { formatShortDate } from '../processors/date-utils.js';

// Medical report color palette
const BLUE = '#2563eb';
const TEAL = '#0d9488';
const PURPLE = '#7c3aed';
const BLUE_FILL = '#2563eb33';
const TEAL_FILL = '#0d948833';
const PURPLE_FILL = '#7c3aed33';

export async function renderVitalsCharts(
  data: VitalsData,
): Promise<SectionCharts> {
  const [spo2Line, breathingRateLine, skinTempLine] = await Promise.all([
    renderSpO2Line(data),
    renderBreathingRateLine(data),
    renderSkinTempLine(data),
  ]);

  return {
    spo2Line,
    breathingRateLine,
    skinTempLine,
  };
}

async function renderSpO2Line(data: VitalsData) {
  const labels = data.spo2.map((d) => formatShortDate(d.date));
  const values = data.spo2.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'SpO2',
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
        title: { display: true, text: 'Blood Oxygen Saturation (SpO2)', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: {
          beginAtZero: false,
          min: 90,
          max: 100,
          title: { display: true, text: '% SpO2' },
        },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}

async function renderBreathingRateLine(data: VitalsData) {
  const labels = data.breathingRate.map((d) => formatShortDate(d.date));
  const values = data.breathingRate.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Breathing Rate',
          data: values,
          borderColor: TEAL,
          backgroundColor: TEAL_FILL,
          fill: true,
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Breathing Rate', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { beginAtZero: false, title: { display: true, text: 'Breaths/min' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}

async function renderSkinTempLine(data: VitalsData) {
  const labels = data.skinTemp.map((d) => formatShortDate(d.date));
  const values = data.skinTemp.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Skin Temperature',
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
        title: { display: true, text: 'Skin Temperature Variation', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { beginAtZero: false, title: { display: true, text: 'Variation (\u00B0F)' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}
