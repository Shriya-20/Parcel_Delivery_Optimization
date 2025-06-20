// // // hooks/useDriverLocations.ts
// // import { useState, useEffect, useCallback, useRef } from "react";
// // import { websocketService, LocationUpdate } from "@/lib/webSocketService";
// // import { getAllDrivers } from "@/lib/types";
// // import { toast } from "sonner";

// // interface UseDriverLocationsReturn {
// //   drivers: getAllDrivers[];
// //   updateDrivers: (newDrivers: getAllDrivers[]) => void;
// //   isWebSocketConnected: boolean;
// //   connectionStatus: "connecting" | "connected" | "disconnected" | "error";
// // }

// // export function useDriverLocations(
// //   initialDrivers: getAllDrivers[] = []
// // ): UseDriverLocationsReturn {
// //   const [drivers, setDrivers] = useState<getAllDrivers[]>(initialDrivers);
// //   const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
// //   const [connectionStatus, setConnectionStatus] = useState<
// //     "connecting" | "connected" | "disconnected" | "error"
// //   >("disconnected");

// //   // Use ref to avoid stale closure issues
// //   const driversRef = useRef<getAllDrivers[]>(drivers);
// //   driversRef.current = drivers;

// //   const handleLocationUpdate = useCallback((locationData: LocationUpdate) => {
// //     console.log("Received location update:", locationData);

// //     setDrivers((prevDrivers) => {
// //       const updatedDrivers = prevDrivers.map((driver) => {
// //         if (driver.driver_id === locationData.driverId) {
// //           // Update the driver's location
// //           const updatedDriver = { ...driver };

// //           // Update driver_location array
// //           if (
// //             updatedDriver.driver_location &&
// //             updatedDriver.driver_location.length > 0
// //           ) {
// //             updatedDriver.driver_location = [
// //               {
// //                 ...updatedDriver.driver_location[0],
// //                 latitude: locationData.latitude,
// //                 longitude: locationData.longitude,
// //                 // updatedAt: locationData.timestamp || new Date().toISOString(),
// //               },
// //             ];
// //           } else {
// //             // Create new location if none exists
// //             updatedDriver.driver_location = [
// //               {
// //                 // id: Date.now().toString(), // temporary ID
// //                 driver_id: driver.driver_id,
// //                 latitude: locationData.latitude,
// //                 longitude: locationData.longitude,
// //                 // updated_at: locationData.timestamp || new Date().toISOString(),
// //                 // created_at: new Date().toISOString(),
// //               },
// //             ];
// //           }

// //           return updatedDriver;
// //         }
// //         return driver;
// //       });

// //       return updatedDrivers;
// //     });
// //   }, []);

// //   const connectWebSocket = useCallback(() => {
// //     setConnectionStatus("connecting");

// //     try {
// //       const socket = websocketService.connect();

// //       if (socket) {
// //         socket.on("connect", () => {
// //           setIsWebSocketConnected(true);
// //           setConnectionStatus("connected");
// //           toast.success("Real-time tracking connected");
// //         });

// //         socket.on("disconnect", () => {
// //           setIsWebSocketConnected(false);
// //           setConnectionStatus("disconnected");
// //           toast.warning("Real-time tracking disconnected");
// //         });

// //         socket.on("connect_error", () => {
// //           setIsWebSocketConnected(false);
// //           setConnectionStatus("error");
// //           toast.error("Failed to connect to real-time tracking");
// //         });

// //         // Listen for location updates
// //         websocketService.onLocationUpdate(handleLocationUpdate);
// //       }
// //     } catch (error) {
// //       console.error("WebSocket connection error:", error);
// //       setConnectionStatus("error");
// //       toast.error("Failed to initialize real-time tracking");
// //     }
// //   }, [handleLocationUpdate]);

// //   const disconnectWebSocket = useCallback(() => {
// //     websocketService.offLocationUpdate(handleLocationUpdate);
// //     websocketService.disconnect();
// //     setIsWebSocketConnected(false);
// //     setConnectionStatus("disconnected");
// //   }, [handleLocationUpdate]);

// //   const updateDrivers = useCallback((newDrivers: getAllDrivers[]) => {
// //     setDrivers(newDrivers);
// //   }, []);

// //   // Connect on mount, disconnect on unmount
// //   useEffect(() => {
// //     connectWebSocket();

// //     return () => {
// //       disconnectWebSocket();
// //     };
// //   }, [connectWebSocket, disconnectWebSocket]);

