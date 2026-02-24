// PDF section: nutrition (calories, macros)

import type { NutritionData } from '../../types/report.js';
import type { SectionCharts } from '../../types/charts.js';
import { statCard, trendBadge, fmtNum, renderCharts } from '../helpers.js';

export function renderNutritionSection(
  data: NutritionData,
  charts: SectionCharts,
): string {
  const stats = `
    <div class="stat-grid">
      ${statCard('Avg Calories', fmtNum(data.stats.calories.average), 'kcal')}
      ${statCard('Avg Protein', fmtNum(data.stats.protein.average, 1), 'g')}
      ${statCard('Avg Carbs', fmtNum(data.stats.carbs.average, 1), 'g')}
      ${statCard('Avg Fat', fmtNum(data.stats.fat.average, 1), 'g')}
    </div>
    <div style="margin-bottom:8px;">
      Calories: ${trendBadge(data.stats.calories)}
      &nbsp; Protein: ${trendBadge(data.stats.protein)}
    </div>
  `;

  // Macros breakdown
  const macrosTable = `
    <table>
      <thead>
        <tr><th>Macro</th><th>Avg (g)</th><th>% of Calories</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Protein</td>
          <td class="num">${fmtNum(data.averageMacros.protein, 1)}</td>
          <td class="num">${fmtMacroPct(data.averageMacros.protein, 4, data.averageMacros)}</td>
        </tr>
        <tr>
          <td>Carbs</td>
          <td class="num">${fmtNum(data.averageMacros.carbs, 1)}</td>
          <td class="num">${fmtMacroPct(data.averageMacros.carbs, 4, data.averageMacros)}</td>
        </tr>
        <tr>
          <td>Fat</td>
          <td class="num">${fmtNum(data.averageMacros.fat, 1)}</td>
          <td class="num">${fmtMacroPct(data.averageMacros.fat, 9, data.averageMacros)}</td>
        </tr>
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
          <td>Calories (kcal)</td>
          <td class="num">${fmtNum(data.stats.calories.average)}</td>
          <td class="num">${fmtNum(data.stats.calories.min)}</td>
          <td class="num">${fmtNum(data.stats.calories.max)}</td>
          <td>${trendBadge(data.stats.calories)}</td>
        </tr>
        <tr>
          <td>Protein (g)</td>
          <td class="num">${fmtNum(data.stats.protein.average, 1)}</td>
          <td class="num">${fmtNum(data.stats.protein.min, 1)}</td>
          <td class="num">${fmtNum(data.stats.protein.max, 1)}</td>
          <td>${trendBadge(data.stats.protein)}</td>
        </tr>
        <tr>
          <td>Carbs (g)</td>
          <td class="num">${fmtNum(data.stats.carbs.average, 1)}</td>
          <td class="num">${fmtNum(data.stats.carbs.min, 1)}</td>
          <td class="num">${fmtNum(data.stats.carbs.max, 1)}</td>
          <td>${trendBadge(data.stats.carbs)}</td>
        </tr>
        <tr>
          <td>Fat (g)</td>
          <td class="num">${fmtNum(data.stats.fat.average, 1)}</td>
          <td class="num">${fmtNum(data.stats.fat.min, 1)}</td>
          <td class="num">${fmtNum(data.stats.fat.max, 1)}</td>
          <td>${trendBadge(data.stats.fat)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section-card">
      <h2>Nutrition</h2>
      ${stats}
      <h3>Macronutrient Breakdown</h3>
      ${macrosTable}
      ${statsTable}
      ${renderCharts(charts, ['calorieBar', 'macroDoughnut', 'macroStackedBars'])}
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
