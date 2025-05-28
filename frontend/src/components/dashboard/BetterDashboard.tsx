"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  Truck,
  Package,
  Clock,
  Users,
  Star,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  fetchtopDrivers,
  getDailyPerformance,
  getDashboardStats,
  getFleetStatus,
  getPeakHours,
  getRecentActivities,
  getStatusDistribution,
} from "@/lib/fetchDataService";


// Types
interface DashboardStats {
  activeDeliveries: number;
  pendingDeliveries: number;
  onRouteDeliveries: number;
  canceledDeliveries: number;
  availableDrivers: number;
  todayCompleted: number;
  totalRevenue?: number;
}

interface DailyPerformance {
  date: string;
  completed: number;
  failed: number;
  pending: number;
  day?: string;
}

interface DeliveryStatusDistribution {
  status: string;
  count: number;
  percentage: number;
  name?: string;
  value?: number;
  color?: string;
}

interface TopDriver {
  driver_id: string;
  name: string;
  deliveries: number;
  rating: number;
  status: "active" | "busy" | "offline";
  completionRate: number;
}

interface RecentActivity {
  id: string;
  type: "delivery" | "assignment" | "cancel" | "new" | "completed";
  message: string;
  driver_name?: string;
  customer_name?: string;
  delivery_id: string;
  timestamp: Date | string;
  status: string;
}

interface PeakHour {
  hour: number | string;
  deliveries: number;
  averageDeliveryTime?: number;
}

interface VehicleFleetStatus {
  type: string;
  total: number;
  active: number;
  utilization: number;
}

// Skeleton Loading Component
const SkeletonCard = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </CardContent>
  </Card>
);

