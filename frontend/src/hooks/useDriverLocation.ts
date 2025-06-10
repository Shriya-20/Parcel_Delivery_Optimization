// hooks/useDriverLocations.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { websocketService, LocationUpdate } from "@/lib/webSocketService";
import { getAllDrivers } from "@/lib/types";
import { toast } from "sonner";

interface UseDriverLocationsReturn {
  drivers: getAllDrivers[];
  updateDrivers: (newDrivers: getAllDrivers[]) => void;
  isWebSocketConnected: boolean;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
}

export function useDriverLocations(
  initialDrivers: getAllDrivers[] = []
): UseDriverLocationsReturn {
  const [drivers, setDrivers] = useState<getAllDrivers[]>(initialDrivers);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");

  // Use ref to avoid stale closure issues
  const driversRef = useRef<getAllDrivers[]>(drivers);
  driversRef.current = drivers;

  const handleLocationUpdate = useCallback((locationData: LocationUpdate) => {
    console.log("Received location update:", locationData);

    setDrivers((prevDrivers) => {
      const updatedDrivers = prevDrivers.map((driver) => {
        if (driver.driver_id === locationData.driverId) {
          // Update the driver's location
          const updatedDriver = { ...driver };

          // Update driver_location array
          if (
            updatedDriver.driver_location &&
            updatedDriver.driver_location.length > 0
          ) {
            updatedDriver.driver_location = [
              {
                ...updatedDriver.driver_location[0],
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                // updatedAt: locationData.timestamp || new Date().toISOString(),
              },
            ];
          } else {
            // Create new location if none exists
            updatedDriver.driver_location = [
              {
                // id: Date.now().toString(), // temporary ID
                driver_id: driver.driver_id,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                // updated_at: locationData.timestamp || new Date().toISOString(),
                // created_at: new Date().toISOString(),
              },
            ];
          }

          return updatedDriver;
        }
        return driver;
      });

      return updatedDrivers;
    });
  }, []);

  const connectWebSocket = useCallback(() => {
    setConnectionStatus("connecting");

    try {
      const socket = websocketService.connect();

      if (socket) {
        socket.on("connect", () => {
          setIsWebSocketConnected(true);
          setConnectionStatus("connected");
          toast.success("Real-time tracking connected");
        });

        socket.on("disconnect", () => {
          setIsWebSocketConnected(false);
          setConnectionStatus("disconnected");
          toast.warning("Real-time tracking disconnected");
        });

        socket.on("connect_error", () => {
          setIsWebSocketConnected(false);
          setConnectionStatus("error");
          toast.error("Failed to connect to real-time tracking");
        });

        // Listen for location updates
        websocketService.onLocationUpdate(handleLocationUpdate);
      }
    } catch (error) {
      console.error("WebSocket connection error:", error);
      setConnectionStatus("error");
      toast.error("Failed to initialize real-time tracking");
    }
  }, [handleLocationUpdate]);

  const disconnectWebSocket = useCallback(() => {
    websocketService.offLocationUpdate(handleLocationUpdate);
    websocketService.disconnect();
    setIsWebSocketConnected(false);
    setConnectionStatus("disconnected");
  }, [handleLocationUpdate]);

  const updateDrivers = useCallback((newDrivers: getAllDrivers[]) => {
    setDrivers(newDrivers);
  }, []);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, [connectWebSocket, disconnectWebSocket]);

  // Update drivers when initialDrivers changes
  useEffect(() => {
    if (initialDrivers.length > 0) {
      setDrivers(initialDrivers);
    }
  }, [initialDrivers]);

  return {
    drivers,
    updateDrivers,
    isWebSocketConnected,
    connectionStatus,
  };
}
