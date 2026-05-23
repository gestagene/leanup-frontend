import { apiClient } from "@/lib/apiClient"; // we'll create this
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
    profile: Omit<UserProfile, "id">,
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) throw error;

    const token = data.session?.access_token;
    if (!token) throw new Error("No session token after signup");

    await apiClient(
      "/auth/signup",
      {
        method: "POST",
        body: JSON.stringify({
          name: profile.name,
          age: profile.age,
          height: profile.height,
          weight: profile.weight,
          sex: profile.sex,
          goal: profile.goal,
          fitness_level: profile.fitness_level,
        }),
      },
      token,
    );
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