// StatCard Component
interface StatCardProps {
  title: string;
  value: number | string;
  change?: string;
  icon: React.ElementType;
  color?: "blue" | "green" | "yellow" | "red";
  isLoading?: boolean;
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color = "blue",
  isLoading = false,
}: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    red: "bg-red-50 text-red-600 border-red-200",
  };

  if (isLoading) return <SkeletonCard />;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                {change.includes("+") ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <p
                  className={`text-sm ${
                    change.includes("+") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {change}
                </p>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ActivityItem Component
function ActivityItem({ activity }: { activity: RecentActivity }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "delivery":
        return <Truck className="text-blue-500" size={16} />;
      case "assignment":
        return <Users className="text-green-500" size={16} />;
      case "cancel":
        return <AlertCircle className="text-red-500" size={16} />;
      case "new":
        return <Package className="text-purple-500" size={16} />;
      case "completed":
        return <Star className="text-yellow-500" size={16} />;
      default:
        return <Package className="text-gray-500" size={16} />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      case "assigned":
        return "outline";
      case "cancelled":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const formatTimeAgo = (timestamp: Date | string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - activityTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="flex items-center space-x-3 py-3 border-b border-border last:border-b-0">
      <div className="flex-shrink-0">{getIcon(activity.type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{activity.message}</p>
        <p className="text-xs text-muted-foreground">
          {formatTimeAgo(activity.timestamp)}
        </p>
      </div>
      <Badge variant={getStatusVariant(activity.status)}>
        {activity.status.replace("_", " ")}
      </Badge>
    </div>
  );
}

// DriverRow Component
function DriverRow({ driver }: { driver: TopDriver }) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "busy":
        return "secondary";
      case "offline":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <tr className="hover:bg-muted/50">
      <td className="px-4 py-3 text-sm font-medium text-foreground">
        {driver.name}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {driver.deliveries}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Star className="text-yellow-400 mr-1" size={14} />
          {driver.rating.toFixed(1)}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {driver.completionRate}%
      </td>
      <td className="px-4 py-3">
        <Badge variant={getStatusVariant(driver.status)}>{driver.status}</Badge>
      </td>
    </tr>
  );
}

// Main Dashboard Component
export default function DeliveryDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [dailyPerformance, setDailyPerformance] = useState<DailyPerformance[]>(
    []
  );
  const [statusDistribution, setStatusDistribution] = useState<
    DeliveryStatusDistribution[]
  >([]);
  const [topDrivers, setTopDrivers] = useState<TopDriver[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [peakHours, setPeakHours] = useState<PeakHour[]>([]);
  const [fleetStatus, setFleetStatus] = useState<VehicleFleetStatus[]>([]);

  const fetchDashboardStats = useCallback(async () => {
    try {
      console.log("Fetching dashboard stats...");
      const response = await getDashboardStats();
      if (response.data.success) setDashboardStats(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to fetch dashboard statistics");
    }
  }, []);

  const fetchDailyPerformance = useCallback(async () => {
    try {
      console.log("Fetching daily performance for:", selectedTimeRange);
      // setDailyPerformance([]);
      const days =
        selectedTimeRange === "24h" ? 1 : selectedTimeRange === "7d" ? 7 : 30;
      const response = await getDailyPerformance(days);
      if (response.data.success) {
        const chartData = response.data.data.map((item: DailyPerformance) => ({
          ...item,
          day: new Date(item.date).toLocaleDateString("en-US", {
            weekday: "short",
          }),
        }));
        setDailyPerformance(chartData);
      }
    } catch (error) {
      console.error("Error fetching daily performance:", error);
      toast.error("Failed to fetch performance data");
    }
  }, [selectedTimeRange]);

  const fetchStatusDistribution = useCallback(async () => {
    try {
      console.log("Fetching delivery status distribution...");
      // setStatusDistribution([]);
      const response = await getStatusDistribution();
      if (response.data.success) {
        const pieData = response.data.data.map(
          (item: DeliveryStatusDistribution) => ({
            ...item,
            name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            value: item.count,
            color: getStatusColor(item.status),
          })
        );
        setStatusDistribution(pieData);
      }
    } catch (error) {
      console.error("Error fetching status distribution:", error);
      toast.error("Failed to fetch status distribution");
    }
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "#10B981",
      in_progress: "#3B82F6",
      pending: "#F59E0B",
      cancelled: "#EF4444",
      assigned: "#8B5CF6",
    };
    return colors[status] || "#6B7280";
  };

  const fetchTopDrivers = useCallback(async () => {
    try {
      console.log("Fetching top drivers...");
      // setTopDrivers([]);
      const response = await fetchtopDrivers();
      if (response.data.success) setTopDrivers(response.data.data);
    } catch (error) {
      console.error("Error fetching top drivers:", error);
      toast.error("Failed to fetch top drivers");
    }
  }, []);

  const fetchRecentActivity = useCallback(async () => {
    try {
      console.log("Fetching recent activity...");
      // setRecentActivity([]);
      const response = await getRecentActivities();
      if (response.data.success) setRecentActivity(response.data.data);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      toast.error("Failed to fetch recent activity");
    }
  }, []);

  const fetchPeakHours = useCallback(async () => {
    try {
      console.log("Fetching peak hours for:", selectedTimeRange);
      // setPeakHours([]);
      const days =
        selectedTimeRange === "24h" ? 1 : selectedTimeRange === "7d" ? 7 : 30;
      const response = await getPeakHours(days);
      if (response.data.success) {
        const chartData = response.data.data.map((item: PeakHour) => ({
          ...item,
          hour: `${item.hour}:00`,
        }));
        setPeakHours(chartData);
      }
    } catch (error) {
      console.error("Error fetching peak hours:", error);
      toast.error("Failed to fetch peak hours data");
    }
  }, [selectedTimeRange]);

  const fetchFleetStatus = useCallback(async () => {
    try {
      console.log("Fetching fleet status...");
      // setFleetStatus([]);
      const response = await getFleetStatus();
      if (response.data.success) setFleetStatus(response.data.data);
    } catch (error) {
      console.error("Error fetching fleet status:", error);
      toast.error("Failed to fetch fleet status");
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Fetching all dashboard data...");
      setDashboardStats(null);
      await Promise.all([
        fetchDashboardStats(),
        fetchDailyPerformance(),
        fetchStatusDistribution(),
        fetchTopDrivers(),
        fetchRecentActivity(),
        fetchPeakHours(),
        fetchFleetStatus(),
      ]);
      toast.success("Dashboard data loaded successfully");
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, [
    fetchDashboardStats,
    fetchDailyPerformance,
    fetchStatusDistribution,
    fetchTopDrivers,
    fetchRecentActivity,
    fetchPeakHours,
    fetchFleetStatus,
  ]);

  const handleRefresh = useCallback(async () => {
    console.log("Refreshing dashboard data...");
    if (isRefreshing) return;
    setIsRefreshing(true);
    await fetchAllData();
    setIsRefreshing(false);
  }, [fetchAllData, isRefreshing]);

  useEffect(() => {
    console.log("Loading initial dashboard data...");
    setIsLoading(true);
    fetchAllData();
  }, [fetchAllData]);

  // useEffect(() => {
  //   console.log("Time range changed, refetching data...");
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);
  //       setDailyPerformance([]);
  //       setPeakHours([]);
  //       const days =
  //         selectedTimeRange === "24h" ? 1 : selectedTimeRange === "7d" ? 7 : 30;
  //       const [dailyRes, peakRes] = await Promise.all([
  //         getDailyPerformance(days),
  //         getPeakHours(days),
  //       ]);
  //       if (dailyRes.data.success) {
  //         const chartData = dailyRes.data.data.map(
  //           (item: DailyPerformance) => ({
  //             ...item,
  //             day: new Date(item.date).toLocaleDateString("en-US", {
  //               weekday: "short",
  //             }),
  //           })
  //         );
  //         setDailyPerformance(chartData);
  //       }
  //       if (peakRes.data.success) {
  //         const chartData = peakRes.data.data.map((item: PeakHour) => ({
  //           ...item,
  //           hour: `${item.hour}:00`,
  //         }));
  //         setPeakHours(chartData);
  //       }
  //     } catch (error) {
  //       toast.error("Failed to fetch time-range-based data");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [selectedTimeRange]);
  
  

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Delivery Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Overview of your delivery operations
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select
              value={selectedTimeRange}
              onValueChange={setSelectedTimeRange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="default"
            >
              <RefreshCw
                size={16}
                className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Deliveries"
            value={dashboardStats?.activeDeliveries || 0}
            change="+2% from last month"
            icon={Package}
            color="blue"
            isLoading={isLoading}
          />
          <StatCard
            title="Pending"
            value={dashboardStats?.pendingDeliveries || 0}
            change="-5% from last month"
            icon={Clock}
            color="yellow"
            isLoading={isLoading}
          />
          <StatCard
            title="On Route"
            value={dashboardStats?.onRouteDeliveries || 0}
            change="+12% from last month"
            icon={Truck}
            color="green"
            isLoading={isLoading}
          />
          <StatCard
            title="Available Drivers"
            value={dashboardStats?.availableDrivers || 0}
            change="+3 from yesterday"
            icon={Users}
            color="blue"
            isLoading={isLoading}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Delivery Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] bg-muted rounded animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#10B981" name="Completed" />
                    <Bar dataKey="failed" fill="#EF4444" name="Failed" />
                    <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Delivery Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] bg-muted rounded animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Peak Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Delivery Hours</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[250px] bg-muted rounded animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={peakHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="deliveries"
                    stroke="#3B82F6"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bottom Row - Tables and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Drivers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-muted rounded animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Driver
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Deliveries
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Success Rate
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {topDrivers.map((driver, index) => (
                        <DriverRow
                          key={driver.driver_id || index}
                          driver={driver}
                        />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 bg-muted rounded animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  recentActivity.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Fleet Status */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-muted rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {fleetStatus.map((vehicle, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {vehicle.type}
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {vehicle.active}/{vehicle.total}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Active/Total ({vehicle.utilization}% utilization)
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-200">
                          <Truck className="text-blue-600" size={20} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
