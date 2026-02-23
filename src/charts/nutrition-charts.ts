import type { ChartConfiguration } from 'chart.js';
import type { NutritionData } from '../types/report.js';
import type { SectionCharts } from '../types/charts.js';
import { renderChart, makeChartImage } from './chart-renderer.js';
import { formatShortDate } from '../processors/date-utils.js';

// Medical report color palette
const BLUE = '#2563eb';
const TEAL = '#0d9488';
const GREEN = '#16a34a';
const ORANGE = '#ea580c';
const BLUE_FILL = '#2563eb33';

export async function renderNutritionCharts(
  recent: NutritionData,
  historical: NutritionData,
): Promise<SectionCharts> {
  const [calorieBar, macroDoughnut, macroStackedBars] = await Promise.all([
    renderCalorieBar(recent),
    renderMacroDoughnut(recent),
    renderMacroStackedBars(recent),
  ]);

  return {
    calorieBar,
    macroDoughnut,
    macroStackedBars,
  };
}

async function renderCalorieBar(data: NutritionData) {
  const labels = data.daily.calories.map((d) => formatShortDate(d.date));
  const values = data.daily.calories.map((d) => d.value);

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Calories',
          data: values,
          backgroundColor: BLUE_FILL,
          borderColor: BLUE,
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Daily Calorie Intake (30 Days)', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { beginAtZero: true, title: { display: true, text: 'Calories' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}

async function renderMacroDoughnut(data: NutritionData) {
  const config: ChartConfiguration = {
    type: 'doughnut',
    data: {
      labels: ['Protein', 'Carbs', 'Fat'],
      datasets: [
        {
          data: [data.averageMacros.protein, data.averageMacros.carbs, data.averageMacros.fat],
          backgroundColor: [BLUE, GREEN, ORANGE],
          borderColor: [BLUE, GREEN, ORANGE],
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Average Macronutrient Distribution (g)', font: { size: 16 } },
        legend: { display: true, position: 'right' },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}

async function renderMacroStackedBars(data: NutritionData) {
  const labels = data.daily.protein.map((d) => formatShortDate(d.date));

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Protein',
          data: data.daily.protein.map((d) => d.value),
          backgroundColor: BLUE,
        },
        {
          label: 'Carbs',
          data: data.daily.carbs.map((d) => d.value),
          backgroundColor: GREEN,
        },
        {
          label: 'Fat',
          data: data.daily.fat.map((d) => d.value),
          backgroundColor: ORANGE,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Daily Macronutrients (30 Days)', font: { size: 16 } },
        legend: { display: true, position: 'bottom' },
      },
      scales: {
        x: { stacked: true, ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 10 } },
        y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Grams' } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}
