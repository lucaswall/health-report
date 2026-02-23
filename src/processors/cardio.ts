import type { FitbitCardioDay } from '../types/fitbit.js';
import type { CardioData, DailyValue } from '../types/report.js';
import { computeTrendStats } from './date-utils.js';

export function processCardio(scores: FitbitCardioDay[]): CardioData {
  const vo2Max: DailyValue[] = scores
    .map((day) => ({
      date: day.dateTime,
      value: parseFloat(day.value.vo2Max),
    }))
    .filter((v) => !isNaN(v.value));

  return {
    vo2Max,
    stats: {
      vo2Max: computeTrendStats(vo2Max),
    },
  };
}
