import type { ChartConfiguration } from 'chart.js';
import type { CardioData } from '../types/report.js';
import type { SectionCharts } from '../types/charts.js';
import { renderChart, makeChartImage } from './chart-renderer.js';
import { formatShortDate, formatMonthYear, weeklyAverage } from '../processors/date-utils.js';

// Medical report color palette
const GREEN = '#16a34a';
const GREEN_FILL = '#16a34a33';

export async function renderCardioCharts(
  recent: CardioData,
  historical: CardioData,
): Promise<SectionCharts> {
  const [vo2MaxTrend, vo2MaxHistorical] = await Promise.all([
    renderVO2MaxTrend(recent),
    renderVO2MaxHistorical(historical),
  ]);

  return {
    vo2MaxTrend,
    vo2MaxHistorical,
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
        title: { display: true, text: 'VO2 Max Trend (30 Days)', font: { size: 16 } },
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

async function renderVO2MaxHistorical(data: CardioData) {
  const weekly = weeklyAverage(data.vo2Max);
  const labels = weekly.map((d) => formatMonthYear(d.date));
  const values = weekly.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Weekly Avg VO2 Max',
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
        title: { display: true, text: 'VO2 Max - Weekly Average (1 Year)', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 12 } },
        y: { beginAtZero: false, title: { display: true, text: 'mL/kg/min' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}
