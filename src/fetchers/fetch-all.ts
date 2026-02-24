import type {
  FitbitProfile,
  FitbitActivityTimeSeries,
  FitbitExerciseLog,
  FitbitHeartRateDay,
  FitbitHrvDay,
  FitbitSleepLog,
  FitbitBodyTimeSeries,
  FitbitSpO2Day,
  FitbitBreathingRateDay,
  FitbitSkinTempDay,
  FitbitCardioDay,
  FitbitWaterDay,
  FitbitTokens,
} from '../types/fitbit.js';
import type { FoodScannerNutritionDay } from '../types/food-scanner.js';
import type { DateRange } from '../types/report.js';

import { FitbitClient } from './fitbit-client.js';
import { FoodScannerClient } from './food-scanner-client.js';
import { DiskCache } from './cache.js';
import { loadTokens, saveTokens, isExpired } from '../auth/token-store.js';
import { config } from '../config.js';

import { fetchProfile } from './fitbit-profile.js';
import { fetchActivity } from './fitbit-activity.js';
import { fetchExercise } from './fitbit-exercise.js';
import { fetchHeartRate, fetchHrv } from './fitbit-heart.js';
import { fetchSleep } from './fitbit-sleep.js';
import { fetchBody } from './fitbit-body.js';
import { fetchSpO2, fetchBreathingRate, fetchSkinTemp } from './fitbit-vitals.js';
import { fetchCardioScore } from './fitbit-cardio.js';
import { fetchWater } from './fitbit-water.js';
import { fetchNutrition } from './food-scanner-nutrition.js';

const ONE_HOUR_MS = 3_600_000;
const TWENTY_FOUR_HOURS_MS = 24 * ONE_HOUR_MS;

export interface RawFitbitData {
  profile: FitbitProfile;
  activity: FitbitActivityTimeSeries;
  exercise: FitbitExerciseLog[];
  heartRate: FitbitHeartRateDay[];
  hrv: FitbitHrvDay[];
  sleep: FitbitSleepLog[];
  body: FitbitBodyTimeSeries;
  spo2: FitbitSpO2Day[];
  breathingRate: FitbitBreathingRateDay[];
  skinTemp: FitbitSkinTempDay[];
  cardioScore: FitbitCardioDay[];
  water: FitbitWaterDay[];
}

export interface RawFetchResult {
  fitbit: RawFitbitData;
  nutrition: FoodScannerNutritionDay[];
}

async function refreshToken(currentTokens: FitbitTokens): Promise<FitbitTokens> {
  const stored = loadTokens();
  if (!stored) {
    throw new Error('No stored tokens available for refresh');
  }

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: stored.refresh_token,
    client_id: config.fitbit.clientId,
  });

  const response = await fetch(config.fitbit.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${config.fitbit.clientId}:${config.fitbit.clientSecret}`)}`,
    },
    body,
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${text}`);
  }

  const newTokens = (await response.json()) as FitbitTokens;
  newTokens.expires_at = Date.now() + newTokens.expires_in * 1000;
  saveTokens(newTokens);
  return newTokens;
}

function createFitbitClient(cache?: DiskCache): FitbitClient {
  const tokens = loadTokens();
  if (!tokens) {
    throw new Error(
      'No Fitbit tokens found. Run `npm run auth` to authenticate first.'
    );
  }

  // Proactively refresh if expired
  let accessToken = tokens.access_token;

  return new FitbitClient(accessToken, async (_) => {
    const refreshed = await refreshToken(tokens);
    return refreshed;
  }, cache);
}

function createFoodScannerClient(cache?: DiskCache): FoodScannerClient {
  if (!config.foodScanner.apiKey) {
    throw new Error(
      'Missing FOOD_SCANNER_API_KEY environment variable. Add it to your .env file.'
    );
  }
  return new FoodScannerClient(config.foodScanner.url, config.foodScanner.apiKey, cache);
}

export async function fetchAll(
  dateRange: DateRange
): Promise<RawFetchResult> {
  const today = dateRange.end;
  const fitbitCache = new DiskCache('fitbit', ONE_HOUR_MS, today);
  const foodCache = new DiskCache('food-scanner', ONE_HOUR_MS, today);
  const profileCache = new DiskCache('fitbit-profile', TWENTY_FOUR_HOURS_MS);

  const fitbitClient = createFitbitClient(fitbitCache);
  const profileClient = createFitbitClient(profileCache);
  const foodClient = createFoodScannerClient(foodCache);

  console.log(`Fetching data for: ${dateRange.start} to ${dateRange.end}`);

  const [
    profile,
    activity,
    exercise,
    heartRate,
    hrv,
    sleep,
    body,
    spo2,
    breathingRate,
    skinTemp,
    cardioScore,
    water,
  ] = await Promise.all([
    fetchProfile(profileClient),
    fetchActivity(fitbitClient, dateRange),
    fetchExercise(fitbitClient, dateRange),
    fetchHeartRate(fitbitClient, dateRange),
    fetchHrv(fitbitClient, dateRange),
    fetchSleep(fitbitClient, dateRange),
    fetchBody(fitbitClient, dateRange),
    fetchSpO2(fitbitClient, dateRange),
    fetchBreathingRate(fitbitClient, dateRange),
    fetchSkinTemp(fitbitClient, dateRange),
    fetchCardioScore(fitbitClient, dateRange),
    fetchWater(fitbitClient, dateRange),
  ]);

  console.log('All Fitbit data fetched successfully.');

  console.log('Fetching nutrition data from Food Scanner...');
  const nutrition = await fetchNutrition(foodClient, dateRange);
  console.log('Nutrition data fetched successfully.');

  return {
    fitbit: {
      profile,
      activity,
      exercise,
      heartRate,
      hrv,
      sleep,
      body,
      spo2,
      breathingRate,
      skinTemp,
      cardioScore,
      water,
    },
    nutrition,
  };
}
