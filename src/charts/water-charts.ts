import type { ChartConfiguration } from 'chart.js';
import type { WaterData } from '../types/report.js';
import type { SectionCharts } from '../types/charts.js';
import { renderChart, makeChartImage } from './chart-renderer.js';
import { formatShortDate, formatMonthYear, weeklyAverage } from '../processors/date-utils.js';

const BLUE = '#2563eb';
const BLUE_FILL = '#2563eb33';

export async function renderWaterCharts(
  recent: WaterData,
  historical: WaterData,
): Promise<SectionCharts> {
  const [waterTrend, waterHistorical] = await Promise.all([
    renderWaterTrend(recent),
    renderWaterHistorical(historical),
  ]);

  return {
    waterTrend,
    waterHistorical,
  };
}

async function renderWaterTrend(data: WaterData) {
  const labels = data.daily.map((d) => formatShortDate(d.date));
  const values = data.daily.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Water (ml)',
          data: values,
          backgroundColor: BLUE_FILL,
          borderColor: BLUE,
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Daily Water Intake (30 Days)', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { beginAtZero: true, title: { display: true, text: 'ml' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}

async function renderWaterHistorical(data: WaterData) {
  const weekly = weeklyAverage(data.daily);
  const labels = weekly.map((d) => formatMonthYear(d.date));
  const values = weekly.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Weekly Avg Water (ml)',
          data: values,
          backgroundColor: BLUE_FILL,
          borderColor: BLUE,
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Water Intake - Weekly Average (1 Year)', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 12 } },
        y: { beginAtZero: true, title: { display: true, text: 'ml' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}
