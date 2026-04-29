export type UserCredentials = {
  email: string;
  password: string;
};
export type UserGoal =
  | "general_fitness"
  | "lose_weight"
  | "build_muscle"
  | "maintain";
export type UserFitnessLevel = "beginner" | "intermediate" | "advanced";
export type UserSex = "male" | "female";

export type UserProfile = {
  id: string;
  first_name: string;
  age: number;
  height: number;
  weight: number;
  sex: UserSex | null;
  goal: UserGoal | null;
  fitness_level: UserFitnessLevel | null;
};
