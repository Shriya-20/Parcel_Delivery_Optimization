// "use client";
// import { useState, useEffect } from "react";
// import { Search } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { mockParcels } from "@/lib/mock-data";
// import { MapView } from "./Mapview";
// import Image from "next/image";
// import { getDriversData } from "@/lib/fetchDataService";
// import { getAllDrivers } from "@/lib/types";
// import io from "socket.io-client";

// const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL as string);

// Mock drivers data (in a real application, this would come from an API)
// const mockDrivers = [
//   {
//     id: "d1",
//     name: "Keerthan Kumar C",
//     status: "active",
//     location: { lat: 13.346573, lng: 74.794143 },
//     vehicle: "van",
//     currentDelivery: "P-4398",
//     avatar: "/placeholder.svg",
//     rating: 4.8,
//     deliveriesCompleted: 342,
//     phone: "+1 (555) 123-4567",
//   },
//   {
//     id: "d2",
//     name: "Shriya Bhat",
//     status: "active",
//     location: { lat: 13.369604, lng: 74.805201 },
//     vehicle: "truck",
//     currentDelivery: "P-8721",
//     avatar: "/placeholder.svg",
//     rating: 4.9,
//     deliveriesCompleted: 512,
//     phone: "+1 (555) 234-5678",
//   },
//   {
//     id: "d3",
//     name: "Bhanu Shashank",
//     status: "inactive",
//     location: { lat: 13.301463, lng: 74.735969 },
//     vehicle: "car",
//     currentDelivery: null,
//     avatar: "/placeholder.svg",
//     rating: 4.6,
//     deliveriesCompleted: 198,
//     phone: "+1 (555) 345-6789",
//   },
//   {
//     id: "d4",
//     name: "Santhosh",
//     status: "break",
//     location: { lat: 13.549314, lng: 74.702506 },
//     vehicle: "minivan",
//     currentDelivery: "P-2341",
//     avatar: "/placeholder.svg",
//     rating: 4.7,
//     deliveriesCompleted: 287,
//     phone: "+1 (555) 456-7890",
//   },
// ];
// type Driver = {
//   id: string;
//   name: string;
//   status: string;
//   location: { lat: number; lng: number };
//   vehicle: string;
//   currentDelivery: string | null;
//   avatar: string;
//   rating: number;
//   deliveriesCompleted: number;
//   phone: string;
// };

// export function Tracking() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [driversData, setDriversData] = useState<getAllDrivers[] | null>(null);

//   const fetchDrivers = async () => {
//     const drivers = await getDriversData();
//   };
//   useEffect(() => {
//     fetchDrivers();
//   }, []);
//   // Filter drivers based on search query
//   const filteredDrivers = searchQuery
//     ? mockDrivers.filter(
//         (driver) =>
//           driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           driver.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           driver.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : mockDrivers;

//   const activeDrivers = filteredDrivers.filter((d) => d.status === "active");
//   const inactiveDrivers = filteredDrivers.filter(
//     (d) => d.status === "inactive" || d.status === "break"
//   );

//   //for now we are just updating mock data else we load the data from api and maintain state and then we update that state
//   useEffect(()=>{
//     socket.on("location_update", (data) => {
//       console.log(data);
//       const updatedDriver = mockDrivers.find((driver) => driver.id === data.driverId);
//       if (updatedDriver) {
//         updatedDriver.location = {
//           lat: data.latitude,
//           lng: data.longitude,
//         };
//       }
//       filteredDrivers.forEach((driver) => {
//         if (driver.id === data.driverId) {
//           driver.location = {
//             lat: data.latitude,
//             lng: data.longitude,
//           };
//         }
//       });
//     });
//   },[filteredDrivers]);

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex flex-col  gap-2">
//           <h1 className="text-2xl font-bold tracking-tight">Driver Tracking</h1>
//           <p className="text-sm muted-foreground">
//             Track your drivers in <span className="font-bold">real-time</span>{" "}
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="relative w-64">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder="Search drivers..."
//               className="pl-8"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
//         <div className="md:col-span-2 overflow-auto">
//           <Tabs defaultValue="all">
//             <TabsList className="mb-4">
//               <TabsTrigger value="all">
//                 All {filteredDrivers.length}
//               </TabsTrigger>
//               <TabsTrigger value="active">
//                 Active {activeDrivers.length}
//               </TabsTrigger>
//               <TabsTrigger value="inactive">
//                 Inactive {inactiveDrivers.length}
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="all" className="space-y-4 mr-3">
//               {filteredDrivers.map((driver) => (
//                 <DriverCard key={driver.id} driver={driver} />
//               ))}
//             </TabsContent>

