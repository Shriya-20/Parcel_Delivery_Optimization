"use client";

import { useRouter } from "next/navigation";
import { Package, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type RecentDelivery = {
  id: string;
  address: string;
  time: string;
  status: "completed" | "in-progress" | "pending";
};

const recentDeliveries: RecentDelivery[] = [
  {
    id: "DEL-1234",
    address: "123 Main St, Apt 4B",
    time: "10:30 AM",
    status: "in-progress",
  },
  {
    id: "DEL-1235",
    address: "456 Oak Ave",
    time: "11:15 AM",
    status: "pending",
  },
  {
    id: "DEL-1233",
    address: "987 Elm St",
    time: "9:15 AM",
    status: "completed",
  },
];

const statusColors = {
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "in-progress":
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export function RecentDeliveries() {
  const router = useRouter();

  return (
    <div className="space-y-3">
      {recentDeliveries.map((delivery) => (
        <div
          key={delivery.id}
          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
          onClick={() => router.push(`/dashboard/active/${delivery.id}`)}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              {delivery.status === "completed" ? (
                <CheckCircle className="h-5 w-5 text-primary" />
              ) : (
                <Package className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <div className="font-medium">{delivery.address}</div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {delivery.time}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={statusColors[delivery.status]}>
              {delivery.status === "completed"
                ? "Completed"
                : delivery.status === "in-progress"
                ? "In Progress"
                : "Pending"}
            </Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      ))}
    </div>
  );
}
