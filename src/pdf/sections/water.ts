// PDF section: water intake

import type { WaterData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderWaterSection(
  data: { recent: WaterData; historical: WaterData },
  charts: SectionCharts,
): string {
  const { recent, historical } = data;

  const latestWater = recent.daily.length > 0
    ? recent.daily[recent.daily.length - 1].value
    : recent.stats.water.average;

  const recentStats = `
    <div class="stat-grid">
      ${statCard('Latest Intake', fmtNum(latestWater), 'ml')}
      ${statCard('Avg Intake', fmtNum(recent.stats.water.average), 'ml')}
      ${statCard('Min', fmtNum(recent.stats.water.min), 'ml')}
      ${statCard('Max', fmtNum(recent.stats.water.max), 'ml')}
    </div>
    <div style="margin-bottom:8px;">
      Water Intake: ${trendBadge(recent.stats.water)}
    </div>
  `;

  const recentTable = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Trend</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Water (ml)</td>
          <td class="num">${fmtNum(recent.stats.water.average)}</td>
          <td class="num">${fmtNum(recent.stats.water.min)}</td>
          <td class="num">${fmtNum(recent.stats.water.max)}</td>
          <td>${trendBadge(recent.stats.water)}</td>
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
          <td>Water (ml)</td>
          <td class="num">${fmtNum(historical.stats.water.average)}</td>
          <td class="num">${fmtNum(historical.stats.water.min)}</td>
          <td class="num">${fmtNum(historical.stats.water.max)}</td>
          <td>${trendBadge(historical.stats.water)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Water Intake</h2>
      ${recentStats}
      <div class="two-col">
        <div class="col">
          <div class="col-label">Recent (30 Days)</div>
          ${recentTable}
          ${renderCharts(charts, ['waterTrend'])}
        </div>
        <div class="col">
          <div class="col-label">Historical (1 Year)</div>
          ${histTable}
          ${renderCharts(charts, ['waterHistorical'])}
        </div>
      </div>
    </div>
  `;
}
