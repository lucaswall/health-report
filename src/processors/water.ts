import type { FitbitWaterDay } from '../types/fitbit.js';
import type { WaterData, DailyValue } from '../types/report.js';
import { computeTrendStats } from './date-utils.js';

export function processWater(days: FitbitWaterDay[]): WaterData {
  const daily: DailyValue[] = days
    .map((d) => ({ date: d.date, value: d.water }))
    .filter((v) => !isNaN(v.value));

  return {
    daily,
    stats: {
      water: computeTrendStats(daily),
    },
  };
}
