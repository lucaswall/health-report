import type { FitbitDailyActivity } from '../types/fitbit.js';
import type { ActivityData, DailyValue } from '../types/report.js';
import { computeTrendStats } from './date-utils.js';

export interface ActivityRaw {
  steps: FitbitDailyActivity[];
  calories: FitbitDailyActivity[];
  distance: FitbitDailyActivity[];
  floors: FitbitDailyActivity[];
  sedentaryMinutes: FitbitDailyActivity[];
  lightlyActiveMinutes: FitbitDailyActivity[];
  fairlyActiveMinutes: FitbitDailyActivity[];
  veryActiveMinutes: FitbitDailyActivity[];
}

function toDailyValues(entries: FitbitDailyActivity[]): DailyValue[] {
  return entries.map((e) => ({
    date: e.dateTime,
    value: parseFloat(e.value),
  }));
}

function computeActiveMinutes(
  fairlyActive: FitbitDailyActivity[],
  veryActive: FitbitDailyActivity[],
): DailyValue[] {
  const veryMap = new Map<string, number>();
  for (const entry of veryActive) {
    veryMap.set(entry.dateTime, parseFloat(entry.value));
  }

  return fairlyActive.map((entry) => ({
    date: entry.dateTime,
    value: parseFloat(entry.value) + (veryMap.get(entry.dateTime) ?? 0),
  }));
}

export function processActivity(raw: ActivityRaw): ActivityData {
  const steps = toDailyValues(raw.steps);
  const calories = toDailyValues(raw.calories);
  const distance = toDailyValues(raw.distance);
  const floors = toDailyValues(raw.floors);
  const sedentaryMinutes = toDailyValues(raw.sedentaryMinutes);
  const lightlyActiveMinutes = toDailyValues(raw.lightlyActiveMinutes);
  const fairlyActiveMinutes = toDailyValues(raw.fairlyActiveMinutes);
  const veryActiveMinutes = toDailyValues(raw.veryActiveMinutes);
  const activeMinutes = computeActiveMinutes(raw.fairlyActiveMinutes, raw.veryActiveMinutes);

  return {
    daily: {
      steps,
      calories,
      distance,
      floors,
      sedentaryMinutes,
      lightlyActiveMinutes,
      fairlyActiveMinutes,
      veryActiveMinutes,
    },
    stats: {
      steps: computeTrendStats(steps),
      calories: computeTrendStats(calories),
      activeMinutes: computeTrendStats(activeMinutes),
    },
  };
}
