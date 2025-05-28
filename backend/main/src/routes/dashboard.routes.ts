import { Router } from "express";
import { getDailyPerformance, getDashboardStats, getDeliveryStatusDistribution, getDriverLocations, getFleetStatus, getPeakHours, getRecentActivity, getTopDrivers } from "../controllers/dashboard.controller";

const dashboardRouter = Router();
// Dashboard stats
dashboardRouter.get(
  "/stats",
  getDashboardStats
);

// Performance metrics
dashboardRouter.get(
  "/performance",
  getDailyPerformance
);

// Status distribution
dashboardRouter.get(
  "/status-distribution",
  getDeliveryStatusDistribution
);

// Top drivers
dashboardRouter.get(
  "/drivers/top",
  getTopDrivers
);

// Recent activity
dashboardRouter.get(
  "/activity",
 getRecentActivity
);

// Peak hours analysis
dashboardRouter.get(
  "/peak-hours",
  getPeakHours
);

// Fleet status
dashboardRouter.get(
  "/fleet-status",
  getFleetStatus
);

// Driver locations (for real-time tracking)
dashboardRouter.get(
  "/driver-locations",
  getDriverLocations
);

export default dashboardRouter;
