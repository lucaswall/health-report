import type { FitbitSleepLog } from '../types/fitbit.js';
import type { DailyValue, SleepData } from '../types/report.js';
import { computeTrendStats } from './date-utils.js';

function getStageMinutes(
  log: FitbitSleepLog,
): { deep: number; light: number; rem: number; wake: number } {
  // Both 'stages' and 'classic' types use the same summary structure:
  // each key maps to { count, minutes, thirtyDayAvgMinutes }
  const summary = log.levels.summary as Record<
    string,
    { count: number; minutes: number; thirtyDayAvgMinutes: number }
  >;

  return {
    deep: summary['deep']?.minutes ?? 0,
    light: summary['light']?.minutes ?? 0,
    rem: summary['rem']?.minutes ?? 0,
    wake: summary['wake']?.minutes ?? summary['awake']?.minutes ?? 0,
  };
}

export function processSleep(sleepLogs: FitbitSleepLog[]): SleepData {
  // Filter for main sleep only and sort chronologically
  // (Fitbit API returns sleep logs newest-first)
  const mainSleepLogs = sleepLogs
    .filter((log) => log.isMainSleep)
    .sort((a, b) => a.dateOfSleep.localeCompare(b.dateOfSleep));

  const duration: DailyValue[] = [];
  const efficiency: DailyValue[] = [];
  const deep: DailyValue[] = [];
  const light: DailyValue[] = [];
  const rem: DailyValue[] = [];
  const wake: DailyValue[] = [];

  for (const log of mainSleepLogs) {
    const date = log.dateOfSleep;
    const durationHours = Math.round((log.duration / 3600000) * 100) / 100; // ms to hours
    const stages = getStageMinutes(log);

    duration.push({ date, value: durationHours });
    efficiency.push({ date, value: log.efficiency });
    deep.push({ date, value: stages.deep });
    light.push({ date, value: stages.light });
    rem.push({ date, value: stages.rem });
    wake.push({ date, value: stages.wake });
  }

  // Compute average stages as percentages of total stage time
  const averageStages = { deep: 0, light: 0, rem: 0, wake: 0 };

  if (mainSleepLogs.length > 0) {
    let totalDeep = 0;
    let totalLight = 0;
    let totalRem = 0;
    let totalWake = 0;

    for (const log of mainSleepLogs) {
      const stages = getStageMinutes(log);
      totalDeep += stages.deep;
      totalLight += stages.light;
      totalRem += stages.rem;
      totalWake += stages.wake;
    }

    const totalAll = totalDeep + totalLight + totalRem + totalWake;
    if (totalAll > 0) {
      averageStages.deep = Math.round((totalDeep / totalAll) * 10000) / 100;
      averageStages.light = Math.round((totalLight / totalAll) * 10000) / 100;
      averageStages.rem = Math.round((totalRem / totalAll) * 10000) / 100;
      averageStages.wake = Math.round((totalWake / totalAll) * 10000) / 100;
    }
  }

  return {
    daily: {
      duration,
      efficiency,
      deep,
      light,
      rem,
      wake,
    },
    stats: {
      duration: computeTrendStats(duration),
      efficiency: computeTrendStats(efficiency),
    },
    averageStages,
  };
}
