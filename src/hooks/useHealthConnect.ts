import {
  checkHealthPermissions,
  getTodayActiveCalories,
  getTodaySteps,
  initHealthConnect,
  requestHealthPermissions,
} from "@/lib/healthConnect";
import { useCallback, useEffect, useState } from "react";

export const useHealthConnect = () => {
  const [steps, setSteps] = useState(0);
  const [activeCalories, setActiveCalories] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  // Define fetchData first so we can use it cleanly
  const fetchData = useCallback(async () => {
    try {
      const [stepsData, caloriesData] = await Promise.all([
        getTodaySteps(),
        getTodayActiveCalories(),
      ]);
      setSteps(stepsData);
      setActiveCalories(caloriesData);
    } catch (err) {
      console.error("Failed to fetch Health Connect data:", err);
    }
  }, []);

  const setup = async () => {
    try {
      const initialized = await initHealthConnect();
      if (!initialized) {
        setLoading(false);
        return;
      }

      // CRITICAL CHANGE: Check permissions silently instead of requesting them
      const granted = await checkHealthPermissions();
      setHasPermission(granted);

      if (granted) {
        await fetchData();
      }
    } catch (err) {
      console.error("Health Connect setup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Run initial setup silently on mount
  useEffect(() => {
    setup();
  }, [fetchData]);

  // Expose this method for your UI component to link to a press/tap event
  const requestPermissionsAndFetch = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const granted = await requestHealthPermissions();
      setHasPermission(granted);
      if (granted) {
        await fetchData();
      }
      return granted;
    } catch (err) {
      console.error("Manual permission request failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    steps,
    activeCalories,
    hasPermission,
    loading,
    refresh: fetchData,
    requestPermissions: requestPermissionsAndFetch, // <-- Return this to your UI
  };
};
