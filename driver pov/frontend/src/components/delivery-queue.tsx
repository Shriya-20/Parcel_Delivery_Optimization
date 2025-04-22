import { Package, Clock, ChevronRight, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type Delivery = {
  id: string
  address: string
  time: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed"
}

const deliveries: Delivery[] = [
  {
    id: "DEL-1234",
    address: "123 Main St, Apt 4B",
    time: "10:30 AM",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "DEL-1235",
    address: "456 Oak Ave",
    time: "11:15 AM",
    priority: "medium",
    status: "pending",
  },
  {
    id: "DEL-1236",
    address: "789 Pine Blvd, Suite 3",
    time: "12:00 PM",
    priority: "medium",
    status: "pending",
  },
  {
    id: "DEL-1237",
    address: "321 Cedar Ln",
    time: "1:30 PM",
    priority: "low",
    status: "pending",
  },
  {
    id: "DEL-1238",
    address: "654 Maple Dr",
    time: "2:45 PM",
    priority: "low",
    status: "pending",
  },
]

const priorityColors = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
}

export function DeliveryQueue() {
  return (
    <div className="space-y-3">
      {deliveries.map((delivery) => (
        <Link
          href={`/dashboard/active/${delivery.id}`}
          key={delivery.id}
          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Package className="h-5 w-5 text-primary" />
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
            <Badge variant="outline" className={priorityColors[delivery.priority]}>
              {delivery.priority === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
              {delivery.priority.charAt(0).toUpperCase() + delivery.priority.slice(1)}
            </Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Link>
      ))}
    </div>
  )
}
