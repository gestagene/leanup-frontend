import { apiClient } from "@/lib/apiClient";

export type NutritionLog = {
  food_name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  meal_type?: string;
};

export const nutritionService = {
  getLogs: async () => {
    return await apiClient("/nutrition_logs/");
  },

  logMeal: async (log: NutritionLog) => {
    return await apiClient("/nutrition_logs/", {
      method: "POST",
      body: JSON.stringify(log),
    });
  },

  deleteLog: async (logId: string) => {
    return await apiClient(`/nutrition_logs/${logId}`, {
      method: "DELETE",
    });
  },

  getTodaySummary: async () => {
    return await apiClient("/nutrition_logs/summary/today");
  },

  searchFood: async (query: string) => {
    return await apiClient(
      `/nutrition_logs/search?query=${encodeURIComponent(query)}`,
    );
  },
};
