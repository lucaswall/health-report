// PDF section: nutrition (calories, macros)

import type { NutritionData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderNutritionSection(
  data: { recent: NutritionData; historical: NutritionData } | null,
  charts: SectionCharts | null,
): string {
  if (!data) {
    return `
      <div class="section-card">
        <h2>Nutrition</h2>
        <div class="data-unavailable">
          Nutrition data unavailable. Connect a food tracking source to include this section.
        </div>
      </div>
    `;
  }

  const { recent, historical } = data;

  const recentStats = `
    <div class="stat-grid">
      ${statCard('Avg Calories', fmtNum(recent.stats.calories.average), 'kcal')}
      ${statCard('Avg Protein', fmtNum(recent.stats.protein.average, 1), 'g')}
      ${statCard('Avg Carbs', fmtNum(recent.stats.carbs.average, 1), 'g')}
      ${statCard('Avg Fat', fmtNum(recent.stats.fat.average, 1), 'g')}
    </div>
    <div style="margin-bottom:8px;">
      Calories: ${trendBadge(recent.stats.calories)}
      &nbsp; Protein: ${trendBadge(recent.stats.protein)}
    </div>
  `;

  // Macros breakdown
  const macrosTable = `
    <table>
      <thead>
        <tr><th>Macro</th><th>Recent Avg (g)</th><th>Recent %</th><th>Historical Avg (g)</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Protein</td>
          <td class="num">${fmtNum(recent.averageMacros.protein, 1)}</td>
          <td class="num">${fmtMacroPct(recent.averageMacros.protein, 4, recent.averageMacros)}</td>
          <td class="num">${fmtNum(historical.averageMacros.protein, 1)}</td>
        </tr>
        <tr>
          <td>Carbs</td>
          <td class="num">${fmtNum(recent.averageMacros.carbs, 1)}</td>
          <td class="num">${fmtMacroPct(recent.averageMacros.carbs, 4, recent.averageMacros)}</td>
          <td class="num">${fmtNum(historical.averageMacros.carbs, 1)}</td>
        </tr>
        <tr>
          <td>Fat</td>
          <td class="num">${fmtNum(recent.averageMacros.fat, 1)}</td>
          <td class="num">${fmtMacroPct(recent.averageMacros.fat, 9, recent.averageMacros)}</td>
          <td class="num">${fmtNum(historical.averageMacros.fat, 1)}</td>
        </tr>
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
          <td>Calories (kcal)</td>
          <td class="num">${fmtNum(recent.stats.calories.average)}</td>
          <td class="num">${fmtNum(recent.stats.calories.min)}</td>
          <td class="num">${fmtNum(recent.stats.calories.max)}</td>
          <td>${trendBadge(recent.stats.calories)}</td>
        </tr>
        <tr>
          <td>Protein (g)</td>
          <td class="num">${fmtNum(recent.stats.protein.average, 1)}</td>
          <td class="num">${fmtNum(recent.stats.protein.min, 1)}</td>
          <td class="num">${fmtNum(recent.stats.protein.max, 1)}</td>
          <td>${trendBadge(recent.stats.protein)}</td>
        </tr>
        <tr>
          <td>Carbs (g)</td>
          <td class="num">${fmtNum(recent.stats.carbs.average, 1)}</td>
          <td class="num">${fmtNum(recent.stats.carbs.min, 1)}</td>
          <td class="num">${fmtNum(recent.stats.carbs.max, 1)}</td>
          <td>${trendBadge(recent.stats.carbs)}</td>
        </tr>
        <tr>
          <td>Fat (g)</td>
          <td class="num">${fmtNum(recent.stats.fat.average, 1)}</td>
          <td class="num">${fmtNum(recent.stats.fat.min, 1)}</td>
          <td class="num">${fmtNum(recent.stats.fat.max, 1)}</td>
          <td>${trendBadge(recent.stats.fat)}</td>
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
          <td>Calories (kcal)</td>
          <td class="num">${fmtNum(historical.stats.calories.average)}</td>
          <td class="num">${fmtNum(historical.stats.calories.min)}</td>
          <td class="num">${fmtNum(historical.stats.calories.max)}</td>
          <td>${trendBadge(historical.stats.calories)}</td>
        </tr>
        <tr>
          <td>Protein (g)</td>
          <td class="num">${fmtNum(historical.stats.protein.average, 1)}</td>
          <td class="num">${fmtNum(historical.stats.protein.min, 1)}</td>
          <td class="num">${fmtNum(historical.stats.protein.max, 1)}</td>
          <td>${trendBadge(historical.stats.protein)}</td>
        </tr>
        <tr>
          <td>Carbs (g)</td>
          <td class="num">${fmtNum(historical.stats.carbs.average, 1)}</td>
          <td class="num">${fmtNum(historical.stats.carbs.min, 1)}</td>
          <td class="num">${fmtNum(historical.stats.carbs.max, 1)}</td>
          <td>${trendBadge(historical.stats.carbs)}</td>
        </tr>
        <tr>
          <td>Fat (g)</td>
          <td class="num">${fmtNum(historical.stats.fat.average, 1)}</td>
          <td class="num">${fmtNum(historical.stats.fat.min, 1)}</td>
          <td class="num">${fmtNum(historical.stats.fat.max, 1)}</td>
          <td>${trendBadge(historical.stats.fat)}</td>
        </tr>
      </tbody>
    </table>
  `;

  const sectionCharts = charts ?? {};

  return `
    <div class="section-card">
      <h2>Nutrition</h2>
      ${recentStats}
      <h3>Macronutrient Breakdown</h3>
      ${macrosTable}
      <div class="two-col">
        <div class="col">
          <div class="col-label">Recent (30 Days)</div>
          ${recentTable}
          ${renderCharts(sectionCharts, ['calories', 'macros'])}
        </div>
        <div class="col">
          <div class="col-label">Historical (1 Year)</div>
          ${histTable}
          ${renderCharts(sectionCharts, ['caloriesHistorical', 'macrosHistorical'])}
        </div>
      </div>
    </div>
  `;
}

/**
 * Calculate macro percentage of total caloric intake.
 * Protein/carbs: 4 cal/g; Fat: 9 cal/g.
 */
function fmtMacroPct(
  grams: number,
  calPerGram: number,
  macros: { protein: number; carbs: number; fat: number },
): string {
  const totalCal = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;
  if (totalCal === 0) return '0%';
  const pct = ((grams * calPerGram) / totalCal) * 100;
  return fmtNum(pct, 1) + '%';
}
