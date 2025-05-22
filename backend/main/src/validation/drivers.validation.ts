import { z } from "zod";

export const driverSchema = z.object({
  driver_id: z.string().uuid(),
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100).optional(),
  email: z.string().email(),
  phone_number: z.string().min(10).max(15),
  start_location: z.string().min(2).max(100).optional(),
  password: z.string().min(8).max(100),
  address: z.string().min(2).max(100).optional(),
  refresh_token: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  vehicles: z.array(
    z.object({
      type: z.enum(['"motorcycle","sedan","suv","van","truck"']),
      company: z.string().min(2).max(100),
      model: z.string().min(2).max(100),
      year: z.number().min(1900).max(new Date().getFullYear()),
      color: z.string().min(2).max(100),
      license_plate: z.string().min(2).max(100),
    })
  ),
});

export type Driver = z.infer<typeof driverSchema>;

export const driverLocationSchema = z.object({
  location_id: z.string().uuid().optional(),
  driver_id: z.string().uuid(),
  latitude: z.number(),
  longitude: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  timestamp: z.date().optional(),
  speed: z.number().optional(),
  heading: z.number().optional(),
  battery_level: z.number().optional(),
});
export type DriverLocation = z.infer<typeof driverLocationSchema>;