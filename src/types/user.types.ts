export type UserGoal =
  | "general_fitness"
  | "lose_weight"
  | "build_muscle"
  | "maintain";
export type FitnessLevel = "beginner" | "intermediate" | "advanced";

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  height: number;
  weight: number;
  goal: UserGoal;
  fitnessLevel: FitnessLevel;
};
