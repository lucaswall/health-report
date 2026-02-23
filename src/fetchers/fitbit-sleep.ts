import type { FitbitClient } from './fitbit-client.js';
import type { FitbitSleepResponse, FitbitSleepLog } from '../types/fitbit.js';
import type { DateRange } from '../types/report.js';
import { chunkDateRange } from '../processors/date-utils.js';

const SLEEP_MAX_DAYS = 100;

export async function fetchSleep(
  client: FitbitClient,
  dateRange: DateRange
): Promise<FitbitSleepLog[]> {
  const chunks = chunkDateRange(dateRange, SLEEP_MAX_DAYS);
  const allSleep: FitbitSleepLog[] = [];

  for (const chunk of chunks) {
    const path = `/1.2/user/-/sleep/date/${chunk.start}/${chunk.end}.json`;
    const data = await client.get<FitbitSleepResponse>(path);
    allSleep.push(...(data.sleep ?? []));
  }

  return allSleep;
}
