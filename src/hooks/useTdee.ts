import { progressService } from "@/services/progress.service";
import { useEffect, useState } from "react";

type Tdee = {
  bmr: number;
  tdee: number;
  target_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fats: number;
  goal: string;
  adjustment: number;
};

const DEFAULT_TDEE: Tdee = {
  bmr: 0,
  tdee: 2000,
  target_calories: 2000,
  target_protein: 145,
  target_carbs: 225,
  target_fats: 55,
  goal: "maintain",
  adjustment: 0,
};

export const useTdee = () => {
  const [tdee, setTdee] = useState<Tdee>(DEFAULT_TDEE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressService
      .getTdee()
      .then(setTdee)
      .catch(() => setTdee(DEFAULT_TDEE))
      .finally(() => setLoading(false));
  }, []);

  return { tdee, loading };
};
