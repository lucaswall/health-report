// PDF section: body composition (weight, BMI, body fat %)

import type { BodyData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderBodySection(
  data: BodyData,
  charts: SectionCharts,
): string {
  // Latest values (use last entry or fall back to average)
  const latestWeight = data.weight.length > 0
    ? data.weight[data.weight.length - 1].value
    : data.stats.weight.average;
  const latestBmi = data.bmi.length > 0
    ? data.bmi[data.bmi.length - 1].value
    : data.stats.bmi.average;
  const latestBodyFat = data.bodyFat.length > 0
    ? data.bodyFat[data.bodyFat.length - 1].value
    : data.stats.bodyFat.average;

  const stats = `
    <div class="stat-grid cols-3">
      ${statCard('Current Weight', fmtNum(latestWeight, 1), 'kg')}
      ${statCard('Current BMI', fmtNum(latestBmi, 1))}
      ${statCard('Body Fat', fmtNum(latestBodyFat, 1), '%')}
    </div>
    <div style="margin-bottom:8px;">
      Weight: ${trendBadge(data.stats.weight)}
      &nbsp; BMI: ${trendBadge(data.stats.bmi)}
      &nbsp; Body Fat: ${trendBadge(data.stats.bodyFat)}
    </div>
  `;

  const statsTable = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Trend</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Weight (kg)</td>
          <td class="num">${fmtNum(data.stats.weight.average, 1)}</td>
          <td class="num">${fmtNum(data.stats.weight.min, 1)}</td>
          <td class="num">${fmtNum(data.stats.weight.max, 1)}</td>
          <td>${trendBadge(data.stats.weight)}</td>
        </tr>
        <tr>
          <td>BMI</td>
          <td class="num">${fmtNum(data.stats.bmi.average, 1)}</td>
          <td class="num">${fmtNum(data.stats.bmi.min, 1)}</td>
          <td class="num">${fmtNum(data.stats.bmi.max, 1)}</td>
          <td>${trendBadge(data.stats.bmi)}</td>
        </tr>
        <tr>
          <td>Body Fat (%)</td>
          <td class="num">${fmtNum(data.stats.bodyFat.average, 1)}</td>
          <td class="num">${fmtNum(data.stats.bodyFat.min, 1)}</td>
          <td class="num">${fmtNum(data.stats.bodyFat.max, 1)}</td>
          <td>${trendBadge(data.stats.bodyFat)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Body Composition</h2>
      ${stats}
      ${statsTable}
      ${renderCharts(charts, ['weightTrend', 'bodyFatTrend'])}
    </div>
  `;
}
