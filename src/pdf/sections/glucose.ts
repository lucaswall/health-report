// PDF section: blood glucose

import type { GlucoseData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderGlucoseSection(
  data: GlucoseData,
  charts: SectionCharts,
): string {
  const latestGlucose = data.daily.avg.length > 0
    ? data.daily.avg[data.daily.avg.length - 1].value
    : data.stats.glucose.average;

  const stats = `
    <div class="stat-grid">
      ${statCard('Latest Avg', fmtNum(latestGlucose, 1), 'mg/dL')}
      ${statCard('Avg Glucose', fmtNum(data.stats.glucose.average, 1), 'mg/dL')}
      ${statCard('Min', fmtNum(data.stats.glucose.min, 1), 'mg/dL')}
      ${statCard('Max', fmtNum(data.stats.glucose.max, 1), 'mg/dL')}
    </div>
    <div style="margin-bottom:8px;">
      Blood Glucose: ${trendBadge(data.stats.glucose)}
    </div>
  `;

  const statsTable = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Trend</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Glucose (mg/dL)</td>
          <td class="num">${fmtNum(data.stats.glucose.average, 1)}</td>
          <td class="num">${fmtNum(data.stats.glucose.min, 1)}</td>
          <td class="num">${fmtNum(data.stats.glucose.max, 1)}</td>
          <td>${trendBadge(data.stats.glucose)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Blood Glucose</h2>
      ${stats}
      ${statsTable}
      ${renderCharts(charts, ['glucoseTrend'])}
    </div>
  `;
}