//             <TabsContent value="active" className="space-y-4 mr-3">
//               {activeDrivers.map((driver) => (
//                 <DriverCard key={driver.id} driver={driver} />
//               ))}
//             </TabsContent>

//             <TabsContent value="inactive" className="space-y-4 mr-3">
//               {inactiveDrivers.map((driver) => (
//                 <DriverCard key={driver.id} driver={driver} />
//               ))}
//             </TabsContent>
//           </Tabs>
//         </div>

//         <div className="md:col-span-3 bg-muted/30 rounded-lg overflow-hidden">
//           <MapView drivers={filteredDrivers} />
//         </div>
//       </div>
//     </div>
//   );
// }

// function DriverCard({ driver }: { driver: Driver }) {
//   return (
//     <Card className="p-4">
//       <div className="flex items-center gap-3">
//         <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
//           <Image
//             src={driver.avatar}
//             alt={driver.name}
//             className="h-full w-full object-cover"
//             width={48}
//             height={48}
//           />
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between">
//             <h3 className="font-medium">{driver.name}</h3>
//             <div
//               className={`px-2 py-1 text-xs rounded-full ${
//                 driver.status === "active"
//                   ? "bg-green-100 text-green-800"
//                   : driver.status === "break"
//                   ? "bg-yellow-100 text-yellow-800"
//                   : "bg-gray-100 text-gray-800"
//               }`}
//             >
//               {driver.status === "active"
//                 ? "Active"
//                 : driver.status === "break"
//                 ? "On Break"
//                 : "Inactive"}
//             </div>
//           </div>
//           <div className="text-sm text-muted-foreground">
//             Vehicle: {driver.vehicle}
//           </div>
//           <div className="text-sm text-muted-foreground">
//             Current Delivery: {driver.currentDelivery || "None"}
//           </div>
//           <div className="mt-2 flex items-center text-sm">
//             <div className="flex items-center">
//               <span className="text-amber-500 mr-1">★</span>
//               <span>{driver.rating}</span>
//             </div>
//             <span className="mx-2">•</span>
//             <span>{driver.deliveriesCompleted} deliveries</span>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }

"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapView } from "./Mapview";
import Image from "next/image";
import { getDriversData } from "@/lib/fetchDataService";
import { getAllDrivers } from "@/lib/types";
import { toast } from "sonner";

// Define the driver status type
export type DriverStatus = "active" | "inactive" | "break" | "offline";

// Enhanced driver type that combines your DB data with UI requirements
// export interface EnhancedDriver extends getAllDrivers {
//   status: DriverStatus;
//   location: { lat: number; lng: number };
//   vehicle_info?: {
//     type: string;
//     model: string;
//     color: string;
//   };
//   current_delivery?: string | null;
//   avatar?: string;
// }

