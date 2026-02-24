// PDF section: activity data (steps, calories, active minutes)

import type { ActivityData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts, fmtShortDate } from '../helpers.js';

export function renderActivitySection(
  data: ActivityData,
  charts: SectionCharts,
): string {
  // Find best steps day
  const bestStepsDay = data.daily.steps.reduce(
    (best, d) => (d.value > best.value ? d : best),
    { date: '', value: 0 },
  );

  const stats = `
    <div class="stat-grid">
      ${statCard('Avg Steps', fmtNum(data.stats.steps.average))}
      ${statCard('Avg Calories', fmtNum(data.stats.calories.average))}
      ${statCard('Avg Active Min', fmtNum(data.stats.activeMinutes.average), 'min')}
      ${statCard('Best Day', fmtNum(bestStepsDay.value) + (bestStepsDay.date ? ` (${fmtShortDate(bestStepsDay.date)})` : ''), 'steps')}
    </div>
    <div style="margin-bottom:8px;">
      Steps: ${trendBadge(data.stats.steps)}
      &nbsp; Calories: ${trendBadge(data.stats.calories)}
      &nbsp; Active Min: ${trendBadge(data.stats.activeMinutes)}
    </div>
  `;

  const statsTable = `
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Average</th>
          <th>Min</th>
          <th>Max</th>
          <th>Trend</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Steps</td>
          <td class="num">${fmtNum(data.stats.steps.average)}</td>
          <td class="num">${fmtNum(data.stats.steps.min)}</td>
          <td class="num">${fmtNum(data.stats.steps.max)}</td>
          <td>${trendBadge(data.stats.steps)}</td>
        </tr>
        <tr>
          <td>Calories</td>
          <td class="num">${fmtNum(data.stats.calories.average)}</td>
          <td class="num">${fmtNum(data.stats.calories.min)}</td>
          <td class="num">${fmtNum(data.stats.calories.max)}</td>
          <td>${trendBadge(data.stats.calories)}</td>
        </tr>
        <tr>
          <td>Active Minutes</td>
          <td class="num">${fmtNum(data.stats.activeMinutes.average)}</td>
          <td class="num">${fmtNum(data.stats.activeMinutes.min)}</td>
          <td class="num">${fmtNum(data.stats.activeMinutes.max)}</td>
          <td>${trendBadge(data.stats.activeMinutes)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Activity</h2>
      ${stats}
      ${statsTable}
      ${renderCharts(charts, ['stepsBar', 'caloriesLine', 'activeMinutesStacked'])}
    </div>
  `;
}
