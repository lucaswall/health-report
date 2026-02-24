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
  FitbitGlucoseDay,
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
import { fetchGlucose } from './fitbit-glucose.js';
import { fetchNutrition } from './food-scanner-nutrition.js';

const ONE_HOUR_MS = 3_600_000;
const TWENTY_FOUR_HOURS_MS = 24 * ONE_HOUR_MS;

export interface RawFitbitData {
  profile: FitbitProfile;
  activity: { recent: FitbitActivityTimeSeries; historical: FitbitActivityTimeSeries };
  exercise: { recent: FitbitExerciseLog[]; historical: FitbitExerciseLog[] };
  heartRate: { recent: FitbitHeartRateDay[]; historical: FitbitHeartRateDay[] };
  hrv: { recent: FitbitHrvDay[]; historical: FitbitHrvDay[] };
  sleep: { recent: FitbitSleepLog[]; historical: FitbitSleepLog[] };
  body: { recent: FitbitBodyTimeSeries; historical: FitbitBodyTimeSeries };
  spo2: { recent: FitbitSpO2Day[]; historical: FitbitSpO2Day[] };
  breathingRate: { recent: FitbitBreathingRateDay[]; historical: FitbitBreathingRateDay[] };
  skinTemp: { recent: FitbitSkinTempDay[]; historical: FitbitSkinTempDay[] };
  cardioScore: { recent: FitbitCardioDay[]; historical: FitbitCardioDay[] };
  water: { recent: FitbitWaterDay[]; historical: FitbitWaterDay[] };
  glucose: { recent: FitbitGlucoseDay[]; historical: FitbitGlucoseDay[] };
}

export interface RawFetchResult {
  fitbit: RawFitbitData;
  nutrition: { recent: FoodScannerNutritionDay[]; historical: FoodScannerNutritionDay[] };
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
  recentRange: DateRange,
  historicalRange: DateRange
): Promise<RawFetchResult> {
  const fitbitCache = new DiskCache('fitbit', ONE_HOUR_MS);
  const foodCache = new DiskCache('food-scanner', ONE_HOUR_MS);
  const profileCache = new DiskCache('fitbit-profile', TWENTY_FOUR_HOURS_MS);

  const fitbitClient = createFitbitClient(fitbitCache);
  const profileClient = createFitbitClient(profileCache);
  const foodClient = createFoodScannerClient(foodCache);

  console.log(`Fetching data for recent: ${recentRange.start} to ${recentRange.end}`);
  console.log(`Fetching data for historical: ${historicalRange.start} to ${historicalRange.end}`);

  // Fetch profile (only needs one call, cached 24h)
  const profilePromise = fetchProfile(profileClient);

  // Fetch all Fitbit data for both ranges in parallel
  const [
    profile,
    recentActivity,
    historicalActivity,
    recentExercise,
    historicalExercise,
    recentHeartRate,
    historicalHeartRate,
    recentHrv,
    historicalHrv,
    recentSleep,
    historicalSleep,
    recentBody,
    historicalBody,
    recentSpO2,
    historicalSpO2,
    recentBreathingRate,
    historicalBreathingRate,
    recentSkinTemp,
    historicalSkinTemp,
    recentCardio,
    historicalCardio,
    recentWater,
    historicalWater,
    recentGlucose,
    historicalGlucose,
  ] = await Promise.all([
    profilePromise,
    fetchActivity(fitbitClient, recentRange),
    fetchActivity(fitbitClient, historicalRange),
    fetchExercise(fitbitClient, recentRange),
    fetchExercise(fitbitClient, historicalRange),
    fetchHeartRate(fitbitClient, recentRange),
    fetchHeartRate(fitbitClient, historicalRange),
    fetchHrv(fitbitClient, recentRange),
    fetchHrv(fitbitClient, historicalRange),
    fetchSleep(fitbitClient, recentRange),
    fetchSleep(fitbitClient, historicalRange),
    fetchBody(fitbitClient, recentRange),
    fetchBody(fitbitClient, historicalRange),
    fetchSpO2(fitbitClient, recentRange),
    fetchSpO2(fitbitClient, historicalRange),
    fetchBreathingRate(fitbitClient, recentRange),
    fetchBreathingRate(fitbitClient, historicalRange),
    fetchSkinTemp(fitbitClient, recentRange),
    fetchSkinTemp(fitbitClient, historicalRange),
    fetchCardioScore(fitbitClient, recentRange),
    fetchCardioScore(fitbitClient, historicalRange),
    fetchWater(fitbitClient, recentRange),
    fetchWater(fitbitClient, historicalRange),
    fetchGlucose(fitbitClient, recentRange),
    fetchGlucose(fitbitClient, historicalRange),
  ]);

  console.log('All Fitbit data fetched successfully.');

  // Fetch nutrition data from Food Scanner
  console.log('Fetching nutrition data from Food Scanner...');
  const [recentNutrition, historicalNutrition] = await Promise.all([
    fetchNutrition(foodClient, recentRange),
    fetchNutrition(foodClient, historicalRange),
  ]);
  const nutrition = { recent: recentNutrition, historical: historicalNutrition };
  console.log('Nutrition data fetched successfully.');

  return {
    fitbit: {
      profile,
      activity: { recent: recentActivity, historical: historicalActivity },
      exercise: { recent: recentExercise, historical: historicalExercise },
      heartRate: { recent: recentHeartRate, historical: historicalHeartRate },
      hrv: { recent: recentHrv, historical: historicalHrv },
      sleep: { recent: recentSleep, historical: historicalSleep },
      body: { recent: recentBody, historical: historicalBody },
      spo2: { recent: recentSpO2, historical: historicalSpO2 },
      breathingRate: { recent: recentBreathingRate, historical: historicalBreathingRate },
      skinTemp: { recent: recentSkinTemp, historical: historicalSkinTemp },
      cardioScore: { recent: recentCardio, historical: historicalCardio },
      water: { recent: recentWater, historical: historicalWater },
      glucose: { recent: recentGlucose, historical: historicalGlucose },
    },
    nutrition,
  };
}
