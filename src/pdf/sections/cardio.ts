// PDF section: cardio fitness (VO2 Max)

import type { CardioData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderCardioSection(
  data: { recent: CardioData; historical: CardioData },
  charts: SectionCharts,
): string {
  const { recent, historical } = data;

  // Latest VO2 Max value
  const latestVo2 = recent.vo2Max.length > 0
    ? recent.vo2Max[recent.vo2Max.length - 1].value
    : recent.stats.vo2Max.average;

  const recentStats = `
    <div class="stat-grid">
      ${statCard('Current VO2 Max', fmtNum(latestVo2, 1), 'ml/kg/min')}
      ${statCard('Avg VO2 Max', fmtNum(recent.stats.vo2Max.average, 1), 'ml/kg/min')}
      ${statCard('Min', fmtNum(recent.stats.vo2Max.min, 1), 'ml/kg/min')}
      ${statCard('Max', fmtNum(recent.stats.vo2Max.max, 1), 'ml/kg/min')}
    </div>
    <div style="margin-bottom:8px;">
      VO2 Max: ${trendBadge(recent.stats.vo2Max)}
    </div>
  `;

  const recentTable = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Trend</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>VO2 Max (ml/kg/min)</td>
          <td class="num">${fmtNum(recent.stats.vo2Max.average, 1)}</td>
          <td class="num">${fmtNum(recent.stats.vo2Max.min, 1)}</td>
          <td class="num">${fmtNum(recent.stats.vo2Max.max, 1)}</td>
          <td>${trendBadge(recent.stats.vo2Max)}</td>
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
          <td>VO2 Max (ml/kg/min)</td>
          <td class="num">${fmtNum(historical.stats.vo2Max.average, 1)}</td>
          <td class="num">${fmtNum(historical.stats.vo2Max.min, 1)}</td>
          <td class="num">${fmtNum(historical.stats.vo2Max.max, 1)}</td>
          <td>${trendBadge(historical.stats.vo2Max)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Cardio Fitness</h2>
      ${recentStats}
      <div class="two-col">
        <div class="col">
          <div class="col-label">Recent (30 Days)</div>
          ${recentTable}
          ${renderCharts(charts, ['vo2Max'])}
        </div>
        <div class="col">
          <div class="col-label">Historical (1 Year)</div>
          ${histTable}
          ${renderCharts(charts, ['vo2MaxHistorical'])}
        </div>
      </div>
    </div>
  `;
}
