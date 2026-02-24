// PDF section: heart rate data (resting HR, HRV, zones)

import type { HeartData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderHeartSection(
  data: HeartData,
  charts: SectionCharts,
): string {
  const stats = `
    <div class="stat-grid">
      ${statCard('Avg Resting HR', fmtNum(data.stats.restingHR.average), 'bpm')}
      ${statCard('Min Resting HR', fmtNum(data.stats.restingHR.min), 'bpm')}
      ${statCard('Max Resting HR', fmtNum(data.stats.restingHR.max), 'bpm')}
      ${statCard('Avg HRV', fmtNum(data.stats.hrv.average, 1), 'ms')}
    </div>
    <div style="margin-bottom:8px;">
      Resting HR: ${trendBadge(data.stats.restingHR)}
      &nbsp; HRV: ${trendBadge(data.stats.hrv)}
    </div>
  `;

  // HR zone distribution table
  const totalZoneMin =
    data.zones.outOfRange +
    data.zones.fatBurn +
    data.zones.cardio +
    data.zones.peak;

  function zonePct(minutes: number): string {
    if (totalZoneMin === 0) return '0%';
    return fmtNum((minutes / totalZoneMin) * 100, 1) + '%';
  }

  const zonesTable = `
    <table>
      <thead>
        <tr>
          <th>Zone</th>
          <th>Minutes</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Out of Range</td><td class="num">${fmtNum(data.zones.outOfRange)}</td><td class="num">${zonePct(data.zones.outOfRange)}</td></tr>
        <tr><td>Fat Burn</td><td class="num">${fmtNum(data.zones.fatBurn)}</td><td class="num">${zonePct(data.zones.fatBurn)}</td></tr>
        <tr><td>Cardio</td><td class="num">${fmtNum(data.zones.cardio)}</td><td class="num">${zonePct(data.zones.cardio)}</td></tr>
        <tr><td>Peak</td><td class="num">${fmtNum(data.zones.peak)}</td><td class="num">${zonePct(data.zones.peak)}</td></tr>
      </tbody>
    </table>
  `;

  const statsTable = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Trend</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Resting HR</td>
          <td class="num">${fmtNum(data.stats.restingHR.average)}</td>
          <td class="num">${fmtNum(data.stats.restingHR.min)}</td>
          <td class="num">${fmtNum(data.stats.restingHR.max)}</td>
          <td>${trendBadge(data.stats.restingHR)}</td>
        </tr>
        <tr>
          <td>HRV (RMSSD)</td>
          <td class="num">${fmtNum(data.stats.hrv.average, 1)}</td>
          <td class="num">${fmtNum(data.stats.hrv.min, 1)}</td>
          <td class="num">${fmtNum(data.stats.hrv.max, 1)}</td>
          <td>${trendBadge(data.stats.hrv)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Heart Rate</h2>
      ${stats}
      <h3>HR Zone Distribution</h3>
      ${zonesTable}
      ${statsTable}
      ${renderCharts(charts, ['restingHRLine', 'hrvLine', 'zonesDoughnut'])}
    </div>
  `;
}
