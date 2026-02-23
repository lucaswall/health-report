import type { FoodScannerNutritionDay } from '../types/food-scanner.js';
import type { DailyValue, NutritionData } from '../types/report.js';
import { computeTrendStats } from './date-utils.js';

export function processNutrition(days: FoodScannerNutritionDay[]): NutritionData {
  const calories: DailyValue[] = [];
  const protein: DailyValue[] = [];
  const carbs: DailyValue[] = [];
  const fat: DailyValue[] = [];
  const fiber: DailyValue[] = [];
  const sodium: DailyValue[] = [];

  for (const day of days) {
    const date = day.date;
    calories.push({ date, value: day.totalCalories });
    protein.push({ date, value: day.totalProtein });
    carbs.push({ date, value: day.totalCarbs });
    fat.push({ date, value: day.totalFat });
    fiber.push({ date, value: day.totalFiber });
    sodium.push({ date, value: day.totalSodium });
  }

  // Compute average macros in grams
  const proteinValues = protein.filter((v) => v.value > 0);
  const carbValues = carbs.filter((v) => v.value > 0);
  const fatValues = fat.filter((v) => v.value > 0);

  const avgProtein =
    proteinValues.length > 0
      ? Math.round(
          (proteinValues.reduce((sum, v) => sum + v.value, 0) / proteinValues.length) * 10,
        ) / 10
      : 0;

  const avgCarbs =
    carbValues.length > 0
      ? Math.round(
          (carbValues.reduce((sum, v) => sum + v.value, 0) / carbValues.length) * 10,
        ) / 10
      : 0;

  const avgFat =
    fatValues.length > 0
      ? Math.round(
          (fatValues.reduce((sum, v) => sum + v.value, 0) / fatValues.length) * 10,
        ) / 10
      : 0;

  return {
    daily: {
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sodium,
    },
    stats: {
      calories: computeTrendStats(calories),
      protein: computeTrendStats(protein),
      carbs: computeTrendStats(carbs),
      fat: computeTrendStats(fat),
    },
    averageMacros: {
      protein: avgProtein,
      carbs: avgCarbs,
      fat: avgFat,
    },
  };
}
