export type NutritionSummary = {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
};
export type FoodSearchResult = {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};
export type MealLog = {
  id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal_type: string;
  logged_at: string;
};
