// PDF section: fasting (eating windows, fasting duration)

import type { FastingData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, fmtShortDate, renderCharts, escapeHtml } from '../helpers.js';

export function renderFastingSection(
  data: FastingData,
  charts: SectionCharts,
): string {
  const stats = `
    <div class="stat-grid cols-3">
      ${statCard('Avg Eating Window', fmtNum(data.averageEatingWindow, 1), 'hrs')}
      ${statCard('Avg Fasting', fmtNum(data.averageFastingHours, 1), 'hrs')}
      ${statCard('Days Tracked', String(data.daily.length))}
    </div>
    <div style="margin-bottom:8px;">
      Eating Window: ${trendBadge(data.stats.eatingWindow)}
    </div>
  `;

  // Daily fasting log (last 14 days)
  const recentDays = data.daily.slice(-14).reverse();
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

  return `
    <div class="section-card">
      <h2>Fasting</h2>
      ${stats}
      <h3>Recent Eating Windows</h3>
      ${dailyTable}
      ${renderCharts(charts, ['eatingWindowBar'])}
    </div>
  `;
}
