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

        const day: FoodScannerNutritionDay = {
          date: data.date,
          totalCalories: data.summary.calories,
          totalProtein: data.summary.protein,
          totalCarbs: data.summary.carbs,
          totalFat: data.summary.fat,
          totalFiber: data.summary.fiber,
          totalSodium: data.summary.sodium,
          meals: data.meals,
        };
        return day;
      })
    );

    results.push(...batchResults);
  }

  return results;
}
