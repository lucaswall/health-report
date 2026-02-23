// PDF section: fasting (eating windows, fasting duration)

import type { FastingData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, fmtShortDate, renderCharts, escapeHtml } from '../helpers.js';

export function renderFastingSection(
  data: { recent: FastingData; historical: FastingData } | null,
  charts: SectionCharts | null,
): string {
  if (!data) {
    return `
      <div class="section-card">
        <h2>Fasting</h2>
        <div class="data-unavailable">
          Fasting data unavailable. Connect a food tracking source to include this section.
        </div>
      </div>
    `;
  }

  const { recent, historical } = data;

  const recentStats = `
    <div class="stat-grid cols-3">
      ${statCard('Avg Eating Window', fmtNum(recent.averageEatingWindow, 1), 'hrs')}
      ${statCard('Avg Fasting', fmtNum(recent.averageFastingHours, 1), 'hrs')}
      ${statCard('Days Tracked', String(recent.daily.length))}
    </div>
    <div style="margin-bottom:8px;">
      Eating Window: ${trendBadge(recent.stats.eatingWindow)}
    </div>
  `;

  // Daily fasting log (last 14 days)
  const recentDays = recent.daily.slice(-14).reverse();
  const dailyRows = recentDays
    .map(
      (day) => `
        <tr>
          <td>${fmtShortDate(day.date)}</td>
          <td>${escapeHtml(day.firstMeal)}</td>
          <td>${escapeHtml(day.lastMeal)}</td>
          <td class="num">${fmtNum(day.eatingWindowHours, 1)}</td>
          <td class="num">${fmtNum(day.fastingHours, 1)}</td>
        </tr>`,
    )
    .join('');

  const dailyTable = `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>First Meal</th>
          <th>Last Meal</th>
          <th>Eating Window (hrs)</th>
          <th>Fast (hrs)</th>
        </tr>
      </thead>
      <tbody>
        ${dailyRows || '<tr><td colspan="5" style="text-align:center;color:#a0aec0;">No fasting data</td></tr>'}
      </tbody>
    </table>
  `;

  // Historical stats
  const histStats = `
    <div class="stat-grid cols-3">
      ${statCard('Avg Eating Window', fmtNum(historical.averageEatingWindow, 1), 'hrs')}
      ${statCard('Avg Fasting', fmtNum(historical.averageFastingHours, 1), 'hrs')}
      ${statCard('Days Tracked', String(historical.daily.length))}
    </div>
    <div style="margin-bottom:8px;">
      Eating Window: ${trendBadge(historical.stats.eatingWindow)}
    </div>
  `;

  const sectionCharts = charts ?? {};

  return `
    <div class="section-card">
      <h2>Fasting</h2>
      ${recentStats}
      <div class="two-col">
        <div class="col">
          <div class="col-label">Recent (30 Days)</div>
          <h3>Recent Eating Windows</h3>
          ${dailyTable}
          ${renderCharts(sectionCharts, ['eatingWindow', 'fastingHours'])}
        </div>
        <div class="col">
          <div class="col-label">Historical (1 Year)</div>
          ${histStats}
          ${renderCharts(sectionCharts, ['eatingWindowHistorical', 'fastingHoursHistorical'])}
        </div>
      </div>
    </div>
  `;
}
