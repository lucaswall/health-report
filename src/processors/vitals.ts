import type {
  FitbitSpO2Day,
  FitbitBreathingRateDay,
  FitbitSkinTempDay,
} from '../types/fitbit.js';
import type { DailyValue, VitalsData } from '../types/report.js';
import { computeTrendStats } from './date-utils.js';

export function processVitals(
  spo2: FitbitSpO2Day[],
  br: FitbitBreathingRateDay[],
  temp: FitbitSkinTempDay[],
): VitalsData {
  const spo2Values: DailyValue[] = spo2.map((day) => ({
    date: day.dateTime,
    value: day.value.avg,
  }));

  const breathingRateValues: DailyValue[] = br.map((day) => ({
    date: day.dateTime,
    value: day.value.breathingRate,
  }));

  const skinTempValues: DailyValue[] = temp.map((day) => ({
    date: day.dateTime,
    value: day.value.nightlyRelative,
  }));

  return {
    spo2: spo2Values,
    breathingRate: breathingRateValues,
    skinTemp: skinTempValues,
    stats: {
      spo2: computeTrendStats(spo2Values),
      breathingRate: computeTrendStats(breathingRateValues),
      skinTemp: computeTrendStats(skinTempValues),
    },
  };
}
