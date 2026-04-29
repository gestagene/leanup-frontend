import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types/user.types";

export const userService = {
  createProfile: async (data: UserProfile) => {
    const { data: result, error } = await supabase.from("users").insert({
      id: data.id,
      first_name: data.first_name,
      age: data.age,
      sex: data.sex,
      height: data.height,
      weight: data.weight,
      goal: data.goal,
      fitness_level: data.fitness_level,
    });
    if (error) throw error;
  },
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
  },
};