export function Tracking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [driversData, setDriversData] = useState<getAllDrivers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Transform raw driver data to enhanced driver format
  // const transformDriverData = (
  //   rawDrivers: getAllDrivers[]
  // ): EnhancedDriver[] => {
  //   return rawDrivers.map((driver) => ({
  //     ...driver,
  //     status: "active" as DriverStatus, // You'll need to determine this based on your business logic
  //     location: {
  //       lat: driver.driver_location?.[0]?.latitude || 0,
  //       lng: driver.driver_location?.[0]?.longitude || 0,
  //     },
  //     vehicle_info: driver.vehicles?.[0]
  //       ? {
  //           type: driver.vehicles[0].type,
  //           model: driver.vehicles[0].model,
  //           color: driver.vehicles[0].color,
  //         }
  //       : undefined,
  //     current_delivery: driver.DeliveryQueue?.[0]?.delivery_id || null,
  //     avatar: "/placeholder.svg", // Default avatar
  //     rating:
  //       driver.feedback?.length > 0
  //         ? driver.feedback.reduce((sum, f) => sum + f.rating, 0) /
  //           driver.feedback.length
  //         : 0,
  //     deliveries_completed: driver.OrderHistory?.length || 0,
  //   }));
  // };

  const fetchDrivers = useCallback(async (showToast = true) => {
    try {
      setError(null);
      const drivers = await getDriversData();

      if (drivers && drivers.length > 0) {
        setDriversData(drivers);

        if (showToast) {
          toast.success(
            `Loaded ${drivers.length} drivers successfully`
          );
        }
      } else {
        setDriversData([]);
        if (showToast) {
          toast.info("No drivers found");
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch drivers";
      setError(errorMessage);
      toast.error(`Error loading drivers: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDrivers(true);
  };

  useEffect(() => {
    fetchDrivers(true);
  }, [fetchDrivers]);

  // Filter drivers based on search query
  const filteredDrivers = searchQuery
    ? driversData.filter(
        (driver) =>
          `${driver.first_name} ${driver.last_name || ""}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          driver.driver_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.vehicles?.[0]?.type
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : driversData;

  // const activeDrivers = filteredDrivers.filter((d) => d. === "active");
  // const inactiveDrivers = filteredDrivers.filter(
  //   (d) =>
  //     d.status === "inactive" || d.status === "break" || d.status === "offline"
  // );

  // Loading skeleton component
  const DriverSkeleton = () => (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-28" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    </Card>
  );

  // Error state
  if (error && !isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Driver Tracking
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your drivers in <span className="font-bold">real-time</span>
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <h3 className="text-lg font-semibold mb-2">
              Unable to load drivers
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => fetchDrivers(true)} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                "Try Again"
              )}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Driver Tracking</h1>
          <p className="text-sm text-muted-foreground">
            Track your drivers in <span className="font-bold">real-time</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search drivers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
        <div className="md:col-span-2 overflow-auto">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All {isLoading ? "..." : filteredDrivers.length}
              </TabsTrigger>
              {/* <TabsTrigger value="active">
                Active {isLoading ? "..." : activeDrivers.length}
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive {isLoading ? "..." : inactiveDrivers.length}
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value="all" className="space-y-4 mr-3">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <DriverSkeleton key={i} />
                ))
              ) : filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver) => (
                  <DriverCard key={driver.driver_id} driver={driver} />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  {searchQuery
                    ? "No drivers match your search"
                    : "No drivers available"}
                </div>
              )}
            </TabsContent>

            {/* <TabsContent value="active" className="space-y-4 mr-3">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <DriverSkeleton key={i} />
                ))
              ) : activeDrivers.length > 0 ? (
                activeDrivers.map((driver) => (
                  <DriverCard key={driver.driver_id} driver={driver} />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No active drivers
                </div>
              )}
            </TabsContent>

            <TabsContent value="inactive" className="space-y-4 mr-3">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <DriverSkeleton key={i} />
                ))
              ) : inactiveDrivers.length > 0 ? (
                inactiveDrivers.map((driver) => (
                  <DriverCard key={driver.driver_id} driver={driver} />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No inactive drivers
                </div>
              )}
            </TabsContent>*/}
          </Tabs>
        </div>

        <div className="md:col-span-3 bg-muted/30 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <MapView drivers={filteredDrivers} />
          )}
        </div>
      </div>
    </div>
  );
}

function DriverCard({ driver }: { driver: getAllDrivers }) {
  const fullName = `${driver.first_name} ${driver.last_name || ""}`.trim();
  // console.log(driver.vehicles);
  const vehicleDisplay = driver.vehicles?.[0]
    ? `${driver.vehicles[0]?.type} - ${driver.vehicles[0]?.model}`
    : "No vehicle assigned";
  // console.log(vehicleDisplay)
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
          <Image
            src={"/placeholder.svg"}//no aavatar for now
            alt={fullName}
            className="h-full w-full object-cover"
            width={48}
            height={48}
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{fullName}</h3>
            {/* <div
              className={`px-2 py-1 text-xs rounded-full ${
                driver.status === "active"
                  ? "bg-green-100 text-green-800"
                  : driver.status === "break"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {driver.status === "active"
                ? "Active"
                : driver.status === "break"
                ? "On Break"
                : driver.status === "offline"
                ? "Offline"
                : "Inactive"}
            </div> */}
          </div>
          <div className="text-sm text-muted-foreground">
            Vehicle: {vehicleDisplay}
          </div>
          <div className="text-sm text-muted-foreground">
            {/* Current Delivery: {driver.current_delivery || "None"} */}
            {/* no current delivery for now */}
            Current Delivery:{" "}
          </div>
          <div className="text-sm text-muted-foreground">
            Phone: {driver.phone_number}
          </div>
          <div className="mt-2 flex items-center text-sm">
            <div className="flex items-center">
              <span className="text-amber-500 mr-1">★</span>
              <span>{driver.rating?.toFixed(1) || "N/A"}</span>
            </div>
            <span className="mx-2">•</span>
            <span>{driver.completed_deliveries} deliveries</span>
          </div>
        </div>
      </div>
    </Card>
  );
}