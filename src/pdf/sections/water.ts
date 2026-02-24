// PDF section: water intake

import type { WaterData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderWaterSection(
  data: WaterData,
  charts: SectionCharts,
): string {
  const latestWater = data.daily.length > 0
    ? data.daily[data.daily.length - 1].value
    : data.stats.water.average;

  const stats = `
    <div class="stat-grid">
      ${statCard('Latest Intake', fmtNum(latestWater), 'ml')}
      ${statCard('Avg Intake', fmtNum(data.stats.water.average), 'ml')}
      ${statCard('Min', fmtNum(data.stats.water.min), 'ml')}
      ${statCard('Max', fmtNum(data.stats.water.max), 'ml')}
    </div>
    <div style="margin-bottom:8px;">
      Water Intake: ${trendBadge(data.stats.water)}
    </div>
  `;

  const statsTable = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Trend</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Water (ml)</td>
          <td class="num">${fmtNum(data.stats.water.average)}</td>
          <td class="num">${fmtNum(data.stats.water.min)}</td>
          <td class="num">${fmtNum(data.stats.water.max)}</td>
          <td>${trendBadge(data.stats.water)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Water Intake</h2>
      ${stats}
      ${statsTable}
      ${renderCharts(charts, ['waterTrend'])}
    </div>
  `;
}
