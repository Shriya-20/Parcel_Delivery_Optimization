"use client";
import { useState, useCallback, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  User,
  Car,
  Package,
  Clock,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getOrderHistory } from "@/lib/fetchDataService";

// Types based on your API response
interface Customer {
  customer_id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone_number: string;
  address?: string;
}

interface Vehicle {
  type: string;
  company: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
}

interface Driver {
  driver_id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone_number: string;
  vehicles: Vehicle[];
}

interface DeliveryDetails {
  dropoff_location: string;
  priority: number;
  weight?: number;
  size?: string;
  delivery_instructions?: string;
  delivery_date: string;
}

interface OrderData {
  order_id?: string;
  queue_id?: string;
  delivery_id: string;
  status: "completed" | "ongoing" | "pending";
  delivery_status: string;
  delivery: DeliveryDetails;
  customer: Customer;
  driver: Driver;
  preferred_time: string;
  completed_time?: string;
  delivery_date?: string;
  queue_date?: string;
  delivery_duration?: number;
  delivery_distance?: number;
  position?: number;
}

interface OrderHistoryResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    data: {
      completed: OrderData[];
      ongoing: OrderData[];
      pending: OrderData[];
      summary: {
        total_completed: number;
        total_ongoing: number;
        total_pending: number;
        total_orders: number;
      };
    };
  };
}

export function Orders() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getOrderHistory();
      // const result: OrderHistoryResponse = await response.json();

      // if (!result.success || !result.data.success) {
      //   throw new Error(result.message || "Failed to fetch order history");
      // }

      // Combine all orders into a single array
      console.log("Fetched order history:", result.data);
      const allOrders = [
        ...result.completed,
        ...result.ongoing,
        ...result.pending,
      ];

      // Sort by most recent first
      allOrders.sort((a, b) => {
        const dateA = new Date(
          a.completed_time ||
            a.queue_date ||
            a.delivery_date ||
            a.delivery.delivery_date
        );
        const dateB = new Date(
          b.completed_time ||
            b.queue_date ||
            b.delivery_date ||
            b.delivery.delivery_date
        );
        return dateB.getTime() - dateA.getTime();
      });

      setOrders(allOrders);
    } catch (err) {
      console.error("Error fetching order history:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  useEffect(() => {
    let filtered = orders;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.delivery_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.first_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.customer.last_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.driver.first_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.driver.last_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.delivery.dropoff_location
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  const getStatusColor = (status: string, deliveryStatus: string) => {
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

  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 2:
        return (
          <Badge variant="destructive" className="text-xs">
            Urgent
          </Badge>
        );
      case 1:
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-orange-100 text-orange-800"
          >
            High
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Normal
          </Badge>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Orders
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchOrderHistory}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground">
            View and manage all orders across all statuses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("ongoing")}>
                Ongoing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === "completed").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === "ongoing").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {orders.filter((o) => o.status === "pending").length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Delivery Location</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
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
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.delivery_id}>
                  <TableCell>{order.delivery_id}</TableCell>
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
                  <TableCell>
                    {getPriorityBadge(order.delivery.priority)}
                  </TableCell>
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
                      order.completed_time ||
                        order.queue_date ||
                        order.delivery_date
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
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Customer Dialog */}
      <Dialog
        open={!!selectedCustomer}
        onOpenChange={() => setSelectedCustomer(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Info</DialogTitle>
            <DialogDescription>
              Details of the selected customer
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {selectedCustomer.first_name} {selectedCustomer.last_name}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {selectedCustomer.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {selectedCustomer.phone_number}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {selectedCustomer.address || "No address provided"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Driver Dialog */}
      <Dialog
        open={!!selectedDriver}
        onOpenChange={() => setSelectedDriver(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Driver Info</DialogTitle>
            <DialogDescription>
              Details of the selected driver
            </DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {selectedDriver.first_name} {selectedDriver.last_name}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {selectedDriver.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {selectedDriver.phone_number}
              </div>
              <div>
                <p className="font-medium">Vehicles:</p>
                {selectedDriver.vehicles.map((v, idx) => (
                  <div key={idx} className="ml-4 text-muted-foreground">
                    {v.year} {v.company} {v.model} ({v.license_plate})
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderRow({
  order,
  onViewCustomer,
  onViewDriver,
}: {
  order: OrderData;
  onViewCustomer: (customer: Customer) => void;
  onViewDriver: (driver: Driver) => void;
}) {
  const statusColor = getStatusColor(order.status, order.delivery_status);

  const getStatusText = (status: string, deliveryStatus: string) => {
    if (status === "completed") {
      switch (deliveryStatus) {
        case "on_time":
          return "Completed - On Time";
        case "late":
          return "Completed - Late";
        case "early":
          return "Completed - Early";
        case "not_delivered":
          return "Not Delivered";
        default:
          return "Completed";
      }
    }
    if (status === "ongoing") return "In Progress";
    if (status === "pending")
      return `Pending${order.position ? ` (#${order.position})` : ""}`;
    return status;
  };

  const getDate = () => {
    const date =
      order.completed_time ||
      order.queue_date ||
      order.delivery_date ||
      order.delivery.delivery_date;
    return formatDate(date);
  };

  const getDuration = () => {
    if (order.delivery_duration) {
      return `${order.delivery_duration} min`;
    }
    if (order.status === "ongoing" || order.status === "pending") {
      return "In progress";
    }
    return "N/A";
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {order.order_id || order.queue_id || order.delivery_id}
      </TableCell>
      <TableCell>
        <button
          onClick={() => onViewCustomer(order.customer)}
          className="text-left hover:text-blue-600 transition-colors"
        >
          <div className="font-medium">
            {order.customer.first_name} {order.customer.last_name}
          </div>
          <div className="text-xs text-gray-500">{order.customer.email}</div>
        </button>
      </TableCell>
      <TableCell>
        <button
          onClick={() => onViewDriver(order.driver)}
          className="text-left hover:text-blue-600 transition-colors"
        >
          <div className="font-medium">
            {order.driver.first_name} {order.driver.last_name}
          </div>
          <div className="text-xs text-gray-500">
            {order.driver.vehicles[0]?.license_plate || "No vehicle"}
          </div>
        </button>
      </TableCell>
      <TableCell className="max-w-[200px]">
        <div className="truncate" title={order.delivery.dropoff_location}>
          {order.delivery.dropoff_location}
        </div>
        <div className="text-xs text-gray-500">{order.preferred_time}</div>
      </TableCell>
      {/* <TableCell>{getPriorityBadge(order.delivery.priority)}</TableCell> */}
      <TableCell>
        <Badge className={cn("text-xs", statusColor)}>
          {getStatusText(order.status, order.delivery_status)}
        </Badge>
      </TableCell>
      <TableCell>{getDate()}</TableCell>
      <TableCell>{getDuration()}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function getStatusColor(status: string, deliveryStatus: string) {
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
}

function formatDate(dateString?: string) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
