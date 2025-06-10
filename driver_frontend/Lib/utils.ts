export const getPriorityInfo = (priority: number) => {
  if (priority >= 7) return { level: "high", label: "High Priority" };
  if (priority >= 4) return { level: "medium", label: "Medium Priority" };
  return { level: "low", label: "Low Priority" };
};

export const formatTime = (time: string | Date) => {
  const date = typeof time === "string" ? new Date(time) : time;
  if (isNaN(date.getTime())) return "Invalid time";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const getStatusClasses = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100";
    case "in_progress":
    case "in-progress":
      return "bg-blue-100";
    case "completed":
      return "bg-green-100";
    case "cancelled":
    case "canceled":
      return "bg-red-100";
    case "delayed":
      return "bg-orange-100";
    default:
      return "bg-gray-100";
  }
};

export const getStatusTextClasses = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "text-yellow-800";
    case "in_progress":
    case "in-progress":
      return "text-blue-800";
    case "completed":
      return "text-green-800";
    case "cancelled":
    case "canceled":
      return "text-red-800";
    case "delayed":
      return "text-orange-800";
    default:
      return "text-gray-800";
  }
};

export const getStatusLabel = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "Pending";
    case "in_progress":
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "cancelled":
    case "canceled":
      return "Cancelled";
    case "delayed":
      return "Delayed";
    default:
      return "Unknown";
  }
};
