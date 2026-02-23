import type { FoodScannerNutritionDay } from '../types/food-scanner.js';
import type { DailyValue, FastingData, FastingDay } from '../types/report.js';
import { computeTrendStats } from './date-utils.js';

function extractTime(timestamp: string): string {
  // timestamp is ISO format like "2024-01-15T07:30:00.000Z" or "2024-01-15T07:30:00"
  const timePart = timestamp.split('T')[1];
  if (!timePart) return '00:00';
  return timePart.slice(0, 5); // HH:mm
}

function timeToDecimalHours(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + minutes / 60;
}

export function processFasting(days: FoodScannerNutritionDay[]): FastingData {
  const daily: FastingDay[] = [];

  for (const day of days) {
    // Skip days with no meals
    if (!day.meals || day.meals.length === 0) {
      continue;
    }

    // Find earliest and latest meal timestamps
    const timestamps = day.meals
      .map((m) => m.timestamp)
      .filter((t) => t != null && t !== '')
      .sort();

    if (timestamps.length === 0) {
      continue;
    }

    const firstMeal = extractTime(timestamps[0]);
    const lastMeal = extractTime(timestamps[timestamps.length - 1]);

    const firstHours = timeToDecimalHours(firstMeal);
    const lastHours = timeToDecimalHours(lastMeal);

    // Eating window is the span between first and last meal
    const eatingWindowHours =
      lastHours >= firstHours
        ? Math.round((lastHours - firstHours) * 100) / 100
        : Math.round((24 - firstHours + lastHours) * 100) / 100;

    // Fasting hours is the remainder of the day
    const fastingHours = Math.round((24 - eatingWindowHours) * 100) / 100;

    daily.push({
      date: day.date,
      firstMeal,
      lastMeal,
      eatingWindowHours,
      fastingHours,
    });
  }

  // Compute averages
  const averageEatingWindow =
    daily.length > 0
      ? Math.round(
          (daily.reduce((sum, d) => sum + d.eatingWindowHours, 0) / daily.length) * 100,
        ) / 100
      : 0;

  const averageFastingHours =
    daily.length > 0
      ? Math.round(
          (daily.reduce((sum, d) => sum + d.fastingHours, 0) / daily.length) * 100,
        ) / 100
      : 0;

  // Build DailyValue[] for trend stats on eating window
  const eatingWindowValues: DailyValue[] = daily.map((d) => ({
    date: d.date,
    value: d.eatingWindowHours,
  }));

  return {
    daily,
    averageEatingWindow,
    averageFastingHours,
    stats: {
      eatingWindow: computeTrendStats(eatingWindowValues),
    },
  };
}
