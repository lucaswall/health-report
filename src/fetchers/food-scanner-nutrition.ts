import type { FoodScannerClient } from './food-scanner-client.js';
import type { FoodScannerNutritionDay, FoodScannerNutritionResponse } from '../types/food-scanner.js';
import type { DateRange } from '../types/report.js';
import { eachDay } from '../processors/date-utils.js';

export async function fetchNutrition(
  client: FoodScannerClient,
  dateRange: DateRange
): Promise<FoodScannerNutritionDay[]> {
  const days = eachDay(dateRange);
  const results: FoodScannerNutritionDay[] = [];

  // Fetch each day individually; the API provides per-day summaries
  // Process in batches of 10 to avoid overwhelming the server
  const BATCH_SIZE = 10;

  for (let i = 0; i < days.length; i += BATCH_SIZE) {
    const batch = days.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (date) => {
        const data = await client.get<FoodScannerNutritionResponse>(
          `/api/v1/nutrition-summary?date=${date}`
        );

        const summary = data.summary;
        if (!summary) {
          // Day with no food data logged — return zeroes
          return {
            date: data.date ?? date,
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            totalFiber: 0,
            totalSodium: 0,
            meals: [],
          } satisfies FoodScannerNutritionDay;
        }

        const day: FoodScannerNutritionDay = {
          date: data.date,
          totalCalories: summary.calories,
          totalProtein: summary.protein,
          totalCarbs: summary.carbs,
          totalFat: summary.fat,
          totalFiber: summary.fiber,
          totalSodium: summary.sodium,
          meals: data.meals ?? [],
        };
        return day;
      })
    );

    results.push(...batchResults);
  }

  return results;
}
