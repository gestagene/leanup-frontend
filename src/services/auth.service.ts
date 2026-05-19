import { supabase } from "@/lib/supabase";
import { UserCredentials, UserProfile } from "@/types/user.types";

export const authService = {
  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },

  signUp: async (
    credentials: UserCredentials,
    profile: Omit<UserProfile, "id">
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: profile.name,
          age: profile.age,
          sex: profile.sex,
          goal: profile.goal,
          fitness_level: profile.fitness_level,
          height: profile.height,
          weight: profile.weight,
        },
      },
    });
    console.log("signUp result:", data, error);
    if (error) throw error;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getSession: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};
