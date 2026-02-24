// Shared HTML helper functions for PDF sections

import type { TrendStats } from '../types/report.js';
import type { ChartImage } from '../types/charts.js';

/**
 * Render a colored badge showing trend direction and percent change.
 */
export function trendBadge(stats: Pick<TrendStats, 'trend' | 'percentChange'>): string {
  const label =
    stats.trend === 'improving'
      ? `Improving ${stats.percentChange > 0 ? '+' : ''}${stats.percentChange}%`
      : stats.trend === 'declining'
        ? `Declining ${stats.percentChange}%`
        : 'Stable';

  return `<span class="trend-badge ${stats.trend}">${escapeHtml(label)}</span>`;
}

/**
 * Render a single stat card with value, optional unit, and label.
 */
export function statCard(label: string, value: string | number, unit?: string): string {
  const unitHtml = unit ? `<span class="stat-unit">${escapeHtml(unit)}</span>` : '';
  return `
    <div class="stat-card">
      <div class="stat-value">${escapeHtml(String(value))}${unitHtml}</div>
      <div class="stat-label">${escapeHtml(label)}</div>
    </div>
  `;
}

/**
 * Render a chart image as an <img> tag with base64 data URI source.
 */
export function chartImg(chart: ChartImage): string {
  return `
    <div class="chart-container">
      <img src="${chart.base64}" width="${chart.width}" height="${chart.height}" alt="Chart" />
    </div>
  `;
}

/**
 * Render all charts from a SectionCharts map, skipping missing keys.
 */
export function renderCharts(charts: Record<string, ChartImage>, keys: string[]): string {
  return keys
    .filter((key) => charts[key])
    .map((key) => chartImg(charts[key]))
    .join('\n');
}

/**
 * Escape HTML special characters.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Format a number with locale-appropriate thousands separators.
 */
export function fmtNum(value: number, decimals: number = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a date string (YYYY-MM-DD) to a short human-readable form.
 */
export function fmtDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format a date string (YYYY-MM-DD) to short form without year.
 */
export function fmtShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
