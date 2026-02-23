import type { FitbitClient } from './fitbit-client.js';
import type {
  FitbitHeartRateResponse,
  FitbitHeartRateDay,
  FitbitHrvResponse,
  FitbitHrvDay,
} from '../types/fitbit.js';
import type { DateRange } from '../types/report.js';
import { chunkDateRange } from '../processors/date-utils.js';

const HRV_MAX_DAYS = 30;

export async function fetchHeartRate(
  client: FitbitClient,
  dateRange: DateRange
): Promise<FitbitHeartRateDay[]> {
  const path = `/1/user/-/activities/heart/date/${dateRange.start}/${dateRange.end}.json`;
  const data = await client.get<FitbitHeartRateResponse>(path);
  return data['activities-heart'] ?? [];
}

export async function fetchHrv(
  client: FitbitClient,
  dateRange: DateRange
): Promise<FitbitHrvDay[]> {
  const chunks = chunkDateRange(dateRange, HRV_MAX_DAYS);
  const allHrv: FitbitHrvDay[] = [];

  for (const chunk of chunks) {
    const path = `/1/user/-/hrv/date/${chunk.start}/${chunk.end}.json`;
    const data = await client.get<FitbitHrvResponse>(path);
    allHrv.push(...(data.hrv ?? []));
  }

  return allHrv;
}
