
import { AdminRole, DeliveryStatus, OrderStatus, VehicleType } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
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
  time_slot?: {
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
// export enum VehicleType {
//   motorcycle = "motorcycle",
//   sedan = "sedan",
//   suv = "suv",
//   van = "van",
//   truck = "truck",
// }

// export enum DeliveryStatus {
//   pending = "pending",
//   in_progress = "in_progress",
//   completed = "completed",
//   cancelled = "cancelled",
// }

// export enum OrderStatus {
//   on_time = "on_time",
//   late = "late",
//   early = "early",
//   not_delivered = "not_delivered",
// }

// export enum AdminRole {
//   super_admin = "super_admin",
//   regional_admin = "regional_admin",
//   standard = "standard",
// }

// Base types (without relations)
export interface Driver {
  driver_id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  hashed_password: string;
  phone_number: string;
  address: string | null;
  start_location: string | null;
  refresh_token: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  vehicle_id: string;
  driver_id: string;
  type: VehicleType;
  company: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  time_slot_id: string;
  start_time: Date;
  end_time: Date;
}

export interface Customer {
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

export interface Delivery {
  delivery_id: string;
  customer_id: string;
  weight: number;
  size: string;
  delivery_instructions: string | null;
  time_slot_id: string;
  dropoff_location: string;
  priority: number;
  latitude: number | null;
  longitude: number | null;
  date: Date;
  delivery_date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryQueue {
  queue_id: string;
  delivery_id: string;
  driver_id: string;
  status: DeliveryStatus;
  date: Date;
  position: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderHistory {
  order_id: string;
  customer_id: string;
  driver_id: string;
  delivery_id: string;
  status: OrderStatus;
  date: Date;
  completed_at: Date | null;
  delivery_duration: number | null;
  delivery_distance: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Route {
  route_id: string;
  driver_id: string;
  delivery_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  route_details: JsonValue; // JSON type
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  assignment_id: string;
  driver_id: string;
  delivery_id: string;
  assigned_at: Date;
  route_id: string;
  sequence_order: number | null;
  expected_arrival_time: Date | null;
}

export interface Admin {
  admin_id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  hashed_password: string;
  phone_number: string;
  role: AdminRole;
  region: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DriverLocation {
  location_id: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed: number | null;
  heading: number | null;
  battery_level: number | null;
}

export interface Feedback {
  feedback_id: string;
  customer_id: string;
  driver_id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

// Types with relations
export interface DriverWithRelations extends Driver {
  vehicles: Vehicle[];
  DeliveryQueue: DeliveryQueue[];
  OrderHistory: OrderHistory[];
  route: Route[];
  Assignment: Assignment[];
  driver_location: DriverLocation[];
  feedback: Feedback[];
}

export interface VehicleWithRelations extends Vehicle {
  driver: Driver;
}

export interface TimeSlotWithRelations extends TimeSlot {
  Delivery: Delivery[];
}

export interface CustomerWithRelations extends Customer {
  Delivery: Delivery[];
  OrderHistory: OrderHistory[];
  feedback: Feedback[];
}

export interface DeliveryWithRelations extends Delivery {
  customer: Customer;
  time_slot: TimeSlot;
  DeliveryQueue: DeliveryQueue[];
  OrderHistory: OrderHistory[];
  route: Route[];
  Assignment: Assignment[];
}

export interface DeliveryQueueWithRelations extends DeliveryQueue {
  delivery: Delivery;
  driver: Driver;
}

export interface OrderHistoryWithRelations extends OrderHistory {
  customer: Customer;
  driver: Driver;
  delivery: Delivery;
}

export interface RouteWithRelations extends Route {
  driver: Driver;
  delivery: Delivery;
  Assignment: Assignment[];
}

export interface AssignmentWithRelations extends Assignment {
  driver: Driver;
  delivery: Delivery;
  route: Route;
}

export interface DriverLocationWithRelations extends DriverLocation {
  driver: Driver;
}

export interface FeedbackWithRelations extends Feedback {
  customer: Customer;
  driver: Driver;
}


export interface getAllDrivers extends Driver {
  vehicles: Vehicle[];
  driver_location: DriverLocation[];
  rating: number | null;
  completed_deliveries: number;
}

export interface DriverWithRatings extends DriverWithRelations {
  rating: number | null;
  completed_deliveries: number;
}
export interface AssignedDriver extends AssignmentWithRelations {
  driver: getAllDrivers;
}
export interface getTommorrowScheduledDeliveries {
  delivery_id: string;
  dropoff_location: string;
  priority: number;
  weight: number;
  size: string;
  customer: Customer;
  Assignment: AssignedDriver[];
  preffered_time: string; //formatted as "HH:mm - HH:mm"
}