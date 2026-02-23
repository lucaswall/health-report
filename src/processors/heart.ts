import type { FitbitHeartRateDay, FitbitHrvDay } from '../types/fitbit.js';
import type { DailyValue, HeartData } from '../types/report.js';
import { computeTrendStats } from './date-utils.js';

export function processHeart(
  heartRate: FitbitHeartRateDay[],
  hrv: FitbitHrvDay[],
): HeartData {
  // Extract resting heart rate from each day (skip days without it)
  const restingHR: DailyValue[] = [];
  for (const day of heartRate) {
    if (day.value.restingHeartRate != null) {
      restingHR.push({
        date: day.dateTime,
        value: day.value.restingHeartRate,
      });
    }
  }

  // Map HRV daily values
  const hrvValues: DailyValue[] = hrv.map((day) => ({
    date: day.dateTime,
    value: Math.round(day.value.dailyRmssd * 100) / 100,
  }));

  // Aggregate heart rate zone minutes across all days
  const zones = {
    outOfRange: 0,
    fatBurn: 0,
    cardio: 0,
    peak: 0,
  };

  const zoneNameMap: Record<string, keyof typeof zones> = {
    'Out of Range': 'outOfRange',
    'Fat Burn': 'fatBurn',
    'Cardio': 'cardio',
    'Peak': 'peak',
  };

  for (const day of heartRate) {
    for (const zone of day.value.heartRateZones) {
      const key = zoneNameMap[zone.name];
      if (key) {
        zones[key] += zone.minutes;
      }
    }
  }

  return {
    restingHR,
    hrv: hrvValues,
    zones,
    stats: {
      restingHR: computeTrendStats(restingHR),
      hrv: computeTrendStats(hrvValues),
    },
  };
}
