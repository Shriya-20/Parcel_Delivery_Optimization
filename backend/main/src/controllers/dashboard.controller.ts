import { prisma } from "../db/db";
import {
  DashboardStats,
  DailyPerformance,
  DeliveryStatusDistribution,
  TopDriver,
  RecentActivity,
  PeakHour,
  VehicleFleetStatus,
} from "../Types/types";
import { Request, Response } from "express";


// GET /api/dashboard/stats
export async function getDashboardStats(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("Fetching dashboard stats...");
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Active deliveries (in_progress status)
    const activeDeliveries = await prisma.deliveryQueue.count({
      where: { status: "in_progress" },
    });

    // Pending deliveries
    const pendingDeliveries = await prisma.deliveryQueue.count({
      where: { status: "pending" },
    });

    // On route deliveries (assigned but not completed)
    const onRouteDeliveries = await prisma.assignment.count({
      where: {
        assigned_at: {
          gte: startOfDay,
        },
        delivery: {
          DeliveryQueue: {
            some: {
              status: "in_progress",
            },
          },
        },
      },
    });

    // Canceled deliveries today
    const canceledDeliveries = await prisma.deliveryQueue.count({
      where: {
        status: "cancelled",
        updatedAt: {
          gte: startOfDay,
        },
      },
    });

    // Available drivers (not currently assigned)
    const totalDrivers = await prisma.driver.count();
    const busyDrivers = await prisma.assignment.findMany({
      where: {
        assigned_at: {
          gte: startOfDay,
        },
      },
      select: {
        driver_id: true,
      },
      distinct: ["driver_id"],
    });
    const availableDrivers = totalDrivers - busyDrivers.length;

    // Today's completed deliveries
    const todayCompleted = await prisma.deliveryQueue.count({
      where: {
        status: "completed",
        updatedAt: {
          gte: startOfDay,
        },
      },
    });

    const stats: DashboardStats = {
      activeDeliveries,
      pendingDeliveries,
      onRouteDeliveries,
      canceledDeliveries,
      availableDrivers,
      todayCompleted,
    };

    res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: stats,
    });
    return;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
}

