// PDF section: body composition (weight, BMI, body fat %)

import type { BodyData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderBodySection(
  data: { recent: BodyData; historical: BodyData },
  charts: SectionCharts,
): string {
  const { recent, historical } = data;

  // Latest values (use last entry or fall back to average)
  const latestWeight = recent.weight.length > 0
    ? recent.weight[recent.weight.length - 1].value
    : recent.stats.weight.average;
  const latestBmi = recent.bmi.length > 0
    ? recent.bmi[recent.bmi.length - 1].value
    : recent.stats.bmi.average;
  const latestBodyFat = recent.bodyFat.length > 0
    ? recent.bodyFat[recent.bodyFat.length - 1].value
    : recent.stats.bodyFat.average;

  const recentStats = `
    <div class="stat-grid cols-3">
      ${statCard('Current Weight', fmtNum(latestWeight, 1), 'kg')}
      ${statCard('Current BMI', fmtNum(latestBmi, 1))}
      ${statCard('Body Fat', fmtNum(latestBodyFat, 1), '%')}
    </div>
    <div style="margin-bottom:8px;">
      Weight: ${trendBadge(recent.stats.weight)}
      &nbsp; BMI: ${trendBadge(recent.stats.bmi)}
      &nbsp; Body Fat: ${trendBadge(recent.stats.bodyFat)}
    </div>
  `;

  // Stats comparison tables
  const recentTable = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Trend</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Weight (kg)</td>
          <td class="num">${fmtNum(recent.stats.weight.average, 1)}</td>
          <td class="num">${fmtNum(recent.stats.weight.min, 1)}</td>
          <td class="num">${fmtNum(recent.stats.weight.max, 1)}</td>
          <td>${trendBadge(recent.stats.weight)}</td>
        </tr>
        <tr>
          <td>BMI</td>
          <td class="num">${fmtNum(recent.stats.bmi.average, 1)}</td>
          <td class="num">${fmtNum(recent.stats.bmi.min, 1)}</td>
          <td class="num">${fmtNum(recent.stats.bmi.max, 1)}</td>
          <td>${trendBadge(recent.stats.bmi)}</td>
        </tr>
        <tr>
          <td>Body Fat (%)</td>
          <td class="num">${fmtNum(recent.stats.bodyFat.average, 1)}</td>
          <td class="num">${fmtNum(recent.stats.bodyFat.min, 1)}</td>
          <td class="num">${fmtNum(recent.stats.bodyFat.max, 1)}</td>
          <td>${trendBadge(recent.stats.bodyFat)}</td>
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
          <td>Weight (kg)</td>
          <td class="num">${fmtNum(historical.stats.weight.average, 1)}</td>
          <td class="num">${fmtNum(historical.stats.weight.min, 1)}</td>
          <td class="num">${fmtNum(historical.stats.weight.max, 1)}</td>
          <td>${trendBadge(historical.stats.weight)}</td>
        </tr>
        <tr>
          <td>BMI</td>
          <td class="num">${fmtNum(historical.stats.bmi.average, 1)}</td>
          <td class="num">${fmtNum(historical.stats.bmi.min, 1)}</td>
          <td class="num">${fmtNum(historical.stats.bmi.max, 1)}</td>
          <td>${trendBadge(historical.stats.bmi)}</td>
        </tr>
        <tr>
          <td>Body Fat (%)</td>
          <td class="num">${fmtNum(historical.stats.bodyFat.average, 1)}</td>
          <td class="num">${fmtNum(historical.stats.bodyFat.min, 1)}</td>
          <td class="num">${fmtNum(historical.stats.bodyFat.max, 1)}</td>
          <td>${trendBadge(historical.stats.bodyFat)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Body Composition</h2>
      ${recentStats}
      <div class="two-col">
        <div class="col">
          <div class="col-label">Recent (30 Days)</div>
          ${recentTable}
          ${renderCharts(charts, ['weight', 'bmi', 'bodyFat'])}
        </div>
        <div class="col">
          <div class="col-label">Historical (1 Year)</div>
          ${histTable}
          ${renderCharts(charts, ['weightHistorical', 'bmiHistorical', 'bodyFatHistorical'])}
        </div>
      </div>
    </div>
  `;
}
