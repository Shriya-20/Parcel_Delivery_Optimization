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


export async function getOrderHistoryService(){
    const orderHistory = await prisma.orderHistory.findMany({
        include:{
            delivery:{
                select:{
                    dropoff_location:true,
                    priority:true,
                    delivery_id:true,
                    time_slot:{
                        select:{
                            start_time:true,
                            end_time:true,
                        }
                    }
                }
            },
            customer:{
                select:{
                    first_name:true,
                    last_name:true,
                }
            },
            driver:{
                select:{
                    first_name:true,
                    last_name:true,
                }
            }
        }
    });//for now just this thinking of making a modal type thing to show driver and customer details so then entire shd be returned so thinking of that
    if (!orderHistory) {
        return null;
      }
      const orderHistoryData = orderHistory.map((d) => ({
        delivery: d.delivery,
        customer: d.customer,
        driver: d.driver,
        delivery_date: d.date,
        order_id: d.order_id,
        delivery_status: d.status,
        preffered_time: d.delivery.time_slot.start_time + " - " + d.delivery.time_slot.end_time,
        completed_time: d.completed_at,
      }));
      return orderHistoryData;
}