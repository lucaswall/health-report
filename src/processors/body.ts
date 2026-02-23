import type { FitbitDailyActivity } from '../types/fitbit.js';
import type { BodyData, DailyValue } from '../types/report.js';
import { computeTrendStats } from './date-utils.js';

export interface BodyRaw {
  weight: FitbitDailyActivity[];
  bmi: FitbitDailyActivity[];
  fat: FitbitDailyActivity[];
}

function toDailyValuesNonZero(entries: FitbitDailyActivity[]): DailyValue[] {
  return entries
    .map((e) => ({
      date: e.dateTime,
      value: parseFloat(e.value),
    }))
    .filter((v) => v.value !== 0 && !isNaN(v.value));
}

export function processBody(raw: BodyRaw): BodyData {
  const weight = toDailyValuesNonZero(raw.weight);
  const bmi = toDailyValuesNonZero(raw.bmi);
  const bodyFat = toDailyValuesNonZero(raw.fat);

  return {
    weight,
    bmi,
    bodyFat,
    stats: {
      weight: computeTrendStats(weight),
      bmi: computeTrendStats(bmi),
      bodyFat: computeTrendStats(bodyFat),
    },
  };
}
