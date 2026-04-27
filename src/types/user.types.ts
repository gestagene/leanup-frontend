export type UserGoal =
  | "general_fitness"
  | "lose_weight"
  | "build_muscle"
  | "maintain";
export type UserFitnessLevel = "beginner" | "intermediate" | "advanced";
export type UserSex = "male" | "female";

export type UserProfile = {
  id: string;
  email: string;
  password: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  sex: UserSex | null;
  goal: UserGoal | null;
  fitnessLevel: UserFitnessLevel | null;
};
