import { Router } from "express";
import { getDeliveries, getDeliveryId, getOrderHistory, updateTimeslot } from "../controllers/deliveries.controller";

const deliveryRouter = Router();

//working fine and we need to pass the data as query param in the format of yyyy-mm-dd
deliveryRouter.get("/", getDeliveries)//send date in query params and this one is to get the complete deliveries and this can be used for getting for assigning and also the customer time slots also

//working fine
deliveryRouter.get("/orderhistory", getOrderHistory)//this is to get the complete order history

deliveryRouter.get("/:id",getDeliveryId);
deliveryRouter.post("/:id/time-slot",updateTimeslot);

export default deliveryRouter;