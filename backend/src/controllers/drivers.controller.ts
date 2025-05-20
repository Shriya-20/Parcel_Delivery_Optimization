import { Request, Response } from "express";
import { createDriverService, getAllDriversService, getDriverByIdService } from "../services/drivers.services";
import { Driver, driverSchema } from "../validation/drivers.validation";
import { VehicleType } from "@prisma/client";
import { newDriver } from "../Types/types";


export async function getAllDrivers(req:Request,res:Response){
    try {
        const drivers = await getAllDriversService();
        res.status(200).json({
            success: true,
            message: "Drivers fetched successfully",
            data: drivers
        })
        return;
    } catch (error) {
        console.error("Get Jobs Error:", error);
        res.status(500).json({
          success: false,
          message: "Internal Server Error",
          error: (error as Error).message,
        });
        return;
    }
}

export async function getDriverById(req:Request, res:Response){
    const {id} = req.params;
    try {
        const driver = await getDriverByIdService(id);
        if (!driver) {
            res.status(404).json({
                success:false,
                message: "Driver not found",
                data: null
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Driver fetched successfully",
            data: driver
        });
    } catch (error) {
        console.error("Get Driver By ID Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: (error as Error).message
        });
    }
}

export async function createDriver(req:Request, res:Response){
    try {
        const validationResult = driverSchema.safeParse(req.body);
        if (validationResult.success) {
            const driverData = validationResult.data;
            const newDriver:newDriver = await createDriverService(driverData);
            res.status(201).json({
                success: true,
                message: "Driver created successfully",
                data: newDriver
            });
            return;
        }
        if (!validationResult.success) {
            res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: validationResult.error.errors
            });
            return;
        }
    } catch (error) {
        console.error("Create Driver Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: (error as Error).message
        });
    }
}