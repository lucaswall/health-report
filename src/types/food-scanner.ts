// Food Scanner API response types

// Internal normalized types (used throughout processors and sections)
export interface FoodScannerNutritionDay {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSodium: number;
  meals: FoodScannerMeal[];
}

export interface FoodScannerMeal {
  name: string;
  timestamp: string;
}

// Raw API response types (match actual Food Scanner /api/v1/* endpoints)
export interface FoodScannerApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: number;
}

export interface FoodScannerNutritionSummary {
  date: string;
  totals: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG: number;
    sodiumMg: number;
  };
  meals: Array<{
    mealTypeId: number;
    entries: Array<{
      foodName: string;
      time: string | null;
    }>;
  }>;
}
