import axios , { isAxiosError } from 'axios';
import { DeliveryQueryResponse } from '@/types';

// For React Native, you might need to use:
// import { BACKEND_URL } from '@env'; // if using react-native-dotenv
// or define it directly for now:
// const BACKEND_URL = "http://192.168.31.193:8000/api";
// const BACKEND_URL = "http://26.219.114.145:8000/api";
const BACKEND_URL = "http://192.168.30.246:8000/api";

export async function DashboardDataFetcher(driver_id: string, date: string) {
    try {
        // Better URL construction
        const url = `${BACKEND_URL}/drivers/${driver_id}/deliveries`;
        // console.log(url);
        const response = await axios.get(url, {
            params: { date },
            timeout: 10000, // 10 second timeout
        });
        
        const responseData: DeliveryQueryResponse = response.data;
        
        // Check if response structure is valid
        if (!responseData) {
            throw new Error("Invalid response from server");
        }
        
        if (responseData.data === null) {
            throw new Error(
                responseData.message || "No deliveries found for the given date"
            );
        }
        
        if (responseData.success) {
            return responseData.data;
        }
        
        throw new Error(responseData.message || "Failed to fetch deliveries");
        
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        
        // Provide more specific error messages
        if (isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error("Request timed out. Please check your connection.");
            }
            if (error.response?.status === 404) {
                throw new Error("Driver not found or invalid date.");
            }
            if (error.response && typeof error.response.status === 'number' && error.response.status >= 500) {
                throw new Error("Server error. Please try again later.");
            }
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
        }
        
        throw error;
    }
}

export async function DeliveryDetailsFetcher(driver_id: string, delivery_id: string, date: string) {
    try {
        const url = `${BACKEND_URL}/drivers/${driver_id}/deliveries/${delivery_id}`;
        const response = await axios.get(url, {
            params: { date },
            timeout: 10000, // 10 second timeout
        });
        
        const responseData: DeliveryQueryResponse = response.data;
        
        if (!responseData) {
            throw new Error("Invalid response from server");
        }
        
        if (responseData.data === null) {
            throw new Error(
                responseData.message || "Delivery details not found"
            );
        }
        
        if (responseData.success) {
            return responseData.data;
        }
        
        throw new Error(responseData.message || "Failed to fetch delivery details");
        
    } catch (error) {
        console.error("Error fetching delivery details:", error);
        
        if (isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error("Request timed out. Please check your connection.");
            }
            if (error.response?.status === 404) {
                throw new Error("Delivery not found.");
            }
            if (error.response && typeof error.response.status === 'number' && error.response.status >= 500) {
                throw new Error("Server error. Please try again later.");
            }
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
        }
        
        throw error;
    }
}