// PDF section: blood glucose

import type { GlucoseData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderGlucoseSection(
  data: { recent: GlucoseData; historical: GlucoseData },
  charts: SectionCharts,
): string {
  const { recent, historical } = data;

  const latestGlucose = recent.daily.avg.length > 0
    ? recent.daily.avg[recent.daily.avg.length - 1].value
    : recent.stats.glucose.average;

  const recentStats = `
    <div class="stat-grid">
      ${statCard('Latest Avg', fmtNum(latestGlucose, 1), 'mg/dL')}
      ${statCard('Avg Glucose', fmtNum(recent.stats.glucose.average, 1), 'mg/dL')}
      ${statCard('Min', fmtNum(recent.stats.glucose.min, 1), 'mg/dL')}
      ${statCard('Max', fmtNum(recent.stats.glucose.max, 1), 'mg/dL')}
    </div>
    <div style="margin-bottom:8px;">
      Blood Glucose: ${trendBadge(recent.stats.glucose)}
    </div>
  `;

  const recentTable = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Trend</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Glucose (mg/dL)</td>
          <td class="num">${fmtNum(recent.stats.glucose.average, 1)}</td>
          <td class="num">${fmtNum(recent.stats.glucose.min, 1)}</td>
          <td class="num">${fmtNum(recent.stats.glucose.max, 1)}</td>
          <td>${trendBadge(recent.stats.glucose)}</td>
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
          <td>Glucose (mg/dL)</td>
          <td class="num">${fmtNum(historical.stats.glucose.average, 1)}</td>
          <td class="num">${fmtNum(historical.stats.glucose.min, 1)}</td>
          <td class="num">${fmtNum(historical.stats.glucose.max, 1)}</td>
          <td>${trendBadge(historical.stats.glucose)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Blood Glucose</h2>
      ${recentStats}
      <div class="two-col">
        <div class="col">
          <div class="col-label">Recent (30 Days)</div>
          ${recentTable}
          ${renderCharts(charts, ['glucoseTrend'])}
        </div>
        <div class="col">
          <div class="col-label">Historical (1 Year)</div>
          ${histTable}
          ${renderCharts(charts, ['glucoseHistorical'])}
        </div>
      </div>
    </div>
  `;
}
