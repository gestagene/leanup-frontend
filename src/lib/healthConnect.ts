import {
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  readRecords,
  requestPermission,
  SdkAvailabilityStatus,
} from "react-native-health-connect";

export const initHealthConnect = async (): Promise<boolean> => {
  try {
    const status = await getSdkStatus();
    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
      console.log("Health Connect not available on this device");
      return false;
    }
    if (
      status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
    ) {
      console.log("Health Connect needs update");
      return false;
    }

    // Awaiting this successfully signals that the native module bridge is up
    await initialize();
    return true;
  } catch (err) {
    console.error("Failed to initialize Health Connect:", err);
    return false;
  }
};

export const requestHealthPermissions = async (): Promise<boolean> => {
  try {
    // This must be invoked within an active, foregrounded React Native window context
    const granted = await requestPermission([
      { accessType: "read", recordType: "Steps" },
      { accessType: "read", recordType: "ActiveCaloriesBurned" },
    ]);
    return granted.length > 0;
  } catch (err) {
    console.error("Failed to request permissions:", err);
    return false;
  }
};

export const getTodaySteps = async (): Promise<number> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await readRecords("Steps", {
      timeRangeFilter: {
        operator: "between",
        startTime: today.toISOString(),
        endTime: new Date().toISOString(),
      },
    });

    return result.records.reduce((sum, record) => sum + record.count, 0);
  } catch (err) {
    console.error("Failed to get steps:", err);
    return 0;
  }
};

export const getTodayActiveCalories = async (): Promise<number> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await readRecords("ActiveCaloriesBurned", {
      timeRangeFilter: {
        operator: "between",
        startTime: today.toISOString(),
        endTime: new Date().toISOString(),
      },
    });

    const total = result.records.reduce(
      (sum, record) => sum + record.energy.inKilocalories,
      0,
    );
    return Math.round(total);
  } catch (err) {
    console.error("Failed to get active calories:", err);
    return 0;
  }
};

export const checkHealthPermissions = async (): Promise<boolean> => {
  try {
    const granted = await getGrantedPermissions();

    // Check if the permissions we need are already in the granted list
    const hasSteps = granted.some((p) => p.recordType === "Steps");
    const hasCalories = granted.some(
      (p) => p.recordType === "ActiveCaloriesBurned",
    );

    return hasSteps && hasCalories;
  } catch (err) {
    console.error("Failed to check permissions:", err);
    return false;
  }
};