// GET /api/dashboard/performance?days=7
export async function getDailyPerformance(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("Fetching daily performance data...");
    const days = parseInt(req.query.days as string) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const performanceData = await prisma.$queryRaw<
      Array<{
        date: Date;
        completed: bigint;
        failed: bigint;
        pending: bigint;
      }>
    >`
          SELECT 
            DATE("updatedAt") as date,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
            COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as failed,
            COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
          FROM "DeliveryQueue"
          WHERE "updatedAt" >= ${startDate}
          GROUP BY DATE("updatedAt")
          ORDER BY date DESC
        `;

    const formattedData: DailyPerformance[] = performanceData.map((item) => ({
      date: item.date.toISOString().split("T")[0],
      completed: Number(item.completed),
      failed: Number(item.failed),
      pending: Number(item.pending),
    }));

    res.status(200).json({
      success: true,
      message: "Daily performance data fetched successfully",
      data: formattedData,
    });
    return;
  } catch (error) {
    console.error("Error fetching daily performance:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
}

// GET /api/dashboard/status-distribution
export async function getDeliveryStatusDistribution(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("Fetching delivery status distribution...");
    const statusCounts = await prisma.deliveryQueue.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const total = statusCounts.reduce(
      (sum, item) => sum + item._count.status,
      0
    );

    const distribution: DeliveryStatusDistribution[] = statusCounts.map(
      (item) => ({
        status: item.status,
        count: item._count.status,
        percentage: Math.round((item._count.status / total) * 100),
      })
    );

    res.status(200).json({
      success: true,
      message: "Delivery status distribution fetched successfully",
      data: distribution,
    });
    return;
  } catch (error) {
    console.error("Error fetching status distribution:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
}

// GET /api/dashboard/drivers/top?limit=5
export async function getTopDrivers(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("Fetching top drivers...");
    const limit = parseInt(req.query.limit as string) || 5;
    const currentMonth = new Date();
    currentMonth.setDate(1);

    const topDriversData = await prisma.$queryRaw<
      Array<{
        driver_id: string;
        first_name: string;
        last_name: string | null;
        deliveries: bigint;
        avg_rating: number | null;
        completion_rate: number;
      }>
    >`
          SELECT 
            d.driver_id,
            d.first_name,
            d.last_name,
            COUNT(dq.delivery_id) as deliveries,
            AVG(f.rating) as avg_rating,
            (COUNT(CASE WHEN dq.status = 'completed' THEN 1 END) * 100.0 / 
             NULLIF(COUNT(dq.delivery_id), 0)) as completion_rate
          FROM "Driver" d
          LEFT JOIN "DeliveryQueue" dq ON d.driver_id = dq.driver_id 
          LEFT JOIN "Feedback" f ON d.driver_id = f.driver_id
          WHERE dq."updatedAt" >= ${currentMonth}
          GROUP BY d.driver_id, d.first_name, d.last_name
          HAVING COUNT(dq.delivery_id) > 0
          ORDER BY deliveries DESC, avg_rating DESC
          LIMIT ${limit}
        `;

    // Get current status for each driver
    const driversWithStatus: TopDriver[] = await Promise.all(
      topDriversData.map(async (driver) => {
        const activeAssignment = await prisma.assignment.findFirst({
          where: {
            driver_id: driver.driver_id,
            assigned_at: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        });

        const driverLocation = await prisma.driverLocation.findUnique({
          where: { driver_id: driver.driver_id },
        });

        let status: "active" | "busy" | "offline" = "offline";
        if (driverLocation) {
          const timeDiff = Date.now() - driverLocation.timestamp.getTime();
          if (timeDiff < 5 * 60 * 1000) {
            // Last seen within 5 minutes
            status = activeAssignment ? "busy" : "active";
          }
        }

        return {
          driver_id: driver.driver_id,
          name: `${driver.first_name} ${driver.last_name || ""}`.trim(),
          deliveries: Number(driver.deliveries),
          rating: driver.avg_rating
            ? Math.round(driver.avg_rating * 10) / 10
            : 0,
          status,
          completionRate: Math.round(driver.completion_rate),
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Top drivers fetched successfully",
      data: driversWithStatus,
    });
    return;
  } catch (error) {
    console.error("Error fetching top drivers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
}

// GET /api/dashboard/activity?limit=10 - FIXED VERSION
export async function getRecentActivity(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("Fetching recent activity...");
    const limit = parseInt(req.query.limit as string) || 10;

    // FIXED: Use select instead of include to avoid circular references
    const recentActivities = await prisma.deliveryQueue.findMany({
      take: limit,
      orderBy: { updatedAt: "desc" },
      select: {
        queue_id: true,
        delivery_id: true,
        status: true,
        updatedAt: true,
        delivery: {
          select: {
            delivery_id: true,
            customer: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        driver: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    const activities: RecentActivity[] = recentActivities.map((activity) => {
      let type: RecentActivity["type"] = "delivery";
      let message = "";

      switch (activity.status) {
        case "pending":
          type = "new";
          message = `New parcel #${activity.delivery_id.slice(-6)} created`;
          break;
        case "in_progress":
          type = "delivery";
          message = `Parcel #${activity.delivery_id.slice(
            -6
          )} out for delivery`;
          break;
        case "completed":
          type = "completed";
          message = `Parcel #${activity.delivery_id.slice(
            -6
          )} delivered successfully`;
          break;
        case "cancelled":
          type = "cancel";
          message = `Parcel #${activity.delivery_id.slice(-6)} canceled`;
          break;
      }

      return {
        id: activity.queue_id,
        type,
        message,
        driver_name: `${activity.driver.first_name} ${
          activity.driver.last_name || ""
        }`.trim(),
        customer_name: `${activity.delivery.customer.first_name} ${
          activity.delivery.customer.last_name || ""
        }`.trim(),
        delivery_id: activity.delivery_id,
        timestamp: activity.updatedAt,
        status: activity.status,
      };
    });

    res.status(200).json({
      success: true,
      message: "Recent activity fetched successfully",
      data: activities,
    });
    return;
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
}

// GET /api/dashboard/peak-hours
export async function getPeakHours(req: Request, res: Response): Promise<void> {
  try {
    console.log("Fetching peak hours data...");
    const days = parseInt(req.query.days as string) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const peakHoursData = await prisma.$queryRaw<
      Array<{
        hour: number;
        deliveries: bigint;
        avg_duration: number | null;
      }>
    >`
          SELECT 
            EXTRACT(HOUR FROM d.delivery_date) as hour,
            COUNT(d.delivery_id) as deliveries,
            AVG(oh.delivery_duration) as avg_duration
          FROM "Delivery" d
          LEFT JOIN "OrderHistory" oh ON d.delivery_id = oh.delivery_id
          WHERE d."createdAt" >= ${startDate}
          GROUP BY EXTRACT(HOUR FROM d.delivery_date)
          ORDER BY hour
        `;

    const peakHours: PeakHour[] = peakHoursData.map((item) => ({
      hour: Number(item.hour),
      deliveries: Number(item.deliveries),
      averageDeliveryTime: item.avg_duration
        ? Math.round(item.avg_duration)
        : 0,
    }));

    res.status(200).json({
      success: true,
      message: "Peak hours data fetched successfully",
      data: peakHours,
    });
    return;
  } catch (error) {
    console.error("Error fetching peak hours:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
}

// GET /api/dashboard/fleet-status
export async function getFleetStatus(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("Fetching fleet status...");
    const fleetData = await prisma.$queryRaw<
      Array<{
        type: string;
        total: bigint;
        active: bigint;
      }>
    >`
          SELECT 
            v.type,
            COUNT(v.vehicle_id) as total,
            COUNT(CASE WHEN dl.location_id IS NOT NULL 
                       AND dl.timestamp > NOW() - INTERVAL '5 minutes' 
                  THEN 1 END) as active
          FROM "Vehicle" v
          LEFT JOIN "Driver" d ON v.driver_id = d.driver_id
          LEFT JOIN "DriverLocation" dl ON d.driver_id = dl.driver_id
          GROUP BY v.type
          ORDER BY total DESC
        `;

    const fleetStatus: VehicleFleetStatus[] = fleetData.map((item) => ({
      type: item.type,
      total: Number(item.total),
      active: Number(item.active),
      utilization:
        item.total > 0
          ? Math.round((Number(item.active) / Number(item.total)) * 100)
          : 0,
    }));

    res.status(200).json({
      success: true,
      message: "Fleet status fetched successfully",
      data: fleetStatus,
    });
    return;
  } catch (error) {
    console.error("Error fetching fleet status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
}

// GET /api/dashboard/driver-locations (for real-time map) - FIXED VERSION
export async function getDriverLocations(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // FIXED: Use select instead of include
    console.log("Fetching driver locations...");
    const activeDrivers = await prisma.driverLocation.findMany({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
      select: {
        driver_id: true,
        latitude: true,
        longitude: true,
        speed: true,
        heading: true,
        timestamp: true,
        driver: {
          select: {
            driver_id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    const locations = activeDrivers.map((location) => ({
      driver_id: location.driver_id,
      name: `${location.driver.first_name} ${
        location.driver.last_name || ""
      }`.trim(),
      latitude: location.latitude,
      longitude: location.longitude,
      speed: location.speed,
      heading: location.heading,
      timestamp: location.timestamp,
    }));

    res.status(200).json({
      success: true,
      message: "Driver locations fetched successfully",
      data: locations,
    });
    return;
  } catch (error) {
    console.error("Error fetching driver locations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
}
