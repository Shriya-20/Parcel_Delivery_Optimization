import * as Location from "expo-location";
import { LOCATION_TASK_NAME } from "./location-task";

export const startBackgroundLocationTracking = async () => {
  const { status: fgStatus } =
    await Location.requestForegroundPermissionsAsync();
  const { status: bgStatus } =
    await Location.requestBackgroundPermissionsAsync();

  if (fgStatus !== "granted" || bgStatus !== "granted") {
    console.warn("Permissions not granted for location tracking.");
    return;
  }

  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TASK_NAME
  );
  if (!hasStarted) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 10,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Nexustron App",
        notificationBody: "Tracking your live location in background, Don't close the app and Don't Worry",
      },
    });
    console.log("Started background location tracking");
  }
};
