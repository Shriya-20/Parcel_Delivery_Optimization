import { Router } from "express";
import { bulkAssignRoutes, getRouteByDriverIdAndDate, optimizeRoute } from "../controllers/routes.controller";


const routeRouter = Router();

routeRouter.post("/assignbulk",bulkAssignRoutes);//this is mainly for the Assign deliveires section in admin where we assign drivers and assign routes store them in assignments routes and all

routeRouter.get("/route/:driver_id/:date", getRouteByDriverIdAndDate); // Get route by driver ID and date
routeRouter.post("/optimizeroute/:driver_id/:date", optimizeRoute); // Optimize route by driver ID and date so only one ka this is and send the optimized route to the driver

export default routeRouter;