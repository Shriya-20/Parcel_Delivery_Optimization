import { MapPin, Clock, CheckCircle, MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type RouteStop = {
  id: string
  address: string
  time: string
  status: "completed" | "in-progress" | "pending"
  isActive: boolean
}

const routeStops: RouteStop[] = [
  {
    id: "DEL-1233",
    address: "987 Elm St",
    time: "9:15 AM",
    status: "completed",
    isActive: false,
  },
  {
    id: "DEL-1234",
    address: "123 Main St, Apt 4B",
    time: "10:30 AM",
    status: "in-progress",
    isActive: true,
  },
  {
    id: "DEL-1235",
    address: "456 Oak Ave",
    time: "11:15 AM",
    status: "pending",
    isActive: false,
  },
  {
    id: "DEL-1236",
    address: "789 Pine Blvd, Suite 3",
    time: "12:00 PM",
    status: "pending",
    isActive: false,
  },
  {
    id: "DEL-1237",
    address: "321 Cedar Ln",
    time: "1:30 PM",
    status: "pending",
    isActive: false,
  },
  {
    id: "DEL-1238",
    address: "654 Maple Dr",
    time: "2:45 PM",
    status: "pending",
    isActive: false,
  },
  {
    id: "DEL-1239",
    address: "852 Birch Ct",
    time: "3:30 PM",
    status: "pending",
    isActive: false,
  },
  {
    id: "DEL-1240",
    address: "159 Walnut Way",
    time: "4:15 PM",
    status: "pending",
    isActive: false,
  },
]

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export function RouteList() {
  return (
    <div className="space-y-3">
      {routeStops.map((stop) => (
        <div
          key={stop.id}
          className={`p-3 rounded-lg border ${stop.isActive ? "border-primary bg-primary/5" : "border-border"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${stop.isActive ? "bg-primary/20" : "bg-muted"}`}>
                {stop.status === "completed" ? (
                  <CheckCircle className={`h-5 w-5 ${stop.isActive ? "text-primary" : "text-muted-foreground"}`} />
                ) : (
                  <MapPin className={`h-5 w-5 ${stop.isActive ? "text-primary" : "text-muted-foreground"}`} />
                )}
              </div>
              <div>
                <div className="font-medium">{stop.address}</div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {stop.time}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={statusColors[stop.status]}>
                {stop.status === "completed" ? "Completed" : stop.status === "in-progress" ? "In Progress" : "Pending"}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href={`/active/${stop.id}`} className="w-full">
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Skip Delivery</DropdownMenuItem>
                  <DropdownMenuItem>Report Issue</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
