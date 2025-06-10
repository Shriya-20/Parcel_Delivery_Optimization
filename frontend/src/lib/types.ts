// Enums
export enum VehicleType {
  motorcycle = "motorcycle",
  sedan = "sedan",
  suv = "suv",
  van = "van",
  truck = "truck",
}

export enum DeliveryStatus {
  pending = "pending",
  in_progress = "in_progress",
  completed = "completed",
  cancelled = "cancelled",
}

export enum OrderStatus {
  on_time = "on_time",
  late = "late",
  early = "early",
  not_delivered = "not_delivered",
}

export enum AdminRole {
  super_admin = "super_admin",
  regional_admin = "regional_admin",
  standard = "standard",
}

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
  route_details: any; // JSON type
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
  location_id?: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  timestamp?: Date;
  speed?: number | null;
  heading?: number | null;
  battery_level?: number | null;
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

// Input types for creation (excluding auto-generated fields)
export interface CreateDriverInput {
  first_name: string;
  last_name?: string | null;
  email: string;
  hashed_password: string;
  phone_number: string;
  address?: string | null;
  start_location?: string | null;
  refresh_token?: string | null;
}

export interface CreateVehicleInput {
  driver_id: string;
  type: VehicleType;
  company: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
}

export interface CreateCustomerInput {
  first_name: string;
  last_name?: string | null;
  email: string;
  phone_number: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface CreateDeliveryInput {
  customer_id: string;
  weight: number;
  size: string;
  delivery_instructions?: string | null;
  time_slot_id: string;
  dropoff_location: string;
  priority?: number;
  latitude?: number | null;
  longitude?: number | null;
  delivery_date?: Date;
}

export interface CreateTimeSlotInput {
  start_time: Date;
  end_time: Date;
}

export interface CreateDeliveryQueueInput {
  delivery_id: string;
  driver_id: string;
  status?: DeliveryStatus;
  date: Date;
  position?: number | null;
}

export interface CreateOrderHistoryInput {
  customer_id: string;
  driver_id: string;
  delivery_id: string;
  status: OrderStatus;
  date: Date;
  completed_at?: Date | null;
  delivery_duration?: number | null;
  delivery_distance?: number | null;
}

export interface CreateRouteInput {
  driver_id: string;
  delivery_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  route_details: any;
}

export interface CreateAssignmentInput {
  driver_id: string;
  delivery_id: string;
  route_id: string;
  sequence_order?: number | null;
  expected_arrival_time?: Date | null;
}

export interface CreateAdminInput {
  first_name: string;
  last_name?: string | null;
  email: string;
  hashed_password: string;
  phone_number: string;
  role?: AdminRole;
  region?: string | null;
}

export interface CreateDriverLocationInput {
  driver_id: string;
  latitude: number;
  longitude: number;
  speed?: number | null;
  heading?: number | null;
  battery_level?: number | null;
}

export interface CreateFeedbackInput {
  customer_id: string;
  driver_id: string;
  rating?: number;
  comment?: string | null;
}

// Update types (all fields optional except ID)
export interface UpdateDriverInput {
  driver_id: string;
  first_name?: string;
  last_name?: string | null;
  email?: string;
  hashed_password?: string;
  phone_number?: string;
  address?: string | null;
  start_location?: string | null;
  refresh_token?: string | null;
}

export interface UpdateVehicleInput {
  vehicle_id: string;
  driver_id?: string;
  type?: VehicleType;
  company?: string;
  model?: string;
  year?: number;
  color?: string;
  license_plate?: string;
}

export interface UpdateCustomerInput {
  customer_id: string;
  first_name?: string;
  last_name?: string | null;
  email?: string;
  phone_number?: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface UpdateDeliveryInput {
  delivery_id: string;
  customer_id?: string;
  weight?: number;
  size?: string;
  delivery_instructions?: string | null;
  time_slot_id?: string;
  dropoff_location?: string;
  priority?: number;
  latitude?: number | null;
  longitude?: number | null;
  delivery_date?: Date;
}

// Utility types
export type DriverSelect = Partial<Driver>;
export type VehicleSelect = Partial<Vehicle>;
export type CustomerSelect = Partial<Customer>;
export type DeliverySelect = Partial<Delivery>;
export type TimeSlotSelect = Partial<TimeSlot>;
export type DeliveryQueueSelect = Partial<DeliveryQueue>;
export type OrderHistorySelect = Partial<OrderHistory>;
export type RouteSelect = Partial<Route>;
export type AssignmentSelect = Partial<Assignment>;
export type AdminSelect = Partial<Admin>;
export type DriverLocationSelect = Partial<DriverLocation>;
export type FeedbackSelect = Partial<Feedback>;

//this one is to get the drivers in the tracking page
export interface getAllDrivers extends Driver {
  vehicles: Vehicle[];
  driver_location: DriverLocation[];
  rating: number | null;
  completed_deliveries: number;
}

//this one is the response type for get tommorrow scheduled deliveries function which is in assign page basically
export interface DriverWithRatings extends DriverWithRelations {
  rating: number | null;
  completed_deliveries: number;
}
export interface AssignedDriver extends AssignmentWithRelations{
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

export interface ResponseData {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any | null; //for now we are just using any
}

//to get all the drivers data
export interface getDriversDataResponse extends ResponseData {
  data: getAllDrivers[];
}



interface OrderHistoryDeliveryDetails {
  dropoff_location: string;
  priority: number;
  weight?: number;
  size?: string;
  delivery_instructions?: string;
  delivery_date: string;
}

export interface OrderData {
  order_id?: string;
  queue_id?: string;
  delivery_id: string;
  status: "completed" | "ongoing" | "pending";
  delivery_status: string;
  delivery: OrderHistoryDeliveryDetails;
  customer: Customer;
  driver: DriverWithRelations;
  preferred_time: string;
  completed_time?: string;
  delivery_date?: string;
  queue_date?: string;
  delivery_duration?: number;
  delivery_distance?: number;
  position?: number;
}

// interface RouteWaypoint {
//   lat: number;
//   lng: number;
//   address: string;
//   delivery_id?: string;
// }

// interface RouteDelivery {
//   delivery_id: string;
//   sequence: number;
//   estimated_arrival: string;
//   travel_time_from_previous: number;
// }

// export interface RouteData extends Route {
//   Assignment?: Assignment[];
//   delivery: DeliveryWithRelations;
//   driver: DriverWithRelations;
//   route_details: {
//     driver_id: string;
//     driver_name: string;
//     deliveries: RouteDelivery[];
//     route_geometry: {
//       waypoints: RouteWaypoint[];
//       encoded_polyline?: string;
//       total_distance: number;
//       total_duration: number;
//     };
//     total_deliveries: number;
//     start_time: string;
//     estimated_end_time: string;
//   };
// }

export interface RouteResponse {
  delivery_id: string;
  sequence: number;
  estimated_arrival: string;
  travel_time_from_previous: number;
  latitude: number;
  longitude: number;
  waypoints: {
    lat: number;
    lng: number;
  }[];
  encoded_polyline: string | undefined;
  driver_id: string;
  driver_name: string;
  total_distance: number;
  total_duration: number;
  route_start_time: string;
  route_estimated_end_time: string;
  drop_location: string;
  time_slot: string;
  customer: {
    createdAt: Date;
    updatedAt: Date;
    customer_id: string;
    latitude: number;
    longitude: number;
    first_name: string;
    last_name: string | null;
    email: string;
    phone_number: string;
    address: string | null;
  };
  sequence_order: number;
}