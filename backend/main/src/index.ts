import express, { urlencoded, json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import driverRouter from "./routes/drivers.routes";
import deliveryRouter from "./routes/delivery.routes";
import customerRouter from "./routes/customer.routes";
import routeRouter from "./routes/route.routes";
import dashboardRouter from "./routes/dashboard.routes";
import adminRouter from "./routes/admin.routes";
import emailRouter from "./routes/email.routes";

const port = process.env.PORT || 8000;
const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());
app.use(cors({
  origin: "*",
  credentials: true,
}))

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Server is up and running" });
});

app.use("/api/auth",authRouter);
app.use("/api/drivers", driverRouter);
app.use("/api/delivery", deliveryRouter);
app.use("/api/customers", customerRouter);
app.use("/api/routes", routeRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/admin", adminRouter);
app.use("/api/email", emailRouter);

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

//each shd return success,message,data or error
//each will have res.status.json then will have return