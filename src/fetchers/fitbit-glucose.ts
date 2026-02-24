import type { FitbitClient } from './fitbit-client.js';
import type { FitbitGlucoseDay, FitbitGlucoseResponse } from '../types/fitbit.js';
import type { DateRange } from '../types/report.js';
import { chunkDateRange } from '../processors/date-utils.js';

const GLUCOSE_MAX_DAYS = 30;

export async function fetchGlucose(
  client: FitbitClient,
  dateRange: DateRange
): Promise<FitbitGlucoseDay[]> {
  const chunks = chunkDateRange(dateRange, GLUCOSE_MAX_DAYS);
  const allGlucose: FitbitGlucoseDay[] = [];

  for (const chunk of chunks) {
    const path = `/1/user/-/health/metrics/glucose/values/${chunk.start}/${chunk.end}.json`;
    const data = await client.get<FitbitGlucoseResponse>(path);
    allGlucose.push(...(data.glucose ?? []));
  }

  return allGlucose;
}
