// PDF section: cardio fitness (VO2 Max)

import type { CardioData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderCardioSection(
  data: CardioData,
  charts: SectionCharts,
): string {
  // Latest VO2 Max value
  const latestVo2 = data.vo2Max.length > 0
    ? data.vo2Max[data.vo2Max.length - 1].value
    : data.stats.vo2Max.average;

  const stats = `
    <div class="stat-grid">
      ${statCard('Current VO2 Max', fmtNum(latestVo2, 1), 'ml/kg/min')}
      ${statCard('Avg VO2 Max', fmtNum(data.stats.vo2Max.average, 1), 'ml/kg/min')}
      ${statCard('Min', fmtNum(data.stats.vo2Max.min, 1), 'ml/kg/min')}
      ${statCard('Max', fmtNum(data.stats.vo2Max.max, 1), 'ml/kg/min')}
    </div>
    <div style="margin-bottom:8px;">
      VO2 Max: ${trendBadge(data.stats.vo2Max)}
    </div>
  `;

  const statsTable = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Trend</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>VO2 Max (ml/kg/min)</td>
          <td class="num">${fmtNum(data.stats.vo2Max.average, 1)}</td>
          <td class="num">${fmtNum(data.stats.vo2Max.min, 1)}</td>
          <td class="num">${fmtNum(data.stats.vo2Max.max, 1)}</td>
          <td>${trendBadge(data.stats.vo2Max)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Cardio Fitness</h2>
      ${stats}
      ${statsTable}
      ${renderCharts(charts, ['vo2MaxTrend'])}
    </div>
  `;
}
