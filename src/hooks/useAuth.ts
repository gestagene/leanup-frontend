import { supabase } from "@/lib/supabase";
import { userService } from "@/services/user.service";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      if (url.includes("access_token") || url.includes("token_hash")) {
        await supabase.auth.exchangeCodeForSession(url);
      }
    };
    const sub = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setIsEmailConfirmed(session?.user?.email_confirmed_at != null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoggedIn(!!session);
      setIsLoading(false);

      if (event === "SIGNED_IN" && session) {
        //const confirmed = session?.user?.email_confirmed_at != null;
        setIsEmailConfirmed(true);

        //if (confirmed) {
        try {
          const { data: existingProfile } = await supabase
            .from("users")
            .select("id")
            .eq("id", session.user.id)
            .single();

          if (!existingProfile) {
            const meta = session.user.user_metadata;
            await userService.createProfile({
              id: session.user.id,
              name: meta.name,
              age: meta.age,
              sex: meta.sex,
              height: meta.height,
              weight: meta.weight,
              goal: meta.goal,
              fitness_level: meta.fitness_level,
            });
          }
        } catch (err: any) {
          console.log("profile creation error:", err);
        }
        //}
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isLoggedIn, isLoading, isEmailConfirmed };
}
