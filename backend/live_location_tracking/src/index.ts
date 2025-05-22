import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { updateDriverLocation } from "./helper";


const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // allow frontend origins
  },
});

io.on("connection", (socket) => {
  console.log("Driver connected", socket.id);

  socket.on("driver_location", async (data) => {
    const { driverId, latitude, longitude } = data;

    // 1. Save to DB
    const updatedDriverLocation = await updateDriverLocation(driverId, latitude, longitude);
    if(updateDriverLocation === null) {
      console.error("Failed to update driver location in DB");
      //since as 5sec everytime we get location update so if one fails we can skip and continue
      return;
    }

    // 2. Emit to admins
    io.emit("location_update", updatedDriverLocation);//basically this will be object with driverId,latitude,longitude
    console.log("Driver location updated", updatedDriverLocation);
  });

  socket.on("disconnect", () => {
    console.log("Driver disconnected", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Socket.IO server running on port 4000");
});
