import type { FitbitClient } from './fitbit-client.js';
import type { FitbitCardioResponse, FitbitCardioDay } from '../types/fitbit.js';
import type { DateRange } from '../types/report.js';
import { chunkDateRange } from '../processors/date-utils.js';

const CARDIO_MAX_DAYS = 30;

export async function fetchCardioScore(
  client: FitbitClient,
  dateRange: DateRange
): Promise<FitbitCardioDay[]> {
  const chunks = chunkDateRange(dateRange, CARDIO_MAX_DAYS);
  const allCardio: FitbitCardioDay[] = [];

  for (const chunk of chunks) {
    const path = `/1/user/-/cardioscore/date/${chunk.start}/${chunk.end}.json`;
    const data = await client.get<FitbitCardioResponse>(path);
    allCardio.push(...(data.cardioScore ?? []));
  }

  return allCardio;
}
