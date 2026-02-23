import type { FitbitClient } from './fitbit-client.js';
import type {
  FitbitSpO2Day,
  FitbitBreathingRateDay,
  FitbitBreathingRateResponse,
  FitbitSkinTempDay,
  FitbitSkinTempResponse,
} from '../types/fitbit.js';
import type { DateRange } from '../types/report.js';
import { chunkDateRange } from '../processors/date-utils.js';

const VITALS_MAX_DAYS = 30;

export async function fetchSpO2(
  client: FitbitClient,
  dateRange: DateRange
): Promise<FitbitSpO2Day[]> {
  const chunks = chunkDateRange(dateRange, VITALS_MAX_DAYS);
  const allSpO2: FitbitSpO2Day[] = [];

  for (const chunk of chunks) {
    const path = `/1/user/-/spo2/date/${chunk.start}/${chunk.end}.json`;
    // SpO2 endpoint returns an array directly for date ranges
    const data = await client.get<FitbitSpO2Day[]>(path);
    if (Array.isArray(data)) {
      allSpO2.push(...data);
    }
  }

  return allSpO2;
}

export async function fetchBreathingRate(
  client: FitbitClient,
  dateRange: DateRange
): Promise<FitbitBreathingRateDay[]> {
  const chunks = chunkDateRange(dateRange, VITALS_MAX_DAYS);
  const allBr: FitbitBreathingRateDay[] = [];

  for (const chunk of chunks) {
    const path = `/1/user/-/br/date/${chunk.start}/${chunk.end}.json`;
    const data = await client.get<FitbitBreathingRateResponse>(path);
    allBr.push(...(data.br ?? []));
  }

  return allBr;
}

export async function fetchSkinTemp(
  client: FitbitClient,
  dateRange: DateRange
): Promise<FitbitSkinTempDay[]> {
  const chunks = chunkDateRange(dateRange, VITALS_MAX_DAYS);
  const allTemp: FitbitSkinTempDay[] = [];

  for (const chunk of chunks) {
    const path = `/1/user/-/temp/skin/date/${chunk.start}/${chunk.end}.json`;
    const data = await client.get<FitbitSkinTempResponse>(path);
    allTemp.push(...(data.tempSkin ?? []));
  }

  return allTemp;
}
