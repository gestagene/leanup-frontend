import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types/user.types";

export const userService = {
  createProfile: async (data: UserProfile) => {
    const { error } = await supabase.from("users").insert({
      id: data.id,
      first_name: data.firstName,
      last_name: data.lastName,
      age: data.age,
      height: data.height,
      weight: data.weight,
      goal: data.goal,
      fitnessLevel: data.fitnessLevel,
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
