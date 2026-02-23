// PDF section: vitals (SpO2, breathing rate, skin temperature)

import type { VitalsData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderVitalsSection(
  data: { recent: VitalsData; historical: VitalsData },
  charts: SectionCharts,
): string {
  const { recent, historical } = data;

  const recentStats = `
    <div class="stat-grid cols-3">
      ${statCard('Avg SpO2', fmtNum(recent.stats.spo2.average, 1), '%')}
      ${statCard('Avg Breathing Rate', fmtNum(recent.stats.breathingRate.average, 1), 'br/min')}
      ${statCard('Avg Skin Temp Var', fmtNum(recent.stats.skinTemp.average, 2), '\u00B0')}
    </div>
    <div style="margin-bottom:8px;">
      SpO2: ${trendBadge(recent.stats.spo2)}
      &nbsp; Breathing Rate: ${trendBadge(recent.stats.breathingRate)}
      &nbsp; Skin Temp: ${trendBadge(recent.stats.skinTemp)}
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
          <td>SpO2 (%)</td>
          <td class="num">${fmtNum(recent.stats.spo2.average, 1)}</td>
          <td class="num">${fmtNum(recent.stats.spo2.min, 1)}</td>
          <td class="num">${fmtNum(recent.stats.spo2.max, 1)}</td>
          <td>${trendBadge(recent.stats.spo2)}</td>
        </tr>
        <tr>
          <td>Breathing Rate (br/min)</td>
          <td class="num">${fmtNum(recent.stats.breathingRate.average, 1)}</td>
          <td class="num">${fmtNum(recent.stats.breathingRate.min, 1)}</td>
          <td class="num">${fmtNum(recent.stats.breathingRate.max, 1)}</td>
          <td>${trendBadge(recent.stats.breathingRate)}</td>
        </tr>
        <tr>
          <td>Skin Temp Variation</td>
          <td class="num">${fmtNum(recent.stats.skinTemp.average, 2)}</td>
          <td class="num">${fmtNum(recent.stats.skinTemp.min, 2)}</td>
          <td class="num">${fmtNum(recent.stats.skinTemp.max, 2)}</td>
          <td>${trendBadge(recent.stats.skinTemp)}</td>
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
          <td>SpO2 (%)</td>
          <td class="num">${fmtNum(historical.stats.spo2.average, 1)}</td>
          <td class="num">${fmtNum(historical.stats.spo2.min, 1)}</td>
          <td class="num">${fmtNum(historical.stats.spo2.max, 1)}</td>
          <td>${trendBadge(historical.stats.spo2)}</td>
        </tr>
        <tr>
          <td>Breathing Rate (br/min)</td>
          <td class="num">${fmtNum(historical.stats.breathingRate.average, 1)}</td>
          <td class="num">${fmtNum(historical.stats.breathingRate.min, 1)}</td>
          <td class="num">${fmtNum(historical.stats.breathingRate.max, 1)}</td>
          <td>${trendBadge(historical.stats.breathingRate)}</td>
        </tr>
        <tr>
          <td>Skin Temp Variation</td>
          <td class="num">${fmtNum(historical.stats.skinTemp.average, 2)}</td>
          <td class="num">${fmtNum(historical.stats.skinTemp.min, 2)}</td>
          <td class="num">${fmtNum(historical.stats.skinTemp.max, 2)}</td>
          <td>${trendBadge(historical.stats.skinTemp)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Vitals</h2>
      ${recentStats}
      <div class="two-col">
        <div class="col">
          <div class="col-label">Recent (30 Days)</div>
          ${recentTable}
          ${renderCharts(charts, ['spo2', 'breathingRate', 'skinTemp'])}
        </div>
        <div class="col">
          <div class="col-label">Historical (1 Year)</div>
          ${histTable}
          ${renderCharts(charts, ['spo2Historical', 'breathingRateHistorical', 'skinTempHistorical'])}
        </div>
      </div>
    </div>
  `;
}
