// PDF section: executive summary with key highlights

import type { HealthReportData } from '../../types/report.js';
import { statCard, trendBadge, fmtNum } from '../helpers.js';

export function renderSummary(data: HealthReportData): string {
  const { activity, heart, sleep, body, vitals, cardio } = data;

  const cards: string[] = [];

  // Steps average
  cards.push(statCard('Avg Daily Steps', fmtNum(activity.recent.stats.steps.average)));

  // Active minutes
  cards.push(statCard('Avg Active Min', fmtNum(activity.recent.stats.activeMinutes.average), 'min'));

  // Resting heart rate
  cards.push(statCard('Resting HR', fmtNum(heart.recent.stats.restingHR.average), 'bpm'));

  // HRV
  cards.push(statCard('HRV (RMSSD)', fmtNum(heart.recent.stats.hrv.average, 1), 'ms'));

  // Sleep duration
  cards.push(statCard('Avg Sleep', fmtNum(sleep.recent.stats.duration.average, 1), 'hrs'));

  // Sleep efficiency
  cards.push(statCard('Sleep Efficiency', fmtNum(sleep.recent.stats.efficiency.average, 1), '%'));

  // Weight
  const latestWeight = body.recent.weight.length > 0
    ? body.recent.weight[body.recent.weight.length - 1].value
    : body.recent.stats.weight.average;
  cards.push(statCard('Weight', fmtNum(latestWeight, 1), 'kg'));

  // VO2 Max
  const latestVo2 = cardio.recent.vo2Max.length > 0
    ? cardio.recent.vo2Max[cardio.recent.vo2Max.length - 1].value
    : cardio.recent.stats.vo2Max.average;
  cards.push(statCard('VO2 Max', fmtNum(latestVo2, 1), 'ml/kg/min'));

  // Trend badges row
  const trends: Array<{ label: string; stats: { trend: string; percentChange: number } }> = [
    { label: 'Steps', stats: activity.recent.stats.steps },
    { label: 'Resting HR', stats: heart.recent.stats.restingHR },
    { label: 'Sleep', stats: sleep.recent.stats.duration },
    { label: 'Weight', stats: body.recent.stats.weight },
    { label: 'VO2 Max', stats: cardio.recent.stats.vo2Max },
  ];

  // SpO2 if available
  if (vitals.recent.spo2.length > 0) {
    cards.push(statCard('Avg SpO2', fmtNum(vitals.recent.stats.spo2.average, 1), '%'));
  }

  const trendItems = trends
    .map(
      (t) =>
        `<div style="display:inline-block;margin-right:12px;margin-bottom:4px;">
          <span style="font-size:9px;color:#4a5568;margin-right:4px;">${t.label}:</span>
          ${trendBadge(t.stats as any)}
        </div>`,
    )
    .join('');

  return `
    <div class="section-card">
      <h2>Summary</h2>
      <div class="summary-grid" style="grid-template-columns: repeat(4, 1fr);">
        ${cards.slice(0, 4).join('\n')}
      </div>
      <div class="summary-grid" style="grid-template-columns: repeat(4, 1fr);">
        ${cards.slice(4, 8).join('\n')}
      </div>
      ${cards.length > 8 ? `<div class="stat-grid cols-3">${cards.slice(8).join('\n')}</div>` : ''}
      <h3>30-Day Trends</h3>
      <div style="margin-top:6px;">
        ${trendItems}
      </div>
    </div>
  `;
}
