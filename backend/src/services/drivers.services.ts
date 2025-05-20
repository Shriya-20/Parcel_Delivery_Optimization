// import { Driver } from "@prisma/client";
import { Driver } from "../validation/drivers.validation";
import { prisma } from "../db/db";
import { VehicleType } from "@prisma/client";
import { hash_password } from "./utils.services";
import { newDriver } from "../Types/types";



export async function getAllDriversService(){
    const drivers = await prisma.driver.findMany({
        select: {
          driver_id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone_number: true,
          start_location: true,
          createdAt: true,
          vehicles: {
            select: {
              vehicle_id: true,
              type: true,
              license_plate: true
            }
          }
        }
      });
    return drivers;
}

export async function getDriverByIdService(id:string){
    const driver = await prisma.driver.findUnique({
        where: {
            driver_id: id
        },
        select: {
            driver_id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone_number: true,
            start_location: true,
            createdAt: true,
            vehicles: {
                select: {
                    vehicle_id: true,
                    type: true,
                    license_plate: true
                }
            }
        }
    });
    return driver;
}

export async function createDriverService(driverData:Omit<Driver, "driver_id" | "createdAt" | "updatedAt" | "refresh_token" | "hashed_password"| "address" | "last_name" | "start_location">){
    const newDriver:newDriver = await prisma.driver.create({
        data: {
            ...driverData,
            hashed_password: hash_password(driverData.password),
            vehicles: {
                create: driverData.vehicles.map((vehicle) => ({
                    type: vehicle.type as VehicleType,
                    company: vehicle.company,
                    model: vehicle.model,
                    year: vehicle.year,
                    color: vehicle.color,
                    license_plate: vehicle.license_plate
                }))
            }
        },
        select: {
            driver_id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone_number: true,
            start_location: true,
            createdAt: true,
            vehicles: {
                select: {
                    vehicle_id: true,
                    type: true,
                    company: true,
                    model: true,
                    year: true,
                    color: true,
                    license_plate: true
                }
            }
        }
    });
    return newDriver;
}