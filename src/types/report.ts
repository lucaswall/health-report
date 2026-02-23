// Processed report data types

export interface DateRange {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
}

export interface DailyValue {
  date: string;
  value: number;
}

export interface TrendStats {
  average: number;
  min: number;
  max: number;
  trend: 'improving' | 'declining' | 'stable';
  percentChange: number;
}

// Activity
export interface ActivityData {
  daily: {
    steps: DailyValue[];
    calories: DailyValue[];
    distance: DailyValue[];
    floors: DailyValue[];
    sedentaryMinutes: DailyValue[];
    lightlyActiveMinutes: DailyValue[];
    fairlyActiveMinutes: DailyValue[];
    veryActiveMinutes: DailyValue[];
  };
  stats: {
    steps: TrendStats;
    calories: TrendStats;
    activeMinutes: TrendStats;
  };
}

// Exercise
export interface ExerciseEntry {
  date: string;
  name: string;
  duration: number; // minutes
  calories: number;
  averageHeartRate?: number;
}

export interface ExerciseData {
  logs: ExerciseEntry[];
  byType: Record<string, { count: number; totalMinutes: number; totalCalories: number }>;
  totalSessions: number;
  totalMinutes: number;
  averagePerWeek: number;
}

// Heart
export interface HeartData {
  restingHR: DailyValue[];
  hrv: DailyValue[];
  zones: {
    outOfRange: number;
    fatBurn: number;
    cardio: number;
    peak: number;
  };
  stats: {
    restingHR: TrendStats;
    hrv: TrendStats;
  };
}

// Sleep
export interface SleepData {
  daily: {
    duration: DailyValue[];
    efficiency: DailyValue[];
    deep: DailyValue[];
    light: DailyValue[];
    rem: DailyValue[];
    wake: DailyValue[];
  };
  stats: {
    duration: TrendStats;
    efficiency: TrendStats;
  };
  averageStages: {
    deep: number;
    light: number;
    rem: number;
    wake: number;
  };
}

// Body
export interface BodyData {
  weight: DailyValue[];
  bmi: DailyValue[];
  bodyFat: DailyValue[];
  stats: {
    weight: TrendStats;
    bmi: TrendStats;
    bodyFat: TrendStats;
  };
}

// Vitals
export interface VitalsData {
  spo2: DailyValue[];
  breathingRate: DailyValue[];
  skinTemp: DailyValue[];
  stats: {
    spo2: TrendStats;
    breathingRate: TrendStats;
    skinTemp: TrendStats;
  };
}

// Cardio Fitness
export interface CardioData {
  vo2Max: DailyValue[];
  stats: {
    vo2Max: TrendStats;
  };
}

// Nutrition
export interface NutritionData {
  daily: {
    calories: DailyValue[];
    protein: DailyValue[];
    carbs: DailyValue[];
    fat: DailyValue[];
    fiber: DailyValue[];
    sodium: DailyValue[];
  };
  stats: {
    calories: TrendStats;
    protein: TrendStats;
    carbs: TrendStats;
    fat: TrendStats;
  };
  averageMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Fasting
export interface FastingDay {
  date: string;
  firstMeal: string;  // HH:mm
  lastMeal: string;   // HH:mm
  eatingWindowHours: number;
  fastingHours: number;
}

export interface FastingData {
  daily: FastingDay[];
  averageEatingWindow: number;
  averageFastingHours: number;
  stats: {
    eatingWindow: TrendStats;
  };
}

// Profile
export interface ProfileData {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  memberSince: string;
}

// Full report
export interface HealthReportData {
  profile: ProfileData;
  dateRange: DateRange;
  historicalRange: DateRange;
  activity: { recent: ActivityData; historical: ActivityData };
  exercise: { recent: ExerciseData; historical: ExerciseData };
  heart: { recent: HeartData; historical: HeartData };
  sleep: { recent: SleepData; historical: SleepData };
  body: { recent: BodyData; historical: BodyData };
  vitals: { recent: VitalsData; historical: VitalsData };
  cardio: { recent: CardioData; historical: CardioData };
  nutrition: { recent: NutritionData; historical: NutritionData } | null;
  fasting: { recent: FastingData; historical: FastingData } | null;
}
