import * as TaskManager from "expo-task-manager";
// import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

const LOCATION_TASK_NAME = "background-location-task";

// Initialize socket
const socket = io("http://localhost:4000");

TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({
    data,
    error,
  }: {
    data?: { locations: { coords: { latitude: number; longitude: number } }[] };
    error: TaskManager.TaskManagerError | null;
  }) => {
    if (error) {
      console.error("Location task error:", error);
      return;
    }

    if (data && data.locations && data.locations.length > 0) {
      const { locations } = data;
      const { latitude, longitude } = locations[0].coords;

      const driverId = await AsyncStorage.getItem("driverId"); // get driverId stored at login
      if (!driverId) return;

      socket.emit("driver_location", {
        driverId,
        latitude,
        longitude,
      });

      console.log("Sent background location:", latitude, longitude);
    }
  }
);

export { LOCATION_TASK_NAME };
