import { prisma } from "../db/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminRole } from "@prisma/client";
export async function getDriverFromEmail(email: string) {
  try {
    const driver = await prisma.driver.findUnique({
      where: { email },
    });
    return driver;
  } catch (error) {
    console.error("Error fetching driver by email:", error);
    throw new Error("Database error");
  }
}
export async function getAdminFromEmail(email: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
    return admin;
  } catch (error) {
    console.error("Error fetching admin by email:", error);
    throw new Error("Database error");
  }
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  // Implement your password comparison logic here, e.g., using bcrypt
  return await bcrypt.compare(password, hashedPassword);
}

interface DriverForLogin{
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
interface AdminForLogin {
  admin_id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone_number: string;
  role: AdminRole;
  hashed_password: string;
  region: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function generateJwtToken(driver: DriverForLogin): Promise<string> {
  const token = jwt.sign(
    { id: driver.driver_id, email: driver.email },
    process.env.JWT_SECRET || "your_jwt_secret",
    { expiresIn: "7d" }
  );
  return token;
}

export async function generateJwtTokenForAdmin(
  admin: AdminForLogin
): Promise<string> {
  const token = jwt.sign(
    { id: admin.admin_id, email: admin.email },
    process.env.JWT_SECRET || "your_jwt_secret",
    { expiresIn: "7d" }
  );
  return token;
}