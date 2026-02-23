import type { FitbitClient } from './fitbit-client.js';
import type { FitbitExerciseLog, FitbitExerciseResponse } from '../types/fitbit.js';
import type { DateRange } from '../types/report.js';

const PAGE_LIMIT = 100;

export async function fetchExercise(
  client: FitbitClient,
  dateRange: DateRange
): Promise<FitbitExerciseLog[]> {
  const allActivities: FitbitExerciseLog[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const path =
      `/1/user/-/activities/list.json` +
      `?afterDate=${dateRange.start}` +
      `&sort=asc` +
      `&limit=${PAGE_LIMIT}` +
      `&offset=${offset}`;

    const data = await client.get<FitbitExerciseResponse>(path);
    const activities = data.activities ?? [];

    // Filter to only include activities within the date range
    const endDate = new Date(dateRange.end + 'T23:59:59');
    const filtered = activities.filter((a) => {
      const actDate = new Date(a.startTime);
      return actDate <= endDate;
    });

    allActivities.push(...filtered);

    // If we received fewer than the limit, or all activities are past end date, stop
    if (activities.length < PAGE_LIMIT) {
      hasMore = false;
    } else {
      // Check if the last activity is beyond our end date
      const lastActivity = activities[activities.length - 1];
      if (lastActivity && new Date(lastActivity.startTime) > endDate) {
        hasMore = false;
      } else {
        offset += PAGE_LIMIT;
      }
    }
  }

  return allActivities;
}
