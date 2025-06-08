import { Request, Response } from "express";
import { createDeliveryEmailTemplate, transporter } from "../services/email.services";
interface Customer {
  customer_id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone_number: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date;
  updatedAt: Date;
}
interface Deliveries {
  delivery_id: string;
  dropoff_location: string;
  priority: number;
  weight: number;
  size: string;
  customer: Customer;
  preffered_time: string;
}

export async function sendEmail(req: Request, res:Response){
    try {
        const { deliveries } = req.body as { deliveries: Deliveries[] };
        if (!deliveries) {
            res.status(400).json({
                success: false,
                message: "Deliveries are required",
                data: null,
            });
            return;
        }
        // Send emails to deliveries
        for (const delivery of deliveries) {
            // Logic to send email
            const emailTemplate = createDeliveryEmailTemplate(
                delivery.customer.first_name + " " + delivery.customer.last_name,
                delivery.delivery_id,
                {
                    dropoff_location: delivery.dropoff_location,
                    priority: delivery.priority,
                    weight: delivery.weight,
                    size: delivery.size,
                }
            );
            await transporter.sendMail({
                from: process.env.EMAIL_USER, // your Gmail address
                to: delivery.customer.email, // recipient's email
                subject: "Delivery Scheduled - Margadarshi",
                html: emailTemplate,
            });
        }
        res.status(200).json({
            success: true,
            message: "Emails sent successfully",
            data: null,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
        return;
    }
}