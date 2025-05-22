import { Request, Response } from "express";
import { getCustomerDetailsService, sendEmailsToCustomersService } from "../services/customer.services";

export async function getCustomerDetails(req:Request, res:Response){
    try {
        const customer_id = req.params.customer_id;
        if (!customer_id) {
          res.status(400).json({
            success: false,
            message: "Customer ID is required",
            data: null,
          });
          return;
        }
        const customer = await getCustomerDetailsService(customer_id);
        if (!customer) {
          res.status(404).json({
            success: false,
            message: "Customer not found",
            data: null,
          });
          return;
        }
        res.status(200).json({
          success: true,
          message: "Customer details retrieved successfully",
          data: customer,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
}

export async function sendEmailsToCustomers(req:Request, res:Response){
    try {
        const date = req.query.date as string;//need the date
        if (!date) {
            res.status(400).json({
                success: false,
                message: "Date is required",
                data: null,
            });
            return;
        }
        const result = await sendEmailsToCustomersService(date);
        res.status(200).json({
            success: true,
            message: "Emails sent to customers successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
}