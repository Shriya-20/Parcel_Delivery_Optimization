import { date } from "zod";
import { prisma } from "../db/db";

//TODO->shd make the delivery date as only date and not datetime and also the time slot is changing and not of indian or as stored in db so shd make that proper
export async function getDeliveriesByDateService(date: string) {
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format");
  }

  const startOfDay = new Date(parsedDate);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(parsedDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const rawDeliveries = await prisma.delivery.findMany({
    where: {
      delivery_date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      customer: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
          phone_number: true,
          address: true,
          customer_id: true,
        },
      },
      Assignment: {
        include: {
          driver: {
            select: {
              driver_id: true,
              first_name: true,
              last_name: true,
              phone_number: true,
              email: true,
              vehicles: {
                select: {
                  type: true,
                  company: true,
                  model: true,
                  year: true,
                  color: true,
                  license_plate: true,
                },
              },
            },
          },
        },
      },
      time_slot: {
        select: {
          start_time: true,
          end_time: true,
        },
      },
    },
  });

  if (!rawDeliveries || rawDeliveries.length === 0) {
    return [];
  }

  // Get unique driver IDs
  const driverIds = [
    ...new Set(
      rawDeliveries
        .map((d) => d.Assignment[0]?.driver?.driver_id)
        .filter(Boolean)
    ),
  ];

  // Fetch driver ratings individually
  const driverRatings = await prisma.feedback.groupBy({
    by: ["driver_id"],
    _avg: { rating: true },
    where: {
      driver_id: { in: driverIds },
    },
  });

  // Fetch completed deliveries individually
  const completedDeliveries = await prisma.orderHistory.groupBy({
    by: ["driver_id"],
    _count: { delivery_id: true },
    where: {
      driver_id: { in: driverIds },
    },
  });

  // Create lookup maps
  const ratingMap = Object.fromEntries(
    driverRatings.map((r) => [r.driver_id, r._avg.rating])
  );
  const completedMap = Object.fromEntries(
    completedDeliveries.map((r) => [r.driver_id, r._count.delivery_id])
  );

  // Final deliveries format
  const deliveries = rawDeliveries.map((d) => {
    const driver = d.Assignment[0]?.driver;
    const driver_id = driver?.driver_id;

    return {
      delivery_id: d.delivery_id,
      dropoff_location: d.dropoff_location,
      priority: d.priority,
      customer: d.customer,
      Assignment: d.Assignment.map((assign) => ({
        ...assign,
        driver: {
          ...assign.driver,
          rating: ratingMap[assign.driver.driver_id] ?? null,
          completed_deliveries: completedMap[assign.driver.driver_id] ?? 0,
        },
      })),
      preffered_time: `${
        new Date(d.time_slot.start_time).toTimeString().split(" ")[0]
      } - ${new Date(d.time_slot.end_time).toTimeString().split(" ")[0]}`,
    };
  });

  return deliveries;
}


