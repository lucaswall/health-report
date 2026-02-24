import type { ChartConfiguration } from 'chart.js';
import type { FastingData } from '../types/report.js';
import type { SectionCharts } from '../types/charts.js';
import { renderChart, makeChartImage } from './chart-renderer.js';
import { formatShortDate } from '../processors/date-utils.js';

// Medical report color palette
const TEAL = '#0d9488';
const PURPLE = '#7c3aed';
const TEAL_FILL = '#0d948833';
const PURPLE_FILL = '#7c3aed33';

export async function renderFastingCharts(
  data: FastingData,
): Promise<SectionCharts> {
  const eatingWindowBar = await renderEatingWindowBar(data);

  return {
    eatingWindowBar,
  };
}

async function renderEatingWindowBar(data: FastingData) {
  const labels = data.daily.map((d) => formatShortDate(d.date));
  const eatingValues = data.daily.map((d) => d.eatingWindowHours);
  const fastingValues = data.daily.map((d) => d.fastingHours);

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Eating Window',
          data: eatingValues,
          backgroundColor: TEAL_FILL,
          borderColor: TEAL,
          borderWidth: 1,
        },
        {
          label: 'Fasting',
          data: fastingValues,
          backgroundColor: PURPLE_FILL,
          borderColor: PURPLE,
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Eating Window & Fasting Hours', font: { size: 16 } },
        legend: { display: true, position: 'bottom' },
      },
      scales: {
        x: { stacked: true, ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { stacked: true, beginAtZero: true, max: 24, title: { display: true, text: 'Hours' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}