// //   // Update drivers when initialDrivers changes
// //   useEffect(() => {
// //     if (initialDrivers.length > 0) {
// //       setDrivers(initialDrivers);
// //     }
// //   }, [initialDrivers]);

// //   return {
// //     drivers,
// //     updateDrivers,
// //     isWebSocketConnected,
// //     connectionStatus,
// //   };
// // }
// // hooks/useDriverLocations.ts
// import { useState, useEffect, useCallback, useRef } from 'react';
// import { websocketService, LocationUpdate } from '@/lib/webSocketService';
// import { getAllDrivers } from '@/lib/types';
// import { toast } from 'sonner';

// interface UseDriverLocationsReturn {
//   drivers: getAllDrivers[];
//   updateDrivers: (newDrivers: getAllDrivers[]) => void;
//   isWebSocketConnected: boolean;
//   connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
//   initializeWebSocket: () => void;
// }

// export function useDriverLocations(): UseDriverLocationsReturn {
//   const [drivers, setDrivers] = useState<getAllDrivers[]>([]);
//   const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
//   const [isWebSocketInitialized, setIsWebSocketInitialized] = useState(false);
//   console.log("drivers", drivers);
//   // Use ref to avoid stale closure issues
//   const driversRef = useRef<getAllDrivers[]>(drivers);
//   driversRef.current = drivers;

//   const handleLocationUpdate = useCallback((locationData: LocationUpdate) => {
//     console.log('Received location update:', locationData);
    
//     setDrivers(prevDrivers => {
//       const updatedDrivers = prevDrivers.map(driver => {
//         if (driver.driver_id === locationData.driverId) {
//           // Update the driver's location
//           const updatedDriver = { ...driver };
          
//           // Update driver_location array
//           if (updatedDriver.driver_location && updatedDriver.driver_location.length > 0) {
//             updatedDriver.driver_location = [{
//               ...updatedDriver.driver_location[0],
//               latitude: locationData.latitude,
//               longitude: locationData.longitude,
//               // updatedAt: locationData.timestamp || new Date().toISOString()
//             }];
//           } else {
//             // Create new location if none exists
//             updatedDriver.driver_location = [{
//               // id: Date.now().toString(), // temporary ID
//               driver_id: driver.driver_id,
//               latitude: locationData.latitude,
//               longitude: locationData.longitude,
//               // updatedAt: locationData.timestamp || new Date().toISOString(),
//               // createdAt: new Date().toISOString()
//             }];
//           }
          
//           return updatedDriver;
//         }
//         return driver;
//       });
      
//       return updatedDrivers;
//     });
//   }, []);

//   const connectWebSocket = useCallback(() => {
//     if (isWebSocketInitialized) return; // Prevent multiple initializations
    
//     setConnectionStatus('connecting');
    
//     try {
//       const socket = websocketService.connect();
      
//       if (socket) {
//         socket.on('connect', () => {
//           setIsWebSocketConnected(true);
//           setConnectionStatus('connected');
//           toast.success('Real-time tracking connected');
//         });

//         socket.on('disconnect', () => {
//           setIsWebSocketConnected(false);
//           setConnectionStatus('disconnected');
//           toast.warning('Real-time tracking disconnected');
//         });

//         socket.on('connect_error', () => {
//           setIsWebSocketConnected(false);
//           setConnectionStatus('error');
//           toast.error('Failed to connect to real-time tracking');
//         });

//         // Listen for location updates
//         websocketService.onLocationUpdate(handleLocationUpdate);
//         setIsWebSocketInitialized(true);
//       }
//     } catch (error) {
//       console.error('WebSocket connection error:', error);
//       setConnectionStatus('error');
//       toast.error('Failed to initialize real-time tracking');
//     }
//   }, [handleLocationUpdate, isWebSocketInitialized]);

//   const disconnectWebSocket = useCallback(() => {
//     websocketService.offLocationUpdate(handleLocationUpdate);
//     websocketService.disconnect();
//     setIsWebSocketConnected(false);
//     setConnectionStatus('disconnected');
//   }, [handleLocationUpdate]);

//   const updateDrivers = useCallback((newDrivers: getAllDrivers[]) => {
//     setDrivers(newDrivers);
//   }, []);

//   const initializeWebSocket = useCallback(() => {
//     connectWebSocket();
//   }, [connectWebSocket]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       disconnectWebSocket();
//     };
//   }, [disconnectWebSocket]);

//   return {
//     drivers,
//     updateDrivers,
//     isWebSocketConnected,
//     connectionStatus,
//     initializeWebSocket
//   };
// }

