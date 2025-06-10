// lib/websocketService.ts
import { io, Socket } from "socket.io-client";
// import { getAllDrivers } from "./types";

export interface LocationUpdate {
  driverId: string;
  latitude: number;
  longitude: number;
  timestamp?: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:4000",
      {
        transports: ["websocket"],
        timeout: 20000,
      }
    );

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket server:", reason);
      this.handleReconnect();
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      this.handleReconnect();
    });

    return this.socket;
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      setTimeout(() => {
        console.log(
          `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );
        this.connect();
      }, delay);
    }
  }

  onLocationUpdate(callback: (data: LocationUpdate) => void) {
    if (!this.socket) {
      console.warn("Socket not connected. Call connect() first.");
      return;
    }

    this.socket.on("location_update", callback);
  }

  offLocationUpdate(callback?: (data: LocationUpdate) => void) {
    if (!this.socket) return;

    if (callback) {
      this.socket.off("location_update", callback);
    } else {
      this.socket.off("location_update");
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();
