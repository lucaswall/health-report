import type { ChartConfiguration } from 'chart.js';
import type { CardioData } from '../types/report.js';
import type { SectionCharts } from '../types/charts.js';
import { renderChart, makeChartImage } from './chart-renderer.js';
import { formatShortDate } from '../processors/date-utils.js';

// Medical report color palette
const GREEN = '#16a34a';
const GREEN_FILL = '#16a34a33';

export async function renderCardioCharts(
  data: CardioData,
): Promise<SectionCharts> {
  const vo2MaxTrend = await renderVO2MaxTrend(data);

  return {
    vo2MaxTrend,
  };
}

async function renderVO2MaxTrend(data: CardioData) {
  const labels = data.vo2Max.map((d) => formatShortDate(d.date));
  const values = data.vo2Max.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'VO2 Max',
          data: values,
          borderColor: GREEN,
          backgroundColor: GREEN_FILL,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'VO2 Max Trend', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { beginAtZero: false, title: { display: true, text: 'mL/kg/min' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}
