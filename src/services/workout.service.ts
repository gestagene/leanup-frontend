import { apiClient } from "@/lib/apiClient";

export type WorkoutLog = {
  exercise_name: string;
  sets?: number;
  reps?: number;
  weight_kg?: number;
  duration_minutes?: number;
  calories_burned?: number;
  notes?: string;
};

export const workoutService = {
  getWorkoutPlan: async () => {
    return await apiClient("/workout/plan");
  },

  getLogs: async () => {
    return await apiClient("/workout_logs/");
  },

  logWorkout: async (log: WorkoutLog) => {
    return await apiClient("/workout_logs/", {
      method: "POST",
      body: JSON.stringify(log),
    });
  },

  deleteLog: async (logId: string) => {
    return await apiClient(`/workout_logs/${logId}`, {
      method: "DELETE",
    });
  },
};
