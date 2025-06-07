import { Request, Response } from "express";
import {
  comparePassword,
  generateJwtToken,
  getDriverFromEmail,
} from "../services/auth.services";
interface DriverForLogin {
  driver_id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  hashed_password: string;
  phone_number: string;
  address: string | null;
  start_location_latitude: number | null;
  start_location_longitude: number | null;
  start_location: string;
  refresh_token: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
export async function driverLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    console.log("Driver login request received:", { email, password });
    if (!email || !password) {
       res.status(400).json({
        success: false,
        message: "Email and password are required",
        data: null,
      });
      return
    }
    const driverFromEmail = await getDriverFromEmail(email);
    if (!driverFromEmail) {
        res.status(404).json({
        success: false,
        message: "Invalid credentials",
        data: null,
      });
        return;
    }
    const isPasswordValid = await comparePassword(
      password,
      driverFromEmail.hashed_password
    );
    if (!isPasswordValid) {
       res.status(401).json({
        success: false,
        message: "Invalid credentials",
        data: null,
      });
        return;
    }
    const jwtToken = await generateJwtToken(driverFromEmail);
    const driverWithoutPassword: Omit<DriverForLogin, "hashed_password"> = {
      driver_id: driverFromEmail.driver_id,
      first_name: driverFromEmail.first_name,
      last_name: driverFromEmail.last_name,
      email: driverFromEmail.email,
      phone_number: driverFromEmail.phone_number,
      address: driverFromEmail.address,
      start_location_latitude: driverFromEmail.start_location_latitude,
      start_location_longitude: driverFromEmail.start_location_longitude,
      start_location: driverFromEmail.start_location,
      refresh_token: driverFromEmail.refresh_token,
      status: driverFromEmail.status,
      createdAt: driverFromEmail.createdAt,
      updatedAt: driverFromEmail.updatedAt,
    };
    //!imp-> as react native we cant have cookies so better send jwt in response body
    // res.cookie("tooken", jwtToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,//have for 7days for now
    // });
    // res.cookie("driverId", driverFromEmail.driver_id, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });
    res.status(200).json({
      success: true,
      message: "Driver login successful",
      data: {
        driver: driverWithoutPassword,
        token: jwtToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
}
