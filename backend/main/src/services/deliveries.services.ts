import { prisma } from "../db/db";

export async function getDeliveriesByDateService(date: string){
    const rawDeliveries = await prisma.delivery.findMany({
      where: {
        delivery_date: date,
      },
      include: {
        customer: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        Assignment: {
          include: {
            driver: {
              select: {
                first_name: true,
                last_name: true,
                driver_id: true,
              },
            },
          },
        },
        time_slot:{
            select:{
                start_time:true,
                end_time:true,
            }
        }
      },
    });//if do inlclude,then prisma will give the entire object of the delivery table along with the included relation tables
    if (!rawDeliveries) {
      return null;
    }
    const deliveries = rawDeliveries.map((d) => ({
      delivery_id: d.delivery_id,
      dropoff_location: d.dropoff_location,
      priority: d.priority,
      customer: d.customer,
      Assignment: d.Assignment,
      preffered_time: d.time_slot.start_time + " - " + d.time_slot.end_time,
    }));
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