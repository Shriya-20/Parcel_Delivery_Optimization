// import express from "express";
// import http from "http";
// import { Server as SocketIOServer } from "socket.io";
// import { updateDriverLocation } from "./helper";

// const app = express();
// const server = http.createServer(app);
// const io = new SocketIOServer(server, {
//   cors: {
//     origin: "*", // allow frontend origins
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Driver connected", socket.id);

//   socket.on("driver_location", async (data) => {
//     const { driverId, latitude, longitude } = data;

//     // 1. Save to DB
//     const updatedDriverLocation = await updateDriverLocation(
//       driverId,
//       latitude,
//       longitude
//     );
//     if (updateDriverLocation === null) {
//       console.error("Failed to update driver location in DB");
//       //since as 5sec everytime we get location update so if one fails we can skip and continue
//       return;
//     }

//     // 2. Emit to admins
//     io.emit("location_update", updatedDriverLocation); //basically this will be object with driverId,latitude,longitude
//     console.log("Driver location updated", updatedDriverLocation);
//   });

//   socket.on("disconnect", () => {
//     console.log("Driver disconnected", socket.id);
//   });
// });

// server.listen(4000, () => {
//   console.log("Socket.IO server running on port 4000");
// });
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { updateDriverLocation } from "./helper";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // allow frontend origins
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);

  // Handle driver location updates from driver app
  socket.on("driver_location", async (data) => {
    console.log("Received driver location:", data);
    const { driverId, latitude, longitude } = data;

    try {
      // 1. Save to DB
      const updatedDriverLocation = await updateDriverLocation(
        driverId,
        latitude,
        longitude
      );

      if (updatedDriverLocation === null) {
        console.error(
          "Failed to update driver location in DB for driver:",
          driverId
        );
        return; // Skip this update
      }

      // 2. Emit to all connected clients (admins)
      // Make sure the data structure matches what your frontend expects
      const locationUpdate = {
        driverId,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
        ...updatedDriverLocation, // Include any additional data from DB
      };

      io.emit("location_update", locationUpdate);
      console.log("Driver location updated and broadcast:", locationUpdate);
    } catch (error) {
      console.error("Error processing driver location update:", error);
    }
  });

  // Handle admin joining (optional - for room management)
  socket.on("join_admin", () => {
    socket.join("admins");
    console.log("Admin joined:", socket.id);
  });

  // Handle driver joining (optional - for room management)
  socket.on("join_driver", (driverId) => {
    socket.join(`driver_${driverId}`);
    console.log(`Driver ${driverId} joined:`, socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Socket.IO server running on port 4000");
});