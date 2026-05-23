import { apiClient } from "@/lib/apiClient";

export type ProgressLog = {
  weight?: number;
  body_fat_percentage?: number;
  notes?: string;
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
};
