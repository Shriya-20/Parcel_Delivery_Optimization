import { Router } from "express";
import { getDeliveries, getOrderHistory } from "../controllers/deliveries.controller";

const deliveryRouter = Router();

deliveryRouter.get("/", getDeliveries)//send date in query params and this one is to get the complete deliveries and this can be used for getting for assigning and also the customer time slots also

deliveryRouter.get("/orderhistory", getOrderHistory)//this is to get the complete order history


export default deliveryRouter;