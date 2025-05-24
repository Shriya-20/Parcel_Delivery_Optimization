import { Request, Response } from "express";
import { getCompleteOrderHistoryService, getDeliveriesByDateService } from "../services/deliveries.services";

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