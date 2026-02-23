// PDF section: sleep data (duration, efficiency, stages)

import type { SleepData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderSleepSection(
  data: { recent: SleepData; historical: SleepData },
  charts: SectionCharts,
): string {
  const { recent, historical } = data;

  const recentStats = `
    <div class="stat-grid">
      ${statCard('Avg Duration', fmtNum(recent.stats.duration.average, 1), 'hrs')}
      ${statCard('Avg Efficiency', fmtNum(recent.stats.efficiency.average, 1), '%')}
      ${statCard('Deep Sleep', fmtNum(recent.averageStages.deep, 1), '%')}
      ${statCard('REM Sleep', fmtNum(recent.averageStages.rem, 1), '%')}
    </div>
    <div style="margin-bottom:8px;">
      Duration: ${trendBadge(recent.stats.duration)}
      &nbsp; Efficiency: ${trendBadge(recent.stats.efficiency)}
    </div>
  `;

  // Stage breakdown table
  const stagesTable = `
    <table>
      <thead>
        <tr><th>Stage</th><th>Recent Avg %</th><th>Historical Avg %</th></tr>
      </thead>
      <tbody>
        <tr><td>Deep</td><td class="num">${fmtNum(recent.averageStages.deep, 1)}%</td><td class="num">${fmtNum(historical.averageStages.deep, 1)}%</td></tr>
        <tr><td>Light</td><td class="num">${fmtNum(recent.averageStages.light, 1)}%</td><td class="num">${fmtNum(historical.averageStages.light, 1)}%</td></tr>
        <tr><td>REM</td><td class="num">${fmtNum(recent.averageStages.rem, 1)}%</td><td class="num">${fmtNum(historical.averageStages.rem, 1)}%</td></tr>
        <tr><td>Wake</td><td class="num">${fmtNum(recent.averageStages.wake, 1)}%</td><td class="num">${fmtNum(historical.averageStages.wake, 1)}%</td></tr>
      </tbody>
    </table>
  `;

  // Stats comparison tables
  const recentTable = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Trend</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Duration (hrs)</td>
          <td class="num">${fmtNum(recent.stats.duration.average, 1)}</td>
          <td class="num">${fmtNum(recent.stats.duration.min, 1)}</td>
          <td class="num">${fmtNum(recent.stats.duration.max, 1)}</td>
          <td>${trendBadge(recent.stats.duration)}</td>
        </tr>
        <tr>
          <td>Efficiency (%)</td>
          <td class="num">${fmtNum(recent.stats.efficiency.average, 1)}</td>
          <td class="num">${fmtNum(recent.stats.efficiency.min, 1)}</td>
          <td class="num">${fmtNum(recent.stats.efficiency.max, 1)}</td>
          <td>${trendBadge(recent.stats.efficiency)}</td>
        </tr>
      </tbody>
    </table>
  `;

  const histTable = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Trend</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Duration (hrs)</td>
          <td class="num">${fmtNum(historical.stats.duration.average, 1)}</td>
          <td class="num">${fmtNum(historical.stats.duration.min, 1)}</td>
          <td class="num">${fmtNum(historical.stats.duration.max, 1)}</td>
          <td>${trendBadge(historical.stats.duration)}</td>
        </tr>
        <tr>
          <td>Efficiency (%)</td>
          <td class="num">${fmtNum(historical.stats.efficiency.average, 1)}</td>
          <td class="num">${fmtNum(historical.stats.efficiency.min, 1)}</td>
          <td class="num">${fmtNum(historical.stats.efficiency.max, 1)}</td>
          <td>${trendBadge(historical.stats.efficiency)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Sleep</h2>
      ${recentStats}
      <h3>Sleep Stage Breakdown</h3>
      ${stagesTable}
      <div class="two-col">
        <div class="col">
          <div class="col-label">Recent (30 Days)</div>
          ${recentTable}
          ${renderCharts(charts, ['duration', 'efficiency', 'stages'])}
        </div>
        <div class="col">
          <div class="col-label">Historical (1 Year)</div>
          ${histTable}
          ${renderCharts(charts, ['durationHistorical', 'efficiencyHistorical', 'stagesHistorical'])}
        </div>
      </div>
    </div>
  `;
}
