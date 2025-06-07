import { Router } from "express";
import { driverLogin } from "../controllers/auth.controller";

const authRouter = Router();//api/auth/

authRouter.post("/login/driver", driverLogin);
// authRouter.get("/login/admin", adminLogin);
// authRouter.get("/signup/driver", driverSignup);
// authRouter.get("/signup/admin", adminSignup); 

export default authRouter;