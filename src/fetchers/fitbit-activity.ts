import type { FitbitClient } from './fitbit-client.js';
import type { FitbitActivityTimeSeries, FitbitDailyActivity } from '../types/fitbit.js';
import type { DateRange } from '../types/report.js';

const ACTIVITY_RESOURCES = [
  'activities/steps',
  'activities/calories',
  'activities/distance',
  'activities/floors',
  'activities/minutesSedentary',
  'activities/minutesLightlyActive',
  'activities/minutesFairlyActive',
  'activities/minutesVeryActive',
] as const;

type ActivityResource = (typeof ACTIVITY_RESOURCES)[number];

type ActivityResponseKey = keyof FitbitActivityTimeSeries;

const RESOURCE_TO_KEY: Record<ActivityResource, ActivityResponseKey> = {
  'activities/steps': 'activities-steps',
  'activities/calories': 'activities-calories',
  'activities/distance': 'activities-distance',
  'activities/floors': 'activities-floors',
  'activities/minutesSedentary': 'activities-minutesSedentary',
  'activities/minutesLightlyActive': 'activities-minutesLightlyActive',
  'activities/minutesFairlyActive': 'activities-minutesFairlyActive',
  'activities/minutesVeryActive': 'activities-minutesVeryActive',
};

export async function fetchActivity(
  client: FitbitClient,
  dateRange: DateRange
): Promise<FitbitActivityTimeSeries> {
  const results = await Promise.all(
    ACTIVITY_RESOURCES.map(async (resource) => {
      const path = `/1/user/-/${resource}/date/${dateRange.start}/${dateRange.end}.json`;
      const data = await client.get<Record<string, FitbitDailyActivity[]>>(path);
      const key = RESOURCE_TO_KEY[resource];
      return { key, values: data[key] ?? [] };
    })
  );

  const merged = {} as FitbitActivityTimeSeries;
  for (const { key, values } of results) {
    merged[key] = values;
  }

  return merged;
}
