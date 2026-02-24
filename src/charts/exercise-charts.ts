import type { ChartConfiguration } from 'chart.js';
import type { ExerciseData } from '../types/report.js';
import type { SectionCharts } from '../types/charts.js';
import { renderChart, makeChartImage } from './chart-renderer.js';

// Medical report color palette
const COLORS = ['#2563eb', '#0d9488', '#16a34a', '#ea580c', '#dc2626', '#7c3aed', '#6b7280'];

export async function renderExerciseCharts(
  data: ExerciseData,
): Promise<SectionCharts> {
  const exerciseByType = await renderExerciseByType(data);

  return {
    exerciseByType,
  };
}

async function renderExerciseByType(data: ExerciseData) {
  const types = Object.keys(data.byType);
  const minutes = types.map((t) => data.byType[t].totalMinutes);
  const backgroundColors = types.map((_, i) => COLORS[i % COLORS.length]);
  const borderColors = types.map((_, i) => COLORS[i % COLORS.length]);

  const config: ChartConfiguration = {
    type: 'doughnut',
    data: {
      labels: types,
      datasets: [
        {
          data: minutes,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Exercise by Type (Total Minutes)', font: { size: 16 } },
        legend: { display: true, position: 'right' },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}
