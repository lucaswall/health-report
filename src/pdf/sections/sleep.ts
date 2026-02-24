// PDF section: sleep data (duration, efficiency, stages)

import type { SleepData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderSleepSection(
  data: SleepData,
  charts: SectionCharts,
): string {
  const stats = `
    <div class="stat-grid">
      ${statCard('Avg Duration', fmtNum(data.stats.duration.average, 1), 'hrs')}
      ${statCard('Avg Efficiency', fmtNum(data.stats.efficiency.average, 1), '%')}
      ${statCard('Deep Sleep', fmtNum(data.averageStages.deep, 1), '%')}
      ${statCard('REM Sleep', fmtNum(data.averageStages.rem, 1), '%')}
    </div>
    <div style="margin-bottom:8px;">
      Duration: ${trendBadge(data.stats.duration)}
      &nbsp; Efficiency: ${trendBadge(data.stats.efficiency)}
    </div>
  `;

  // Stage breakdown table
  const stagesTable = `
    <table>
      <thead>
        <tr><th>Stage</th><th>Avg %</th></tr>
      </thead>
      <tbody>
        <tr><td>Deep</td><td class="num">${fmtNum(data.averageStages.deep, 1)}%</td></tr>
        <tr><td>Light</td><td class="num">${fmtNum(data.averageStages.light, 1)}%</td></tr>
        <tr><td>REM</td><td class="num">${fmtNum(data.averageStages.rem, 1)}%</td></tr>
        <tr><td>Wake</td><td class="num">${fmtNum(data.averageStages.wake, 1)}%</td></tr>
      </tbody>
    </table>
  `;

  const statsTable = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Trend</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Duration (hrs)</td>
          <td class="num">${fmtNum(data.stats.duration.average, 1)}</td>
          <td class="num">${fmtNum(data.stats.duration.min, 1)}</td>
          <td class="num">${fmtNum(data.stats.duration.max, 1)}</td>
          <td>${trendBadge(data.stats.duration)}</td>
        </tr>
        <tr>
          <td>Efficiency (%)</td>
          <td class="num">${fmtNum(data.stats.efficiency.average, 1)}</td>
          <td class="num">${fmtNum(data.stats.efficiency.min, 1)}</td>
          <td class="num">${fmtNum(data.stats.efficiency.max, 1)}</td>
          <td>${trendBadge(data.stats.efficiency)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Sleep</h2>
      ${stats}
      <h3>Sleep Stage Breakdown</h3>
      ${stagesTable}
      ${statsTable}
      ${renderCharts(charts, ['durationBars', 'stageStackedBars', 'efficiencyLine'])}
    </div>
  `;
}
