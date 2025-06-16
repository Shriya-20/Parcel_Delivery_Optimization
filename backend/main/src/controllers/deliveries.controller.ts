import { Request, Response } from "express";
import { getCompleteOrderHistoryService, getDeliveriesByDateService, getDeliveryByIdService, updateDeliveryTimeSlotService } from "../services/deliveries.services";

export async function getDeliveries(
  req: Request<{}, {}, {}, { date: string }>,
  res: Response
) {
  try {
    const { date } = req.query;//this is the date of delivery basically which we will have
    if (!date) {
      res.status(400).json({
        success: false,
        message: "Date is required",
        data: null,
      });
      return;
    }
    const allDeliveries = await getDeliveriesByDateService(date);
    if (allDeliveries?.length=== 0) {
      //if the length is 0 then no deliveries found
       res.status(200).json({
        success: false,
        message: "No deliveries found for this date",
        data: null,
      });//shd be a 200 as proper but no deliveries found so else if 404 then goes as error
      return;
    }
    res.status(200).json({
      success: true,
      message: "Deliveries found",
      data: allDeliveries,
    });
    return;
  } catch (error) {
    console.error("Get Deliveries Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
}

export async function getOrderHistory(req: Request, res: Response) {
  try {
    const orderHistory = await getCompleteOrderHistoryService();//for now gets complete shd limit to date also some 5 days and have pagination impletement also then
    if (!orderHistory) {
      res.status(404).json({
        success: false,
        message: "No deliveries found for this date",
        data: null,
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Deliveries found",
      data: orderHistory,
    });
    return;
  } catch (error) {
    console.error("Get Deliveries Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
}

export async function getDeliveryId(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Delivery ID is required",
        data: null,
      });
      return;
    }
    const delivery = await getDeliveryByIdService(id);
    if (!delivery) {
      res.status(404).json({
        success: false,
        message: "Delivery not found",
        data: null,
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Delivery found",
      data: delivery,
    });
  } catch (error) {
    console.error("Get Delivery Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
}

// export async function updateTimeslot(req: Request, res: Response) {
//   try {
//     const { id } = req.params;
//     const { timeslot } = req.body;
//     if (!id || !timeslot) {
//       res.status(400).json({
//         success: false,
//         message: "Delivery ID and timeslot are required",
//         data: null,
//       });
//       return;
//     }
//     // Assuming you have a service to update the timeslot
//     const updatedDelivery = await updateDeliveryTimeSlotService(id, timeslot.start_time, timeslot.end_time);
//     if (!updatedDelivery) {
//       res.status(404).json({
//         success: false,
//         message: "Delivery not found or could not update timeslot",
//         data: null,
//       });
//       return;
//     }
//     res.status(200).json({
//       success: true,
//       message: "Timeslot updated successfully",
//       data: updatedDelivery,
//     });
//   } catch (error) {
//     console.error("Update Timeslot Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: (error as Error).message,
//     });
//   }
// }
export async function updateTimeslot(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { timeSlot } = req.body;
    console.log("timeslot", timeSlot);
    console.log("id", id);
    if (!id || !timeSlot) {
      res.status(400).json({
        success: false,
        message: "Delivery ID and timeslot are required",
        data: null,
      });
      return;
    }

    // Validate timeslot structure
    if (!timeSlot.start_time || !timeSlot.end_time) {
      res.status(400).json({
        success: false,
        message: "Both start_time and end_time are required",
        data: null,
      });
      return;
    }

    const updatedDelivery = await updateDeliveryTimeSlotService(
      id,
      new Date(timeSlot.start_time),
      new Date(timeSlot.end_time)
    );

    if (!updatedDelivery) {
      res.status(404).json({
        success: false,
        message: "Delivery not found or could not update timeslot",
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Timeslot updated successfully",
      data: updatedDelivery,
    });
  } catch (error) {
    console.error("Update Timeslot Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
}