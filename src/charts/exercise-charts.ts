import type { ChartConfiguration } from 'chart.js';
import type { ExerciseData } from '../types/report.js';
import type { SectionCharts } from '../types/charts.js';
import { renderChart, makeChartImage } from './chart-renderer.js';

// Medical report color palette
const COLORS = ['#2563eb', '#0d9488', '#16a34a', '#ea580c', '#dc2626', '#7c3aed', '#6b7280'];
const COLORS_FILL = ['#2563eb33', '#0d948833', '#16a34a33', '#ea580c33', '#dc262633', '#7c3aed33', '#6b728033'];

export async function renderExerciseCharts(
  recent: ExerciseData,
  historical: ExerciseData,
): Promise<SectionCharts> {
  const [exerciseByType, weeklyFrequency] = await Promise.all([
    renderExerciseByType(recent),
    renderWeeklyFrequency(recent, historical),
  ]);

  return {
    exerciseByType,
    weeklyFrequency,
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

async function renderWeeklyFrequency(recent: ExerciseData, historical: ExerciseData) {
  // Group exercise logs by week (ISO week start = Monday)
  const getWeekLabel = (dateStr: string): string => {
    const d = new Date(dateStr + 'T00:00:00');
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const day = d.getDate();
    return `${month} ${day}`;
  };

  // Combine both recent and historical, group by 7-day periods
  const allLogs = [...historical.logs, ...recent.logs];

  // Group by week buckets
  const weekMap = new Map<string, number>();
  for (const log of allLogs) {
    const d = new Date(log.date + 'T00:00:00');
    // Round down to start of week (Monday)
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(d);
    weekStart.setDate(diff);
    const key = weekStart.toISOString().split('T')[0];
    weekMap.set(key, (weekMap.get(key) ?? 0) + 1);
  }

  // Sort by date and take last 12 weeks
  const sorted = [...weekMap.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-12);
  const labels = sorted.map(([date]) => getWeekLabel(date));
  const values = sorted.map(([, count]) => count);

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Sessions',
          data: values,
          backgroundColor: '#2563eb33',
          borderColor: '#2563eb',
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Weekly Exercise Frequency', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { maxRotation: 45, autoSkip: true } },
        y: { beginAtZero: true, title: { display: true, text: 'Sessions' }, ticks: { stepSize: 1 } },
      },
    },
  };

  const base64 = await renderChart(config);
  return makeChartImage(base64, 800, 400);
}
