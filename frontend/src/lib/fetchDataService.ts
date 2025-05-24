
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