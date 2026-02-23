// Fitbit API response types

export interface FitbitProfile {
  user: {
    encodedId: string;
    displayName: string;
    fullName: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    dateOfBirth: string;
    memberSince: string;
    timezone: string;
    averageDailySteps: number;
  };
}

// Activity
export interface FitbitDailyActivity {
  dateTime: string;
  value: string;
}

export interface FitbitActivityTimeSeries {
  'activities-steps': FitbitDailyActivity[];
  'activities-calories': FitbitDailyActivity[];
  'activities-distance': FitbitDailyActivity[];
  'activities-floors': FitbitDailyActivity[];
  'activities-minutesSedentary': FitbitDailyActivity[];
  'activities-minutesLightlyActive': FitbitDailyActivity[];
  'activities-minutesFairlyActive': FitbitDailyActivity[];
  'activities-minutesVeryActive': FitbitDailyActivity[];
}

// Exercise / Workouts
export interface FitbitExerciseLog {
  logId: number;
  activityName: string;
  activityTypeId: number;
  startTime: string;
  duration: number; // milliseconds
  activeDuration: number;
  calories: number;
  steps?: number;
  distance?: number;
  distanceUnit?: string;
  heartRateZones?: FitbitHeartRateZone[];
  averageHeartRate?: number;
}

export interface FitbitExerciseResponse {
  activities: FitbitExerciseLog[];
  pagination: {
    beforeDate: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    sort: string;
  };
}

// Heart Rate
export interface FitbitHeartRateZone {
  name: string;
  min: number;
  max: number;
  minutes: number;
  caloriesOut: number;
}

export interface FitbitHeartRateDay {
  dateTime: string;
  value: {
    customHeartRateZones: FitbitHeartRateZone[];
    heartRateZones: FitbitHeartRateZone[];
    restingHeartRate?: number;
  };
}

export interface FitbitHeartRateResponse {
  'activities-heart': FitbitHeartRateDay[];
}

export interface FitbitHrvDay {
  dateTime: string;
  value: {
    dailyRmssd: number;
    deepRmssd: number;
  };
}

export interface FitbitHrvResponse {
  hrv: FitbitHrvDay[];
}

// Sleep
export interface FitbitSleepStages {
  deep: number;
  light: number;
  rem: number;
  wake: number;
}

export interface FitbitSleepLog {
  dateOfSleep: string;
  startTime: string;
  endTime: string;
  duration: number; // milliseconds
  efficiency: number;
  isMainSleep: boolean;
  minutesAsleep: number;
  minutesAwake: number;
  timeInBed: number;
  type: 'stages' | 'classic';
  levels: {
    summary: FitbitSleepStages | Record<string, { count: number; minutes: number; thirtyDayAvgMinutes: number }>;
  };
}

export interface FitbitSleepResponse {
  sleep: FitbitSleepLog[];
  summary: {
    totalMinutesAsleep: number;
    totalSleepRecords: number;
    totalTimeInBed: number;
    stages?: FitbitSleepStages;
  };
}

// Body
export interface FitbitBodyTimeSeries {
  'body-weight': FitbitDailyActivity[];
  'body-bmi': FitbitDailyActivity[];
  'body-fat': FitbitDailyActivity[];
}

// Vitals
export interface FitbitSpO2Day {
  dateTime: string;
  value: {
    avg: number;
    min: number;
    max: number;
  };
}

export interface FitbitSpO2Response {
  dateTime: string;
  value: {
    avg: number;
    min: number;
    max: number;
  };
}

export interface FitbitBreathingRateDay {
  dateTime: string;
  value: {
    breathingRate: number;
  };
}

export interface FitbitBreathingRateResponse {
  br: FitbitBreathingRateDay[];
}

export interface FitbitSkinTempDay {
  dateTime: string;
  value: {
    logType: string;
    nightlyRelative: number;
  };
}

export interface FitbitSkinTempResponse {
  tempSkin: FitbitSkinTempDay[];
}

// Cardio Fitness (VO2 Max)
export interface FitbitCardioDay {
  dateTime: string;
  value: {
    vo2Max: string;
  };
}

export interface FitbitCardioResponse {
  cardioScore: FitbitCardioDay[];
}

// Token types
export interface FitbitTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  expires_at: number;
}
