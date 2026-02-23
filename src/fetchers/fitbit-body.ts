import type { FitbitClient } from './fitbit-client.js';
import type { FitbitBodyTimeSeries, FitbitDailyActivity } from '../types/fitbit.js';
import type { DateRange } from '../types/report.js';

const BODY_RESOURCES = ['body/weight', 'body/bmi', 'body/fat'] as const;

type BodyResource = (typeof BODY_RESOURCES)[number];

type BodyResponseKey = keyof FitbitBodyTimeSeries;

const RESOURCE_TO_KEY: Record<BodyResource, BodyResponseKey> = {
  'body/weight': 'body-weight',
  'body/bmi': 'body-bmi',
  'body/fat': 'body-fat',
};

export async function fetchBody(
  client: FitbitClient,
  dateRange: DateRange
): Promise<FitbitBodyTimeSeries> {
  const results = await Promise.all(
    BODY_RESOURCES.map(async (resource) => {
      const path = `/1/user/-/${resource}/date/${dateRange.start}/${dateRange.end}.json`;
      const data = await client.get<Record<string, FitbitDailyActivity[]>>(path);
      const key = RESOURCE_TO_KEY[resource];
      return { key, values: data[key] ?? [] };
    })
  );

  const merged: Record<string, FitbitDailyActivity[]> = {};
  for (const { key, values } of results) {
    merged[key] = values;
  }

  return merged as unknown as FitbitBodyTimeSeries;
}
