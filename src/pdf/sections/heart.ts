// PDF section: heart rate data (resting HR, HRV, zones)

import type { HeartData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderHeartSection(
  data: { recent: HeartData; historical: HeartData },
  charts: SectionCharts,
): string {
  const { recent, historical } = data;

  const recentStats = `
    <div class="stat-grid">
      ${statCard('Avg Resting HR', fmtNum(recent.stats.restingHR.average), 'bpm')}
      ${statCard('Min Resting HR', fmtNum(recent.stats.restingHR.min), 'bpm')}
      ${statCard('Max Resting HR', fmtNum(recent.stats.restingHR.max), 'bpm')}
      ${statCard('Avg HRV', fmtNum(recent.stats.hrv.average, 1), 'ms')}
    </div>
    <div style="margin-bottom:8px;">
      Resting HR: ${trendBadge(recent.stats.restingHR)}
      &nbsp; HRV: ${trendBadge(recent.stats.hrv)}
    </div>
  `;

  // HR zone distribution table
  const totalZoneMin =
    recent.zones.outOfRange +
    recent.zones.fatBurn +
    recent.zones.cardio +
    recent.zones.peak;

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
        <tr><td>Out of Range</td><td class="num">${fmtNum(recent.zones.outOfRange)}</td><td class="num">${zonePct(recent.zones.outOfRange)}</td></tr>
        <tr><td>Fat Burn</td><td class="num">${fmtNum(recent.zones.fatBurn)}</td><td class="num">${zonePct(recent.zones.fatBurn)}</td></tr>
        <tr><td>Cardio</td><td class="num">${fmtNum(recent.zones.cardio)}</td><td class="num">${zonePct(recent.zones.cardio)}</td></tr>
        <tr><td>Peak</td><td class="num">${fmtNum(recent.zones.peak)}</td><td class="num">${zonePct(recent.zones.peak)}</td></tr>
      </tbody>
    </table>
  `;

  // Stats comparison tables
  const recentTable = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Trend</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Resting HR</td>
          <td class="num">${fmtNum(recent.stats.restingHR.average)}</td>
          <td class="num">${fmtNum(recent.stats.restingHR.min)}</td>
          <td class="num">${fmtNum(recent.stats.restingHR.max)}</td>
          <td>${trendBadge(recent.stats.restingHR)}</td>
        </tr>
        <tr>
          <td>HRV (RMSSD)</td>
          <td class="num">${fmtNum(recent.stats.hrv.average, 1)}</td>
          <td class="num">${fmtNum(recent.stats.hrv.min, 1)}</td>
          <td class="num">${fmtNum(recent.stats.hrv.max, 1)}</td>
          <td>${trendBadge(recent.stats.hrv)}</td>
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
          <td>Resting HR</td>
          <td class="num">${fmtNum(historical.stats.restingHR.average)}</td>
          <td class="num">${fmtNum(historical.stats.restingHR.min)}</td>
          <td class="num">${fmtNum(historical.stats.restingHR.max)}</td>
          <td>${trendBadge(historical.stats.restingHR)}</td>
        </tr>
        <tr>
          <td>HRV (RMSSD)</td>
          <td class="num">${fmtNum(historical.stats.hrv.average, 1)}</td>
          <td class="num">${fmtNum(historical.stats.hrv.min, 1)}</td>
          <td class="num">${fmtNum(historical.stats.hrv.max, 1)}</td>
          <td>${trendBadge(historical.stats.hrv)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Heart Rate</h2>
      ${recentStats}
      <h3>HR Zone Distribution (30 Days)</h3>
      ${zonesTable}
      <div class="two-col">
        <div class="col">
          <div class="col-label">Recent (30 Days)</div>
          ${recentTable}
          ${renderCharts(charts, ['restingHR', 'hrv', 'zones'])}
        </div>
        <div class="col">
          <div class="col-label">Historical (1 Year)</div>
          ${histTable}
          ${renderCharts(charts, ['restingHRHistorical', 'hrvHistorical'])}
        </div>
      </div>
    </div>
  `;
}
