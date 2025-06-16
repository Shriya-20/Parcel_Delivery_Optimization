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

// Utility functions to handle date formatting without timezone issues

export function formatDateForAPI(date: Date): string {
  // This ensures we get the local date without timezone conversion
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function createDateFromString(dateString: string): Date {
  // Create date from YYYY-MM-DD string without timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return formatDateForAPI(date) === formatDateForAPI(today);
}

export function isFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  return compareDate > today;
}

// Debug function to help identify timezone issues
export function debugDate(date: Date, label: string = 'Date'): void {
  console.log(`${label}:`, {
    original: date,
    toISOString: date.toISOString(),
    toLocaleDateString: date.toLocaleDateString(),
    formatDateForAPI: formatDateForAPI(date),
    getDate: date.getDate(),
    getMonth: date.getMonth(),
    getFullYear: date.getFullYear(),
    getTimezoneOffset: date.getTimezoneOffset()
  });
}

export function formatDateForFetching(date: Date): string {
  //format date to YYYY-MM-DD for API requests
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
