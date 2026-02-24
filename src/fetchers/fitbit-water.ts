import type { FitbitClient } from './fitbit-client.js';
import type { FitbitWaterResponse, FitbitWaterDay } from '../types/fitbit.js';
import type { DateRange } from '../types/report.js';
import { eachDay } from '../processors/date-utils.js';

export async function fetchWater(
  client: FitbitClient,
  dateRange: DateRange
): Promise<FitbitWaterDay[]> {
  const days = eachDay(dateRange);
  const results: FitbitWaterDay[] = [];

  // Fetch each day individually; batch to avoid overwhelming the API
  const BATCH_SIZE = 10;

  for (let i = 0; i < days.length; i += BATCH_SIZE) {
    const batch = days.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(async (date) => {
        const path = `/1/user/-/foods/log/water/date/${date}.json`;
        const data = await client.get<FitbitWaterResponse>(path);
        const day: FitbitWaterDay = {
          date,
          water: data.summary.water,
        };
        return day;
      })
    );
    for (const r of batchResults) {
      if (r.status === 'fulfilled') {
        results.push(r.value);
      } else {
        console.warn(`Failed to fetch water data: ${r.reason instanceof Error ? r.reason.message : String(r.reason)}`);
      }
    }
  }

  return results;
}
