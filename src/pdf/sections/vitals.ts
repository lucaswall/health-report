// PDF section: vitals (SpO2, breathing rate, skin temperature)

import type { VitalsData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderVitalsSection(
  data: VitalsData,
  charts: SectionCharts,
): string {
  const stats = `
    <div class="stat-grid cols-3">
      ${statCard('Avg SpO2', fmtNum(data.stats.spo2.average, 1), '%')}
      ${statCard('Avg Breathing Rate', fmtNum(data.stats.breathingRate.average, 1), 'br/min')}
      ${statCard('Avg Skin Temp Var', fmtNum(data.stats.skinTemp.average, 2), '\u00B0')}
    </div>
    <div style="margin-bottom:8px;">
      SpO2: ${trendBadge(data.stats.spo2)}
      &nbsp; Breathing Rate: ${trendBadge(data.stats.breathingRate)}
      &nbsp; Skin Temp: ${trendBadge(data.stats.skinTemp)}
    </div>
  `;

  const statsTable = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Trend</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>SpO2 (%)</td>
          <td class="num">${fmtNum(data.stats.spo2.average, 1)}</td>
          <td class="num">${fmtNum(data.stats.spo2.min, 1)}</td>
          <td class="num">${fmtNum(data.stats.spo2.max, 1)}</td>
          <td>${trendBadge(data.stats.spo2)}</td>
        </tr>
        <tr>
          <td>Breathing Rate (br/min)</td>
          <td class="num">${fmtNum(data.stats.breathingRate.average, 1)}</td>
          <td class="num">${fmtNum(data.stats.breathingRate.min, 1)}</td>
          <td class="num">${fmtNum(data.stats.breathingRate.max, 1)}</td>
          <td>${trendBadge(data.stats.breathingRate)}</td>
        </tr>
        <tr>
          <td>Skin Temp Variation</td>
          <td class="num">${fmtNum(data.stats.skinTemp.average, 2)}</td>
          <td class="num">${fmtNum(data.stats.skinTemp.min, 2)}</td>
          <td class="num">${fmtNum(data.stats.skinTemp.max, 2)}</td>
          <td>${trendBadge(data.stats.skinTemp)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Vitals</h2>
      ${stats}
      ${statsTable}
      ${renderCharts(charts, ['spo2Line', 'breathingRateLine', 'skinTempLine'])}
    </div>
  `;
}
