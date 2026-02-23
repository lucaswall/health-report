// Food Scanner API response types

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
  id: string;
  name: string;
  timestamp: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

export interface FoodScannerNutritionResponse {
  date: string;
  summary: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
  meals: FoodScannerMeal[];
}
