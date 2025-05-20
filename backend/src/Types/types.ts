import { VehicleType } from "@prisma/client";

export {
  Driver,
  Vehicle,
  VehicleType,
  Delivery,
  Customer,
  Route,
  Assignment,
  TimeSlot,
  OrderHistory,
  DeliveryQueue,
  Admin,
  Feedback,
  AdminRole,
  DeliveryStatus,
  DriverLocation,
  OrderStatus,
} from "@prisma/client";

export type newDriver = {
  driver_id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone_number: string;
  start_location: string | null;
  createdAt: Date;
  vehicles: {
    vehicle_id: string;
    type: VehicleType;
    company: string;
    model: string;
    year: number;
    color: string;
    license_plate: string;
  }[];
};
