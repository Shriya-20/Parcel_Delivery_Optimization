// // lib/websocketService.ts
// import { io, Socket } from "socket.io-client";
// // import { getAllDrivers } from "./types";

// export interface LocationUpdate {
//   driverId: string;
//   latitude: number;
//   longitude: number;
//   timestamp?: string;
// }

// class WebSocketService {
//   private socket: Socket | null = null;
//   private reconnectAttempts = 0;
//   private maxReconnectAttempts = 5;
//   private reconnectDelay = 1000;

//   connect() {
//     if (this.socket?.connected) {
//       return this.socket;
//     }

//     this.socket = io(
//       process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:4000",
//       {
//         transports: ["websocket"],
//         timeout: 20000,
//       }
//     );

//     this.socket.on("connect", () => {
//       console.log("Connected to WebSocket server");
//       this.reconnectAttempts = 0;
//     });

//     this.socket.on("disconnect", (reason) => {
//       console.log("Disconnected from WebSocket server:", reason);
//       this.handleReconnect();
//     });

//     this.socket.on("connect_error", (error) => {
//       console.error("WebSocket connection error:", error);
//       this.handleReconnect();
//     });

//     return this.socket;
//   }

//   private handleReconnect() {
//     if (this.reconnectAttempts < this.maxReconnectAttempts) {
//       this.reconnectAttempts++;
//       const delay =
//         this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

//       setTimeout(() => {
//         console.log(
//           `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
//         );
//         this.connect();
//       }, delay);
//     }
//   }

//   onLocationUpdate(callback: (data: LocationUpdate) => void) {
//     if (!this.socket) {
//       console.warn("Socket not connected. Call connect() first.");
//       return;
//     }

//     this.socket.on("location_update", callback);
//   }

//   offLocationUpdate(callback?: (data: LocationUpdate) => void) {
//     if (!this.socket) return;

//     if (callback) {
//       this.socket.off("location_update", callback);
//     } else {
//       this.socket.off("location_update");
//     }
//   }

//   disconnect() {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//     }
//   }

//   isConnected(): boolean {
//     return this.socket?.connected || false;
//   }
// }

// // Create singleton instance
// export const websocketService = new WebSocketService();
// lib/webSocketService.ts
import { io, Socket } from "socket.io-client";

export interface LocationUpdate {
  driverId: string;
  latitude: number;
  longitude: number;
  timestamp?: string;
  cached?: boolean; // Optional flag to indicate if this update was cached
}

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  connect() {
    if (this.socket?.connected) {
      console.log("WebSocket already connected");
      return this.socket;
    }

    if (this.isConnecting) {
      console.log("WebSocket connection already in progress");
      return this.socket;
    }

    this.isConnecting = true;
    console.log("Connecting to WebSocket server...");

    this.socket = io(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:4000",
      {
        transports: ["websocket", "polling"], // Allow both transports
        timeout: 20000,
        forceNew: true, // Force new connection
      }
    );

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server", this.socket?.id);
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      
      // Join admin room (optional)
      this.socket?.emit("join_admin");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket server:", reason);
      this.isConnecting = false;
      
      // Only attempt reconnect if it wasn't a manual disconnect
      if (reason !== "io client disconnect") {
        this.handleReconnect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      this.isConnecting = false;
      this.handleReconnect();
    });

    // Debug: Listen to all events
    this.socket.onAny((eventName, ...args) => {
      console.log("WebSocket event received:", eventName, args);
    });

    return this.socket;
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && !this.isConnecting) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      console.log(
        `Attempting to reconnect in ${delay}ms... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        this.connect();
      }, delay);
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached. Please refresh the page.");
    }
  }

  onLocationUpdate(callback: (data: LocationUpdate) => void) {
    if (!this.socket) {
      console.warn("Socket not connected. Call connect() first.");
      return;
    }

    console.log("Registering location update listener");
    this.socket.on("location_update", (data) => {
      console.log("Location update received:", data);
      callback(data);
    });
  }

  offLocationUpdate(callback?: (data: LocationUpdate) => void) {
    if (!this.socket) return;

    if (callback) {
      this.socket.off("location_update", callback);
    } else {
      this.socket.off("location_update");
    }
  }

  // Method to emit driver location (for driver app)
  emitDriverLocation(driverId: string, latitude: number, longitude: number) {
    if (!this.socket?.connected) {
      console.warn("Socket not connected. Cannot emit driver location.");
      return false;
    }

    const locationData = {
      driverId,
      latitude,
      longitude,
      timestamp: new Date().toISOString()
    };

    this.socket.emit("driver_location", locationData);
    console.log("Driver location emitted:", locationData);
    return true;
  }

  disconnect() {
    if (this.socket) {
      console.log("Disconnecting WebSocket");
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getConnectionState(): "connected" | "connecting" | "disconnected" {
    if (this.socket?.connected) return "connected";
    if (this.isConnecting) return "connecting";
    return "disconnected";
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();