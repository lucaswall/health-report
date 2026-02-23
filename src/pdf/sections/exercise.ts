// PDF section: exercise data (workout logs, by-type breakdown)

import type { ExerciseData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, fmtNum, fmtShortDate, renderCharts, escapeHtml } from '../helpers.js';

export function renderExerciseSection(
  data: { recent: ExerciseData; historical: ExerciseData },
  charts: SectionCharts,
): string {
  const { recent, historical } = data;

  const recentStats = `
    <div class="stat-grid">
      ${statCard('Total Sessions', fmtNum(recent.totalSessions))}
      ${statCard('Total Minutes', fmtNum(recent.totalMinutes), 'min')}
      ${statCard('Avg / Week', fmtNum(recent.averagePerWeek, 1), 'sessions')}
      ${statCard('Activity Types', String(Object.keys(recent.byType).length))}
    </div>
  `;

  // Recent exercise log table (last 15 entries)
  const recentLogs = recent.logs.slice(-15).reverse();
  const logRows = recentLogs
    .map(
      (log) => `
        <tr>
          <td>${fmtShortDate(log.date)}</td>
          <td>${escapeHtml(log.name)}</td>
          <td class="num">${log.duration}</td>
          <td class="num">${fmtNum(log.calories)}</td>
          <td class="num">${log.averageHeartRate != null ? fmtNum(log.averageHeartRate) : '&mdash;'}</td>
        </tr>`,
    )
    .join('');

  const logTable = `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Activity</th>
          <th>Duration (min)</th>
          <th>Calories</th>
          <th>Avg HR</th>
        </tr>
      </thead>
      <tbody>
        ${logRows || '<tr><td colspan="5" style="text-align:center;color:#a0aec0;">No exercise data</td></tr>'}
      </tbody>
    </table>
  `;

  // By-type breakdown table
  const typeEntries = Object.entries(recent.byType).sort((a, b) => b[1].count - a[1].count);
  const typeRows = typeEntries
    .map(
      ([name, info]) => `
        <tr>
          <td>${escapeHtml(name)}</td>
          <td class="num">${info.count}</td>
          <td class="num">${fmtNum(info.totalMinutes)}</td>
          <td class="num">${fmtNum(info.totalCalories)}</td>
        </tr>`,
    )
    .join('');

  const typeTable = `
    <table>
      <thead>
        <tr>
          <th>Activity Type</th>
          <th>Sessions</th>
          <th>Total Min</th>
          <th>Total Cal</th>
        </tr>
      </thead>
      <tbody>
        ${typeRows || '<tr><td colspan="4" style="text-align:center;color:#a0aec0;">No data</td></tr>'}
      </tbody>
    </table>
  `;

  // Historical stats
  const histStats = `
    <div class="stat-grid">
      ${statCard('Total Sessions', fmtNum(historical.totalSessions))}
      ${statCard('Total Minutes', fmtNum(historical.totalMinutes), 'min')}
      ${statCard('Avg / Week', fmtNum(historical.averagePerWeek, 1), 'sessions')}
      ${statCard('Activity Types', String(Object.keys(historical.byType).length))}
    </div>
  `;

  return `
    <div class="section-card">
      <h2>Exercise</h2>
      ${recentStats}
      <div class="two-col">
        <div class="col">
          <div class="col-label">Recent (30 Days)</div>
          <h3>Recent Workouts</h3>
          ${logTable}
          <h3>By Activity Type</h3>
          ${typeTable}
          ${renderCharts(charts, ['byType', 'weeklyFrequency'])}
        </div>
        <div class="col">
          <div class="col-label">Historical (1 Year)</div>
          ${histStats}
          ${renderCharts(charts, ['byTypeHistorical', 'weeklyFrequencyHistorical'])}
        </div>
      </div>
    </div>
  `;
}
