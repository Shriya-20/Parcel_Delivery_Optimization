import { Router } from "express";
import { sendEmail } from "../controllers/email.controller";

const emailRouter = Router();

emailRouter.post("/send-timeslots-emails",sendEmail);

export default emailRouter;
