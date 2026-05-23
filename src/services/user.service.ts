import { apiClient } from "@/lib/apiClient";
import { UserProfile } from "@/types/user.types";

export const userService = {
  getProfile: async () => {
    return await apiClient("/users/me");
  },

  updateProfile: async (updates: Partial<Omit<UserProfile, "id">>) => {
    return await apiClient("/users/me", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },
};
