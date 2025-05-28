import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getStatusColor = (status: string, deliveryStatus: string) => {
  switch (status) {
    case "completed":
      return deliveryStatus === "on_time"
        ? "bg-green-100 text-green-800 hover:bg-green-200"
        : deliveryStatus === "late"
        ? "bg-red-100 text-red-800 hover:bg-red-200"
        : "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "ongoing":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "pending":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};



export const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};