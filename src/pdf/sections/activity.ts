// PDF section: activity data (steps, calories, active minutes)

import type { ActivityData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts, fmtShortDate } from '../helpers.js';

export function renderActivitySection(
  data: { recent: ActivityData; historical: ActivityData },
  charts: SectionCharts,
): string {
  const { recent, historical } = data;

  // Find best steps day
  const bestStepsDay = recent.daily.steps.reduce(
    (best, d) => (d.value > best.value ? d : best),
    { date: '', value: 0 },
  );

  const recentStats = `
    <div class="stat-grid">
      ${statCard('Avg Steps', fmtNum(recent.stats.steps.average))}
      ${statCard('Avg Calories', fmtNum(recent.stats.calories.average))}
      ${statCard('Avg Active Min', fmtNum(recent.stats.activeMinutes.average), 'min')}
      ${statCard('Best Day', fmtNum(bestStepsDay.value) + (bestStepsDay.date ? ` (${fmtShortDate(bestStepsDay.date)})` : ''), 'steps')}
    </div>
    <div style="margin-bottom:8px;">
      Steps: ${trendBadge(recent.stats.steps)}
      &nbsp; Calories: ${trendBadge(recent.stats.calories)}
      &nbsp; Active Min: ${trendBadge(recent.stats.activeMinutes)}
    </div>
  `;

  // 30-day stats table
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
          <td class="num">${fmtNum(recent.stats.steps.average)}</td>
          <td class="num">${fmtNum(recent.stats.steps.min)}</td>
          <td class="num">${fmtNum(recent.stats.steps.max)}</td>
          <td>${trendBadge(recent.stats.steps)}</td>
        </tr>
        <tr>
          <td>Calories</td>
          <td class="num">${fmtNum(recent.stats.calories.average)}</td>
          <td class="num">${fmtNum(recent.stats.calories.min)}</td>
          <td class="num">${fmtNum(recent.stats.calories.max)}</td>
          <td>${trendBadge(recent.stats.calories)}</td>
        </tr>
        <tr>
          <td>Active Minutes</td>
          <td class="num">${fmtNum(recent.stats.activeMinutes.average)}</td>
          <td class="num">${fmtNum(recent.stats.activeMinutes.min)}</td>
          <td class="num">${fmtNum(recent.stats.activeMinutes.max)}</td>
          <td>${trendBadge(recent.stats.activeMinutes)}</td>
        </tr>
      </tbody>
    </table>
  `;

  // Historical comparison table
  const histTable = `
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
          <td class="num">${fmtNum(historical.stats.steps.average)}</td>
          <td class="num">${fmtNum(historical.stats.steps.min)}</td>
          <td class="num">${fmtNum(historical.stats.steps.max)}</td>
          <td>${trendBadge(historical.stats.steps)}</td>
        </tr>
        <tr>
          <td>Calories</td>
          <td class="num">${fmtNum(historical.stats.calories.average)}</td>
          <td class="num">${fmtNum(historical.stats.calories.min)}</td>
          <td class="num">${fmtNum(historical.stats.calories.max)}</td>
          <td>${trendBadge(historical.stats.calories)}</td>
        </tr>
        <tr>
          <td>Active Minutes</td>
          <td class="num">${fmtNum(historical.stats.activeMinutes.average)}</td>
          <td class="num">${fmtNum(historical.stats.activeMinutes.min)}</td>
          <td class="num">${fmtNum(historical.stats.activeMinutes.max)}</td>
          <td>${trendBadge(historical.stats.activeMinutes)}</td>
        </tr>
      </tbody>
    </table>
  `;

  const recentChartKeys = ['steps', 'calories', 'activeMinutes'];
  const historicalChartKeys = ['stepsHistorical', 'caloriesHistorical', 'activeMinutesHistorical'];

  return `
    <div class="section-card">
      <h2>Activity</h2>
      ${recentStats}
      <div class="two-col">
        <div class="col">
          <div class="col-label">Recent (30 Days)</div>
          ${statsTable}
          ${renderCharts(charts, recentChartKeys)}
        </div>
        <div class="col">
          <div class="col-label">Historical (1 Year)</div>
          ${histTable}
          ${renderCharts(charts, historicalChartKeys)}
        </div>
      </div>
    </div>
  `;
}
