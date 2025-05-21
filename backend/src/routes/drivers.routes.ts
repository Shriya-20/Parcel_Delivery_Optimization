import { Router } from "express";
import { createDriver, deliveryStatusChange, getAllDrivers, getDriverById, getDriverDeliveries, getDriverRouteDelivery, updateDriver, updateDriverLocation } from "../controllers/drivers.controller";

const driverRouter = Router();

driverRouter.get("/", getAllDrivers);//get all drivers with their details

driverRouter.get("/:id", getDriverById);//get driver info by id

driverRouter.post("/", createDriver);//to create a new driver

driverRouter.put("/:id", updateDriver);//to update driver info

driverRouter.get("/:id/deliveries", getDriverDeliveries);//to get the delivery queue for a driver and date shd be passed as query param
// driverRouter.get("/:id/route", getDriverRoute);
driverRouter.get("/:id/route/:deliveryId", getDriverRouteDelivery);//to get the route for a specific delivery for a driver

driverRouter.post("/:id/location", updateDriverLocation);//to update the location of the driver

// driverRouter.post("/:id/availability", updateDriverAvailability);
driverRouter.post("/:id/:delivery_id/status", deliveryStatusChange);//change the status in the delivery queue to "in progress", "completed", or "cancelled"

export default driverRouter;