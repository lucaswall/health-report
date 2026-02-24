import type { FoodScannerClient } from './food-scanner-client.js';
import type {
  FoodScannerNutritionDay,
  FoodScannerMeal,
  FoodScannerApiResponse,
  FoodScannerNutritionSummary,
} from '../types/food-scanner.js';
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
        try {
          const response = await client.get<FoodScannerApiResponse<FoodScannerNutritionSummary>>(
            `/api/v1/nutrition-summary?date=${date}`
          );

          const data = response.data;
          if (!data || !data.totals) {
            return emptyDay(date);
          }

          // Flatten meal group entries into FoodScannerMeal[] for fasting processor
          const meals: FoodScannerMeal[] = [];
          for (const group of data.meals ?? []) {
            for (const entry of group.entries) {
              if (entry.time) {
                meals.push({
                  name: entry.foodName,
                  timestamp: `${data.date}T${entry.time}`,
                });
              }
            }
          }

          return {
            date: data.date,
            totalCalories: data.totals.calories,
            totalProtein: data.totals.proteinG,
            totalCarbs: data.totals.carbsG,
            totalFat: data.totals.fatG,
            totalFiber: data.totals.fiberG,
            totalSodium: data.totals.sodiumMg,
            meals,
          } satisfies FoodScannerNutritionDay;
        } catch (error) {
          console.warn(`Failed to fetch nutrition for ${date}: ${error instanceof Error ? error.message : String(error)}`);
          return emptyDay(date);
        }
      })
    );

    results.push(...batchResults);
  }

  return results;
}

function emptyDay(date: string): FoodScannerNutritionDay {
  return {
    date,
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalFiber: 0,
    totalSodium: 0,
    meals: [],
  };
}
