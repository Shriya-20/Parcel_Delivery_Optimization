import { Router } from "express";
import { adminLogin, driverLogin } from "../controllers/auth.controller";

const authRouter = Router();//api/auth/

authRouter.post("/login/driver", driverLogin);
authRouter.post("/login/admin", adminLogin);
//the signup parts not so imp for now we will do that afterwards
// authRouter.post("/signup/driver", driverSignup);
// authRouter.post("/signup/admin", adminSignup);

export default authRouter;