import type { FitbitGlucoseDay } from '../types/fitbit.js';
import type { GlucoseData, DailyValue } from '../types/report.js';
import { computeTrendStats } from './date-utils.js';

export function processGlucose(days: FitbitGlucoseDay[]): GlucoseData {
  // Only include days where all three values are present to keep arrays aligned
  const complete = days.filter(
    (d) => d.value.avg !== undefined && d.value.min !== undefined && d.value.max !== undefined
  );

  const avg: DailyValue[] = complete.map((d) => ({ date: d.dateTime, value: d.value.avg! }));
  const min: DailyValue[] = complete.map((d) => ({ date: d.dateTime, value: d.value.min! }));
  const max: DailyValue[] = complete.map((d) => ({ date: d.dateTime, value: d.value.max! }));

  return {
    daily: { avg, min, max },
    stats: {
      glucose: computeTrendStats(avg),
    },
  };
}
