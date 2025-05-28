import { DeliveryStatus, Driver, VehicleType } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

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

export type DeliveryQueueForDriver = {
  queue_id: string;
  delivery_id: string;
  status: DeliveryStatus;
  date: Date;
  position: number | null;
  customer: {
    first_name: string;
    last_name: string | null;
    phone_number: string;
    address: string | null;
    customer_id: string;
  };
  dropoff_location: string;
  weight: number;
  size: string;
  delivery_instructions: string | null;
  time_slot: {
    start_time: Date;
    end_time: Date;
  };
  driver: Partial<Driver>;
  priority: number;
};

export type RouteDetailsForDelivery = {
  driver_id: string;
  delivery_id: string;
  route_id: string;
  route_details: JsonValue;
} | null;


export interface DashboardStats {
  activeDeliveries: number;
  pendingDeliveries: number;
  onRouteDeliveries: number;
  canceledDeliveries: number;
  availableDrivers: number;
  todayCompleted: number;
  totalRevenue?: number;
}

export interface DailyPerformance {
  date: string;
  completed: number;
  failed: number;
  pending: number;
}

export interface DeliveryStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface TopDriver {
  driver_id: string;
  name: string;
  deliveries: number;
  rating: number;
  status: "active" | "busy" | "offline";
  completionRate: number;
}

export interface RecentActivity {
  id: string;
  type: "delivery" | "assignment" | "cancel" | "new" | "completed";
  message: string;
  driver_name?: string;
  customer_name?: string;
  delivery_id: string;
  timestamp: Date;
  status: string;
}

export interface PeakHour {
  hour: number;
  deliveries: number;
  averageDeliveryTime: number;
}

export interface VehicleFleetStatus {
  type: string;
  total: number;
  active: number;
  utilization: number;
}