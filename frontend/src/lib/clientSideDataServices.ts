// lib/fetchDataService.ts
// Remove any "use server" directive from this file
import axios from "axios";
import { getAllDrivers, getTommorrowScheduledDeliveries, OrderData, ResponseData } from "./types";

const backendURL = process.env.NEXT_PUBLIC_API_URL as string; 

export async function getRouteByDriverIdAndDate(
  driver_id: string,
  date: string
) {
  try {
    console.log(
      "Making API call to:",
      `${backendURL}/routes/route/${driver_id}/${date}`
    );

    const res = await axios.get(
      `${backendURL}/routes/route/${driver_id}/${date}`,
      {
        timeout: 10000, // 10 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response:", res.data);
    return res;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
interface OrderHistoryResponse extends ResponseData {
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

export async function getDashboardStats() {
  const res = await axios.get(`${backendURL}/dashboard/stats`);
  return res;
}
export async function getDailyPerformance(days: number) {
  const res = await axios.get(
    `${backendURL}/dashboard/performance?days=${days}`
  );
  return res;
}

export async function getStatusDistribution() {
  const res = await axios.get(`${backendURL}/dashboard/status-distribution`);
  return res;
}

export async function fetchtopDrivers() {
  const res = await axios.get(`${backendURL}/dashboard/drivers/top?limit=5`);
  return res;
}

export async function getRecentActivities() {
  const res = await axios.get(`${backendURL}/dashboard/activity?limit=10`);
  return res;
}

export async function getPeakHours(days: number) {
  const res = await axios.get(
    `${backendURL}/dashboard/peak-hours?days=${days}`
  );
  return res;
}

export async function getFleetStatus() {
  const res = await axios.get(`${backendURL}/dashboard/fleet-status`);
  return res;
}

export async function assignBulkRoutes(
  deliveries: getTommorrowScheduledDeliveries[],
  date: string
) {
  const res = await axios.post(`${backendURL}/routes/assignbulk`, {
    deliveries,
    date,
  });
  return res;
}


export interface getDriversDataResponse extends ResponseData {
  data: getAllDrivers[];
}
export interface getTomorrowScheduledDeliveriesResponse extends ResponseData {
  data: getTommorrowScheduledDeliveries[];
}
export async function getDriversData() {
  const res = await axios.get(`${backendURL}/drivers`);
  const data: getDriversDataResponse = res.data;
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message);
}

export async function getTomorrowScheduledDeliveries() {
  // const tomorrow = new Date();
  // tomorrow.setDate(tomorrow.getDate() + 1);
  // const formattedDate = tomorrow.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  //for now we will use today's date
  // const formattedDate = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  const formattedDate = "2025-05-26";
  const res = await axios.get(`${backendURL}/delivery?date=${formattedDate}`);
  const data: getTomorrowScheduledDeliveriesResponse = res.data;
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message);
}