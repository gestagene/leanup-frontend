import { authService } from "@/services/auth.service";
import { progressService } from "@/services/progress.service";
import { userService } from "@/services/user.service";
import { UserProfile } from "@/types/user.types";
import { useEffect, useState } from "react";

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const session = await authService.getSession();
        if (!session) return;
        const [profileData, streakData] = await Promise.all([
          userService.getProfile(),
          progressService.getStreak(),
        ]);
        setProfile(profileData);
        setStreak(streakData.streak);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { profile, streak, loading };
};