export async function getCompleteOrderHistoryService() {
  try {
    // Get completed order history
    const orderHistory = await prisma.orderHistory.findMany({
      where:{
        status:{
          in: ["on_time", "late", "early", "not_delivered"],
        }
      },
      include: {
        delivery: {
          select: {
            dropoff_location: true,
            priority: true,
            delivery_id: true,
            weight: true,
            size: true,
            delivery_instructions: true,
            delivery_date: true,
            time_slot: {
              select: {
                start_time: true,
                end_time: true,
              },
            },
          },
        },
        customer: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            phone_number: true,
            address: true,
            customer_id: true,
          },
        },
        driver: {
          select: {
            first_name: true,
            last_name: true,
            phone_number: true,
            email: true,
            driver_id: true,
            vehicles: {
              select: {
                type: true,
                company: true,
                model: true,
                year: true,
                color: true,
                license_plate: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Get ongoing deliveries (from DeliveryQueue with in_progress status)
    const ongoingDeliveries = await prisma.deliveryQueue.findMany({
      where: {
        status: "in_progress",
      },
      include: {
        delivery: {
          include: {
            customer: {
              select: {
                first_name: true,
                last_name: true,
                email: true,
                phone_number: true,
                address: true,
                customer_id: true,
              },
            },
            time_slot: {
              select: {
                start_time: true,
                end_time: true,
              },
            },
          },
        },
        driver: {
          select: {
            first_name: true,
            last_name: true,
            phone_number: true,
            email: true,
            driver_id: true,
            vehicles: {
              select: {
                type: true,
                company: true,
                model: true,
                year: true,
                color: true,
                license_plate: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Get pending deliveries (from DeliveryQueue with pending status)
    const pendingDeliveries = await prisma.deliveryQueue.findMany({
      where: {
        status: "pending",
      },
      include: {
        delivery: {
          include: {
            customer: {
              select: {
                first_name: true,
                last_name: true,
                email: true,
                phone_number: true,
                address: true,
                customer_id: true,
              },
            },
            time_slot: {
              select: {
                start_time: true,
                end_time: true,
              },
            },
          },
        },
        driver: {
          select: {
            first_name: true,
            last_name: true,
            phone_number: true,
            email: true,
            driver_id: true,
            vehicles: {
              select: {
                type: true,
                company: true,
                model: true,
                year: true,
                color: true,
                license_plate: true,
              },
            },
          },
        },
      },
      orderBy: [
        { position: "asc" }, // Order by queue position
        { date: "desc" },
      ],
    });

    // Transform completed order history data
    const completedOrdersData = orderHistory.map((order) => ({
      order_id: order.order_id,
      delivery_id: order.delivery.delivery_id,
      status: "completed",
      delivery_status: order.status, // on_time, late, early, not_delivered
      delivery: {
        dropoff_location: order.delivery.dropoff_location,
        priority: order.delivery.priority,
        weight: order.delivery.weight,
        size: order.delivery.size,
        delivery_instructions: order.delivery.delivery_instructions,
        delivery_date: order.delivery.delivery_date,
      },
      customer: order.customer,
      driver: order.driver,
      preferred_time: `${order.delivery.time_slot.start_time} - ${order.delivery.time_slot.end_time}`,
      completed_time: order.completed_at,
      delivery_date: order.date,
      delivery_duration: order.delivery_duration,
      delivery_distance: order.delivery_distance,
    }));

    // Transform ongoing deliveries data
    const ongoingOrdersData = ongoingDeliveries.map((queue) => ({
      queue_id: queue.queue_id,
      delivery_id: queue.delivery.delivery_id,
      status: "ongoing",
      delivery_status: queue.status, // in_progress
      delivery: {
        dropoff_location: queue.delivery.dropoff_location,
        priority: queue.delivery.priority,
        weight: queue.delivery.weight,
        size: queue.delivery.size,
        delivery_instructions: queue.delivery.delivery_instructions,
        delivery_date: queue.delivery.delivery_date,
      },
      customer: queue.delivery.customer,
      driver: queue.driver,
      preferred_time: `${queue.delivery.time_slot.start_time} - ${queue.delivery.time_slot.end_time}`,
      queue_date: queue.date,
      position: queue.position,
      completed_time: null,
      delivery_duration: null,
      delivery_distance: null,
      delivery_date: queue.delivery.delivery_date, // Include delivery date for ongoing orders
    }));

    // Transform pending deliveries data
    const pendingOrdersData = pendingDeliveries.map((queue) => ({
      queue_id: queue.queue_id,
      delivery_id: queue.delivery.delivery_id,
      status: "pending",
      delivery_status: queue.status, // pending
      delivery: {
        dropoff_location: queue.delivery.dropoff_location,
        priority: queue.delivery.priority,
        weight: queue.delivery.weight,
        size: queue.delivery.size,
        delivery_instructions: queue.delivery.delivery_instructions,
        delivery_date: queue.delivery.delivery_date,
      },
      customer: queue.delivery.customer,
      driver: queue.driver,
      preferred_time: `${queue.delivery.time_slot.start_time} - ${queue.delivery.time_slot.end_time}`,
      queue_date: queue.date,
      position: queue.position,
      completed_time: null,
      delivery_duration: null,
      delivery_distance: null,
      delivery_date: queue.delivery.delivery_date, // Include delivery date for pending orders
    }));

    // Return combined data
    return  {
        completed: completedOrdersData,
        ongoing: ongoingOrdersData,
        pending: pendingOrdersData,
        summary: {
          total_completed: completedOrdersData.length,
          total_ongoing: ongoingOrdersData.length,
          total_pending: pendingOrdersData.length,
          total_orders:
            completedOrdersData.length +
            ongoingOrdersData.length +
            pendingOrdersData.length,
        },
      };
  } catch (error) {
    console.error("Error fetching complete order history:", error);
    return {
      success: false,
      error: "Failed to fetch order history",
      data: null,
    };
  }
}

// Alternative function that returns all orders in a single array with status indicators
// export async function getAllOrdersFlattened() {
//   try {
//     const result = await getCompleteOrderHistoryService();

//     if (!result.success) {
//       return result;
//     }

//     // Combine all orders into a single array
//     const allOrders = [
//       ...result.data.completed,
//       ...result.data.ongoing,
//       ...result.data.pending,
//     ];

//     // Sort by most recent first (using appropriate date field for each status)
//     allOrders.sort((a, b) => {
//       const dateA = a.completed_time || a.queue_date || a.delivery_date;
//       const dateB = b.completed_time || b.queue_date || b.delivery_date;
//       return new Date(dateB) - new Date(dateA);
//     });

//     return {
//       success: true,
//       data: {
//         orders: allOrders,
//         summary: result.data.summary,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching flattened orders:", error);
//     return {
//       success: false,
//       error: "Failed to fetch orders",
//       data: null,
//     };
//   }
// }