import { Router } from "express";
import { createDriver, deliveryStatusChange, getAllDrivers, getDriverById, getDriverDeliveries, getDriverRouteDelivery, getDriverSpecificDelivery, updateDriver, updateDriverLocation } from "../controllers/drivers.controller";

const driverRouter = Router();

//tested and working just see the ratings part
driverRouter.get("/", getAllDrivers);//get all drivers with their details

//getting proper just need to add the ratings part and all in this
driverRouter.get("/:id", getDriverById);//get driver info by id

driverRouter.post("/", createDriver);//to create a new driver

driverRouter.put("/:id", updateDriver);//to update driver info

//!IMP->the date shd be passed as query param and like ?date=2023-10-01 in yyyy-mm-dd format, and also one day ahead ka it is the date we need to send
//working fine
driverRouter.get("/:id/deliveries", getDriverDeliveries);//to get the delivery queue for a driver and date shd be passed as query param
// driverRouter.get("/:id/route", getDriverRoute);

driverRouter.get("/:id/deliveries/:deliveryId", getDriverSpecificDelivery);//to get the delivery details for a specific delivery for a driver


//!IMP-> the route details in this of the ortools api we need to store ig so that part shd be done
//it is working fine
driverRouter.get("/:id/route/:deliveryId", getDriverRouteDelivery);//to get the route for a specific delivery for a driver

driverRouter.post("/:id/location", updateDriverLocation);//to update the location of the driver

// driverRouter.post("/:id/availability", updateDriverAvailability);
driverRouter.post("/:id/:delivery_id/status", deliveryStatusChange);//change the status in the delivery queue to "in progress", "completed", or "cancelled"

export default driverRouter;
//!IMP->Test all the post requests and the put requests