// hooks/useDriverLocations.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { websocketService, LocationUpdate } from '@/lib/webSocketService';
import { getAllDrivers } from '@/lib/types';
import { toast } from 'sonner';

interface UseDriverLocationsReturn {
  drivers: getAllDrivers[];
  updateDrivers: (newDrivers: getAllDrivers[]) => void;
  isWebSocketConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  initializeWebSocket: () => void;
}

export function useDriverLocations(): UseDriverLocationsReturn {
  const [drivers, setDrivers] = useState<getAllDrivers[]>([]);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const isWebSocketInitializedRef = useRef(false);
  
  console.log("Current drivers:", drivers.length);

  // Use ref to avoid stale closure issues
  const driversRef = useRef<getAllDrivers[]>(drivers);
  driversRef.current = drivers;

  const handleLocationUpdate = useCallback((locationData: LocationUpdate) => {
    console.log('Processing location update:', locationData);
    
    setDrivers(prevDrivers => {
      const driverIndex = prevDrivers.findIndex(
        driver => driver.driver_id === locationData.driverId
      );

      if (driverIndex === -1) {
        console.warn(`Driver with ID ${locationData.driverId} not found in current drivers list`);
        return prevDrivers;
      }

      const updatedDrivers = [...prevDrivers];
      const driver = { ...updatedDrivers[driverIndex] };
      
      // Update driver_location array
      if (driver.driver_location && driver.driver_location.length > 0) {
        driver.driver_location = [{
          ...driver.driver_location[0],
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          // updatedAt: locationData.timestamp || new Date().toISOString()
        }];
      } else {
        // Create new location if none exists
        driver.driver_location = [{
          driver_id: driver.driver_id,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          // updatedAt: locationData.timestamp || new Date().toISOString(),
          // createdAt: new Date().toISOString()
        }];
      }
      
      updatedDrivers[driverIndex] = driver;
      console.log(`Updated location for driver ${locationData.driverId}`);
      
      return updatedDrivers;
    });
  }, []);

  const connectWebSocket = useCallback(() => {
    if (isWebSocketInitializedRef.current) {
      console.log('WebSocket already initialized');
      return;
    }
    
    console.log('Initializing WebSocket connection...');
    setConnectionStatus('connecting');
    
    try {
      const socket = websocketService.connect();
      
      if (socket) {
        // Set up event listeners
        socket.on('connect', () => {
          console.log('WebSocket connected successfully');
          setIsWebSocketConnected(true);
          setConnectionStatus('connected');
          toast.success('Real-time tracking connected');
        });

        socket.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason);
          setIsWebSocketConnected(false);
          setConnectionStatus('disconnected');
          
          if (reason !== 'io client disconnect') {
            toast.warning('Real-time tracking disconnected');
          }
        });

        socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          setIsWebSocketConnected(false);
          setConnectionStatus('error');
          toast.error('Failed to connect to real-time tracking');
        });

        // Listen for location updates
        websocketService.onLocationUpdate(handleLocationUpdate);
        isWebSocketInitializedRef.current = true;
        
        console.log('WebSocket event listeners registered');
      }
    } catch (error) {
      console.error('WebSocket initialization error:', error);
      setConnectionStatus('error');
      toast.error('Failed to initialize real-time tracking');
    }
  }, [handleLocationUpdate]);

  const disconnectWebSocket = useCallback(() => {
    console.log('Disconnecting WebSocket...');
    websocketService.offLocationUpdate(handleLocationUpdate);
    websocketService.disconnect();
    setIsWebSocketConnected(false);
    setConnectionStatus('disconnected');
    isWebSocketInitializedRef.current = false;
  }, [handleLocationUpdate]);

  const updateDrivers = useCallback((newDrivers: getAllDrivers[]) => {
    console.log(`Updating drivers list: ${newDrivers.length} drivers`);
    setDrivers(newDrivers);
  }, []);

  const initializeWebSocket = useCallback(() => {
    if (drivers.length > 0) { // Only initialize if we have drivers
      connectWebSocket();
    } else {
      console.log('No drivers available, skipping WebSocket initialization');
    }
  }, [connectWebSocket, drivers.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Cleaning up WebSocket connection');
      disconnectWebSocket();
    };
  }, [disconnectWebSocket]);

  // Debug: Log connection status changes
  useEffect(() => {
    console.log('Connection status changed:', connectionStatus);
  }, [connectionStatus]);

  return {
    drivers,
    updateDrivers,
    isWebSocketConnected,
    connectionStatus,
    initializeWebSocket
  };
}