import { apiClient } from "@/lib/apiClient";

export type ProgressLog = {
  weight?: number;
  body_fat_percentage?: number;
  notes?: string;
};

export type InsightData = {
  total_workouts: number;
  workouts_this_week: number;
  latest_weight: number | null;
  weight_change: number | null;
  avg_calories: number;
  avg_protein: number;
  target_calories: number;
  target_protein: number;
  goal: string;
};

export const progressService = {
  getLogs: async () => {
    return await apiClient("/progress/");
  },

  logProgress: async (log: ProgressLog) => {
    return await apiClient("/progress/", {
      method: "POST",
      body: JSON.stringify(log),
    });
  },

  getAnalytics: async () => {
    return await apiClient("/progress/analytics");
  },

  getTdee: async () => {
    return await apiClient("/progress/tdee");
  },

  getAiInsight: async (data: InsightData) => {
    return await apiClient("/progress/insight", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  checkin: async () => {
    return await apiClient("/progress/streak/checkin", {
      method: "POST",
    });
  },

  getStreak: async () => {
    return await apiClient("/progress/streak");
  },
};
