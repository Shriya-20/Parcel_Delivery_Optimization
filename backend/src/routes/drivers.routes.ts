import { Router } from "express";
import { createDriver, getAllDrivers, getDriverById } from "../controllers/drivers.controller";

const driverRouter = Router();

driverRouter.get("/", getAllDrivers);

driverRouter.get("/:id", getDriverById);

driverRouter.post("/", createDriver);

driverRouter.put("/:id", updateDriver);

driverRouter.get("/:id/deliveries", getDriverDeliveries);
driverRouter.get("/:id/route", getDriverRoute);

driverRouter.post("/:id/location", updateDriverLocation);
driverRouter.post("/:id/availability", updateDriverAvailability);

driverRouter.get("/:id/route/:deliveryId", getDriverRouteDelivery);

export default driverRouter;