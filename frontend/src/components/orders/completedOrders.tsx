import { cn } from "@/lib/utils";
import { User, Car, Eye } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Customer,  DriverWithRelations, OrderData } from "@/lib/types";
import { Badge } from "../ui/badge";
import { formatDate, getStatusColor } from "@/lib/utils";
interface completedOrderProps {
  loading: boolean;
  completedOrders: OrderData[];
  setSelectedCustomer: (customer: Customer) => void;
  setSelectedDriver: (driver: DriverWithRelations) => void;
}
const CompletedOrders = ({
  loading,
  completedOrders,
  setSelectedCustomer,
  setSelectedDriver,
}: completedOrderProps) => {
  return (
    <Table className="overflow-x-scroll">
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Driver</TableHead>
          <TableHead>Delivery Location</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Completed Date</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          [...Array(5)].map((_, i) => (
            <TableRow key={i}>
              {[...Array(8)].map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
              <TableCell className="text-right">
                <Skeleton className="h-4 w-8 ml-auto" />
              </TableCell>
            </TableRow>
          ))
        ) : completedOrders.length > 0 ? (
          completedOrders.map((order) => (
            <TableRow key={order.order_id}>
              <TableCell>{order.order_id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span
                    className="cursor-pointer hover:underline"
                    onClick={() => setSelectedCustomer(order.customer)}
                  >
                    {order.customer.first_name} {order.customer.last_name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span
                    className="cursor-pointer hover:underline"
                    onClick={() => setSelectedDriver(order.driver)}
                  >
                    {order.driver.first_name} {order.driver.last_name}
                  </span>
                </div>
              </TableCell>
              <TableCell>{order.delivery.dropoff_location}</TableCell>
              <TableCell>{getPriorityBadge(order.delivery.priority)}</TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    "text-xs",
                    getStatusColor(order.status, order.delivery_status)
                  )}
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDate(
                  order.completed_time
                )}
              </TableCell>
              <TableCell>
                {order.delivery_duration
                  ? `${order.delivery_duration} mins`
                  : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-6">
              No Completed orders yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export const getPriorityBadge = (priority: number) => {
  switch (priority) {
    case 2:
      return (
        <Badge variant="destructive" className="text-xs">
          High
        </Badge>
      );
    case 1:
      return (
        <Badge
          variant="secondary"
          className="text-xs bg-orange-100 text-orange-800"
        >
          Medium
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs">
          Low
        </Badge>
      );
  }
};

export default CompletedOrders;
