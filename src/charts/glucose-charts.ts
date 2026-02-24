import type { ChartConfiguration } from 'chart.js';
import type { GlucoseData } from '../types/report.js';
import type { SectionCharts } from '../types/charts.js';
import { renderChart, makeChartImage } from './chart-renderer.js';
import { formatShortDate } from '../processors/date-utils.js';

const RED = '#dc2626';
const RED_FILL = '#dc262633';
const ORANGE = '#ea580c';
const ORANGE_FILL = '#ea580c33';
const YELLOW = '#ca8a04';

export async function renderGlucoseCharts(
  data: GlucoseData,
): Promise<SectionCharts> {
  const glucoseTrend = await renderGlucoseTrend(data);

  return {
    glucoseTrend,
  };
}

async function renderGlucoseTrend(data: GlucoseData) {
  const labels = data.daily.avg.map((d) => formatShortDate(d.date));
  const avgValues = data.daily.avg.map((d) => d.value);
  const minValues = data.daily.min.map((d) => d.value);
  const maxValues = data.daily.max.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Avg Glucose',
          data: avgValues,
          borderColor: RED,
          backgroundColor: RED_FILL,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
        },
        {
          label: 'Max',
          data: maxValues,
          borderColor: ORANGE,
          backgroundColor: ORANGE_FILL,
          borderDash: [4, 4],
          fill: false,
          tension: 0.3,
          pointRadius: 1,
        },
        {
          label: 'Min',
          data: minValues,
          borderColor: YELLOW,
          borderDash: [4, 4],
          fill: false,
          tension: 0.3,
          pointRadius: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Blood Glucose', font: { size: 16 } },
        legend: { display: true, position: 'bottom' },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { beginAtZero: false, title: { display: true, text: 'mg/dL' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}
