"use server"
import axios from 'axios';
import { getAllDrivers, getTommorrowScheduledDeliveries, ResponseData } from './types';

const backendURL = process.env.NEXT_PUBLIC_API_URL as string; 

export interface getDriversDataResponse extends ResponseData{
    data: getAllDrivers[]
}
export interface getTomorrowScheduledDeliveriesResponse extends ResponseData {
  data: getTommorrowScheduledDeliveries[];
}
export async function getDriversData(){
    const res = await axios.get(`${backendURL}/drivers`);
    const data: getDriversDataResponse = res.data;
    if(data.success){
        return data.data;
    }
    throw new Error(data.message);
}

export async function getTomorrowScheduledDeliveries() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    const res = await axios.get(`${backendURL}/delivery?date=${formattedDate}`);
    const data: getTomorrowScheduledDeliveriesResponse = res.data;
    if (data.success) {
        return data.data;
    }
    throw new Error(data.message);
}
interface Customer {
  customer_id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone_number: string;
  address?: string;
}

interface Vehicle {
  type: string;
  company: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
}

interface Driver {
  driver_id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone_number: string;
  vehicles: Vehicle[];
}

interface DeliveryDetails {
  dropoff_location: string;
  priority: number;
  weight?: number;
  size?: string;
  delivery_instructions?: string;
  delivery_date: string;
}
interface OrderData {
  order_id?: string;
  queue_id?: string;
  delivery_id: string;
  status: "completed" | "ongoing" | "pending";
  delivery_status: string;
  delivery: DeliveryDetails;
  customer: Customer;
  driver: Driver;
  preferred_time: string;
  completed_time?: string;
  delivery_date?: string;
  queue_date?: string;
  delivery_duration?: number;
  delivery_distance?: number;
  position?: number;
}
interface OrderHistoryResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    data: {
      completed: OrderData[];
      ongoing: OrderData[];
      pending: OrderData[];
      summary: {
        total_completed: number;
        total_ongoing: number;
        total_pending: number;
        total_orders: number;
      };
    };
  };
}
export async function getOrderHistory() {
    const res = await axios.get(`${backendURL}/delivery/orderhistory`);
    const data: OrderHistoryResponse = res.data;
    console.log("Order History Data:", data);
    if (data.success) {
        return data.data;
    }
    throw new Error(data.message);
}