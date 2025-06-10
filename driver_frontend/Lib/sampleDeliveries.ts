import { Customer, Delivery } from "@/types";

export const deliveries: Delivery[] = [
  {
    id: "DEL-1234",
    address: "C-32(B) MIT Quaterse,Manipal, Udupi, Karnataka",
    time: "10:30 AM",
    priority: "high",
    status: "in-progress",
    weight: 2.5,
    size: "medium",
    deliveryType: "Express",
    specialInstructions: "Leave at the front door",
  },
  {
    id: "DEL-1235",
    address: "Parkala, Udupi, Karnataka",
    time: "11:15 AM",
    priority: "medium",
    status: "pending",
    weight: 2.5,
    size: "medium",
    deliveryType: "Standard",
    specialInstructions: "Leave at the front door",
  },
  {
    id: "DEL-1236",
    address: "Malpe Beach, Udupi, Karnataka",
    time: "12:00 PM",
    priority: "medium",
    status: "pending",
    weight: 2.5,
    size: "medium",
    deliveryType: "Express",
    specialInstructions: "Leave at the front door",
  },
];

export const customers: Customer[] = [
  {
    id: "CUST-5678",
    name: "John Doe",
    address: "123 Main St, Apt 4B",
    phoneNumber: "123-456-7890",
    email: "d6EYB@example.com",
    deliveryInstructions: "Please ring the bell",
  },
  {
    id: "CUST-5679",
    name: "Jane Smith",
    address: "456 Oak Ave, Apt 2A",
    phoneNumber: "987-654-3210",
    email: "VW0V9@example.com",
    deliveryInstructions: "No special instructions",
  },
  {
    id: "CUST-5680",
    name: "Alice Johnson",
    address: "789 Pine Blvd, Suite 3",
    phoneNumber: "555-123-4567",
    email: "L2DxZ@example.com",
    deliveryInstructions: "Call before delivery",
  },
];
