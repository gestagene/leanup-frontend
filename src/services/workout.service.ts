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

export type WorkoutPlanExercise = {
  id?: string;
  exercise_name: string;
  exercise_id?: string;
  body_part?: string;
  target_muscle?: string;
  gif_url?: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  order_index: number;
};

export type WorkoutPlan = {
  id: string;
  name: string;
  goal?: string;
  is_active: boolean;
  is_preset: boolean;
  created_at: string;
  workout_plan_exercises: WorkoutPlanExercise[];
};

export type Exercise = {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
  gifUrl: string;
};

export type LogSet = {
  exercise_name: string;
  set_number: number;
  reps_completed?: number;
  weight_kg?: number;
  is_completed: boolean;
};

export const workoutService = {
  // workout logs (quick log)
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

  // plans
  getPlans: async () => {
    return await apiClient("/workout_plans/");
  },

  getPresets: async () => {
    return await apiClient("/workout_plans/presets");
  },

  createPlan: async (plan: {
    name: string;
    goal?: string;
    exercises: WorkoutPlanExercise[];
  }) => {
    return await apiClient("/workout_plans/", {
      method: "POST",
      body: JSON.stringify(plan),
    });
  },

  deletePlan: async (planId: string) => {
    return await apiClient(`/workout_plans/${planId}`, {
      method: "DELETE",
    });
  },

  activatePlan: async (planId: string) => {
    return await apiClient(`/workout_plans/${planId}/activate`, {
      method: "PUT",
    });
  },

  // sessions (step-by-step workout)
  startSession: async (planId?: string, notes?: string) => {
    return await apiClient("/workout_sessions/", {
      method: "POST",
      body: JSON.stringify({ plan_id: planId, notes }),
    });
  },

  getSessions: async () => {
    return await apiClient("/workout_sessions/");
  },

  finishSession: async (sessionId: string) => {
    return await apiClient(`/workout_sessions/${sessionId}/finish`, {
      method: "PUT",
    });
  },

  logSet: async (sessionId: string, set: LogSet) => {
    return await apiClient(`/workout_sessions/${sessionId}/sets`, {
      method: "POST",
      body: JSON.stringify(set),
    });
  },

  getSessionSets: async (sessionId: string) => {
    return await apiClient(`/workout_sessions/${sessionId}/sets`);
  },

  // exercises
  getWorkoutPlan: async () => {
    return await apiClient("/workout/plan");
  },

  searchExercises: async (query: string) => {
    return await apiClient(
      `/workout/exercises/search?query=${encodeURIComponent(query)}`,
    );
  },

  getRandomExercises: async () => {
    return await apiClient("/workout/exercises/random");
  },

  getBodyParts: async () => {
    return await apiClient("/workout/exercises/bodyparts");
  },

  getExercisesByBodyPart: async (bodypart: string) => {
    return await apiClient(
      `/workout/exercises/bodypart/${encodeURIComponent(bodypart)}`,
    );
  },
};
