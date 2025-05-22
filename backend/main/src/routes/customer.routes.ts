import { Router } from "express";
import { getCustomerDetails, sendEmailsToCustomers } from "../controllers/customer.controller";

const customerRouter = Router();

customerRouter.get("/:customer_id", getCustomerDetails); // Get customer details by ID

customerRouter.get("/sendemails", sendEmailsToCustomers); //this requires date in query params, and also since we get date and we send to al just a normal function we are doing here

export default customerRouter;