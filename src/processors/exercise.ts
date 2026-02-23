import type { FitbitExerciseLog } from '../types/fitbit.js';
import type { ExerciseData, ExerciseEntry } from '../types/report.js';
import { daysBetween } from './date-utils.js';

function extractDate(startTime: string): string {
  // startTime is an ISO timestamp like "2024-01-15T07:30:00.000"
  return startTime.split('T')[0];
}

export function processExercise(logs: FitbitExerciseLog[]): ExerciseData {
  const entries: ExerciseEntry[] = logs.map((log) => ({
    date: extractDate(log.startTime),
    name: log.activityName,
    duration: Math.round(log.activeDuration / 60000), // ms to minutes
    calories: log.calories,
    averageHeartRate: log.averageHeartRate,
  }));

  const byType: Record<string, { count: number; totalMinutes: number; totalCalories: number }> = {};
  for (const entry of entries) {
    if (!byType[entry.name]) {
      byType[entry.name] = { count: 0, totalMinutes: 0, totalCalories: 0 };
    }
    byType[entry.name].count += 1;
    byType[entry.name].totalMinutes += entry.duration;
    byType[entry.name].totalCalories += entry.calories;
  }

  const totalSessions = entries.length;
  const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0);

  // Calculate average sessions per week based on the date span of the logs
  let averagePerWeek = 0;
  if (entries.length > 0) {
    const dates = entries.map((e) => e.date).sort();
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    const totalDays = daysBetween(firstDate, lastDate);
    const weeks = Math.max(1, totalDays / 7);
    averagePerWeek = Math.round((totalSessions / weeks) * 10) / 10;
  }

  return {
    logs: entries,
    byType,
    totalSessions,
    totalMinutes,
    averagePerWeek,
  };
}
