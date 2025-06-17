// // "use client";
// // import { useState, useEffect, useCallback } from "react";
// // import { Search, RefreshCw, Loader2, Wifi, WifiOff } from "lucide-react";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Card } from "@/components/ui/card";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import { Badge } from "@/components/ui/badge";
// // import { MapView } from "./Mapview";
// // import Image from "next/image";
// // import { getDriversData } from "@/lib/fetchDataService";
// // import { getAllDrivers } from "@/lib/types";
// // import { toast } from "sonner";
// // import { useDriverLocations } from "@/hooks/useDriverLocation";

// // // Define the driver status type
// // export type DriverStatus = "active" | "inactive" | "break" | "offline";

// // export function Tracking() {
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [initialDriversData, setInitialDriversData] = useState<getAllDrivers[]>(
// //     []
// //   );
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isRefreshing, setIsRefreshing] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   // Use the custom hook for WebSocket integration
// //   const {
// //     drivers: driversData,
// //     updateDrivers,
// //     isWebSocketConnected,
// //     connectionStatus,
// //   } = useDriverLocations(initialDriversData);

// //   const fetchDrivers = useCallback(
// //     async (showToast = true) => {
// //       try {
// //         setError(null);
// //         const drivers = await getDriversData();

// //         if (drivers && drivers.length > 0) {
// //           setInitialDriversData(drivers);
// //           updateDrivers(drivers);

// //           if (showToast) {
// //             toast.success(`Loaded ${drivers.length} drivers successfully`);
// //           }
// //         } else {
// //           setInitialDriversData([]);
// //           updateDrivers([]);
// //           if (showToast) {
// //             toast.info("No drivers found");
// //           }
// //         }
// //       } catch (err) {
// //         const errorMessage =
// //           err instanceof Error ? err.message : "Failed to fetch drivers";
// //         setError(errorMessage);
// //         toast.error(`Error loading drivers: ${errorMessage}`);
// //       } finally {
// //         setIsLoading(false);
// //         setIsRefreshing(false);
// //       }
// //     },
// //     [updateDrivers]
// //   );

// //   const handleRefresh = async () => {
// //     setIsRefreshing(true);
// //     await fetchDrivers(true);
// //   };

// //   useEffect(() => {
// //     fetchDrivers(true);
// //   }, [fetchDrivers]);

// //   // Filter drivers based on search query
// //   const filteredDrivers = searchQuery
// //     ? driversData.filter(
// //         (driver) =>
// //           `${driver.first_name} ${driver.last_name || ""}`
// //             .toLowerCase()
// //             .includes(searchQuery.toLowerCase()) ||
// //           driver.driver_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //           driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //           driver.vehicles?.[0]?.type
// //             .toLowerCase()
// //             .includes(searchQuery.toLowerCase())
// //       )
// //     : driversData;

// //   // Connection status badge
// //   const ConnectionStatusBadge = () => {
// //     const getStatusConfig = () => {
// //       switch (connectionStatus) {
// //         case "connected":
// //           return {
// //             icon: Wifi,
// //             text: "Live",
// //             variant: "default" as const,
// //             className: "bg-green-500",
// //           };
// //         case "connecting":
// //           return {
// //             icon: Loader2,
// //             text: "Connecting",
// //             variant: "secondary" as const,
// //             className: "bg-yellow-500",
// //           };
// //         case "error":
// //           return {
// //             icon: WifiOff,
// //             text: "Error",
// //             variant: "destructive" as const,
// //             className: "bg-red-500",
// //           };
// //         default:
// //           return {
// //             icon: WifiOff,
// //             text: "Offline",
// //             variant: "secondary" as const,
// //             className: "bg-gray-500",
// //           };
// //       }
// //     };

// //     const { icon: Icon, text, variant, className } = getStatusConfig();

// //     return (
// //       <Badge variant={variant} className={`${className} text-white`}>
// //         <Icon
// //           className={`h-3 w-3 mr-1 ${
// //             connectionStatus === "connecting" ? "animate-spin" : ""
// //           }`}
// //         />
// //         {text}
// //       </Badge>
// //     );
// //   };

// //   // Loading skeleton component
// //   const DriverSkeleton = () => (
// //     <Card className="p-4">
// //       <div className="flex items-center gap-3">
// //         <Skeleton className="h-12 w-12 rounded-full" />
// //         <div className="flex-1 space-y-2">
// //           <div className="flex justify-between">
// //             <Skeleton className="h-4 w-32" />
// //             <Skeleton className="h-6 w-16 rounded-full" />
// //           </div>
// //           <Skeleton className="h-3 w-24" />
// //           <Skeleton className="h-3 w-28" />
// //           <div className="flex items-center gap-2">
// //             <Skeleton className="h-3 w-12" />
// //             <Skeleton className="h-3 w-20" />
// //           </div>
// //         </div>
// //       </div>
// //     </Card>
// //   );

// //   // Error state
// //   if (error && !isLoading) {
// //     return (
// //       <div className="h-full flex flex-col">
// //         <div className="flex justify-between items-center mb-6">
// //           <div className="flex flex-col gap-2">
// //             <div className="flex items-center gap-3">
// //               <h1 className="text-2xl font-bold tracking-tight">
// //                 Driver Tracking
// //               </h1>
// //               <ConnectionStatusBadge />
// //             </div>
// //             <p className="text-sm text-muted-foreground">
// //               Track your drivers in <span className="font-bold">real-time</span>
// //             </p>
// //           </div>
// //         </div>

// //         <div className="flex-1 flex items-center justify-center">
// //           <Card className="p-8 text-center max-w-md">
// //             <h3 className="text-lg font-semibold mb-2">
// //               Unable to load drivers
// //             </h3>
// //             <p className="text-muted-foreground mb-4">{error}</p>
// //             <Button onClick={() => fetchDrivers(true)} disabled={isRefreshing}>
// //               {isRefreshing ? (
// //                 <>
// //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                   Retrying...
// //                 </>
// //               ) : (
// //                 "Try Again"
// //               )}
// //             </Button>
// //           </Card>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="h-full flex flex-col">
// //       <div className="flex justify-between items-center mb-6">
// //         <div className="flex flex-col gap-2">
// //           <div className="flex items-center gap-3">
// //             <h1 className="text-2xl font-bold tracking-tight">
// //               Driver Tracking
// //             </h1>
// //             <ConnectionStatusBadge />
// //           </div>
// //           <p className="text-sm text-muted-foreground">
// //             Track your drivers in <span className="font-bold">real-time</span>
// //             {isWebSocketConnected && (
// //               <span className="ml-2 text-green-600 font-medium">
// //                 • Live updates active
// //               </span>
// //             )}
// //           </p>
// //         </div>
// //         <div className="flex items-center gap-3">
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={handleRefresh}
// //             disabled={isRefreshing}
// //           >
// //             <RefreshCw
// //               className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
// //             />
// //             Refresh
// //           </Button>
// //           <div className="relative w-64">
// //             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
// //             <Input
// //               type="search"
// //               placeholder="Search drivers..."
// //               className="pl-8"
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
// //         <div className="md:col-span-2 overflow-auto">
// //           <Tabs defaultValue="all">
// //             <TabsList className="mb-4">
// //               <TabsTrigger value="all">
// //                 All {isLoading ? "..." : filteredDrivers.length}
// //               </TabsTrigger>
// //             </TabsList>

// //             <TabsContent value="all" className="space-y-4 mr-3">
// //               {isLoading ? (
// //                 Array.from({ length: 4 }).map((_, i) => (
// //                   <DriverSkeleton key={i} />
// //                 ))
// //               ) : filteredDrivers.length > 0 ? (
// //                 filteredDrivers.map((driver) => (
// //                   <DriverCard
// //                     key={driver.driver_id}
// //                     driver={driver}
// //                     isLiveUpdate={isWebSocketConnected}
// //                   />
// //                 ))
// //               ) : (
// //                 <div className="text-center text-muted-foreground py-8">
// //                   {searchQuery
// //                     ? "No drivers match your search"
// //                     : "No drivers available"}
// //                 </div>
// //               )}
// //             </TabsContent>
// //           </Tabs>
// //         </div>

// //         <div className="md:col-span-3 bg-muted/30 rounded-lg overflow-hidden">
// //           {isLoading ? (
// //             <div className="w-full h-full flex items-center justify-center">
// //               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
// //             </div>
// //           ) : (
// //             <MapView drivers={filteredDrivers} />
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function DriverCard({
// //   driver,
// //   isLiveUpdate,
// // }: {
// //   driver: getAllDrivers;
// //   isLiveUpdate: boolean;
// // }) {
// //   const fullName = `${driver.first_name} ${driver.last_name || ""}`.trim();
// //   const vehicleDisplay = driver.vehicles?.[0]
// //     ? `${driver.vehicles[0]?.type} - ${driver.vehicles[0]?.model}`
// //     : "No vehicle assigned";

// //   // Get last location update time
// //   const lastLocationUpdate = driver.driver_location?.[0]?.updatedAt;
// //   const lastUpdateTime = lastLocationUpdate
// //     ? new Date(lastLocationUpdate).toLocaleTimeString()
// //     : "N/A";

// //   // Check if location is recent (within last 5 minutes)
// //   const isLocationRecent = lastLocationUpdate
// //     ? Date.now() - new Date(lastLocationUpdate).getTime() < 5 * 60 * 1000
// //     : false;

// //   return (
// //     <Card className="p-4 hover:shadow-md transition-shadow">
// //       <div className="flex items-center gap-3">
// //         <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
// //           <Image
// //             src="/placeholder.svg"
// //             alt={fullName}
// //             className="h-full w-full object-cover"
// //             width={48}
// //             height={48}
// //           />
// //         </div>
// //         <div className="flex-1">
// //           <div className="flex justify-between items-start">
// //             <h3 className="font-medium">{fullName}</h3>
// //             <div className="flex items-center gap-2">
// //               {isLiveUpdate && isLocationRecent && (
// //                 <Badge
// //                   variant="outline"
// //                   className="text-xs bg-green-50 text-green-700 border-green-200"
// //                 >
// //                   <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
// //                   Live
// //                 </Badge>
// //               )}
// //             </div>
// //           </div>
// //           <div className="text-sm text-muted-foreground">
// //             Vehicle: {vehicleDisplay}
// //           </div>
// //           <div className="text-sm text-muted-foreground">
// //             Current Delivery: {/* Add your delivery logic here */}
// //           </div>
// //           <div className="text-sm text-muted-foreground">
// //             Phone: {driver.phone_number}
// //           </div>
// //           <div className="text-sm text-muted-foreground">
// //             Last update: {lastUpdateTime}
// //           </div>
// //           <div className="mt-2 flex items-center text-sm">
// //             <div className="flex items-center">
// //               <span className="text-amber-500 mr-1">★</span>
// //               <span>{driver.rating?.toFixed(1) || "N/A"}</span>
// //             </div>
// //             <span className="mx-2">•</span>
// //             <span>{driver.completed_deliveries} deliveries</span>
// //           </div>
// //         </div>
// //       </div>
// //     </Card>
// //   );
// // }
// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { Search, RefreshCw, Loader2, Wifi, WifiOff } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";
// import { MapView } from "./Mapview";
// import Image from "next/image";
// import { getDriversData } from "@/lib/fetchDataService";
// import { getAllDrivers } from "@/lib/types";
// import { toast } from "sonner";
// import { websocketService, LocationUpdate } from "@/lib/webSocketService";

// export function Tracking() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [driversData, setDriversData] = useState<getAllDrivers[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // WebSocket state
//   const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState<
//     "connecting" | "connected" | "disconnected" | "error"
//   >("disconnected");
//   const [webSocketInitialized, setWebSocketInitialized] = useState(false);

//   // Handle location updates from WebSocket
//   const handleLocationUpdate = useCallback((locationData: LocationUpdate) => {
//     console.log("Received location update:", locationData);

//     setDriversData((prevDrivers) => {
//       return prevDrivers.map((driver) => {
//         if (driver.driver_id === locationData.driverId) {
//           const updatedDriver = { ...driver };

//           // Update driver_location array
//           if (
//             updatedDriver.driver_location &&
//             updatedDriver.driver_location.length > 0
//           ) {
//             updatedDriver.driver_location = [
//               {
//                 ...updatedDriver.driver_location[0],
//                 latitude: locationData.latitude,
//                 longitude: locationData.longitude,
//                 // updated_at: locationData.timestamp || new Date().toISOString(),
//               },
//             ];
//           } else {
//             // Create new location if none exists
//             updatedDriver.driver_location = [
//               {
//                 // id: Date.now().toString(),
//                 driver_id: driver.driver_id,
//                 latitude: locationData.latitude,
//                 longitude: locationData.longitude,
//                 // updated_at: locationData.timestamp || new Date().toISOString(),
//                 // created_at: new Date().toISOString(),
//               },
//             ];
//           }

//           return updatedDriver;
//         }
//         return driver;
//       });
//     });
//   }, []);

//   // Initialize WebSocket connection
//   const initializeWebSocket = useCallback(() => {
//     if (webSocketInitialized) return;

//     setConnectionStatus("connecting");

//     try {
//       const socket = websocketService.connect();

//       if (socket) {
//         socket.on("connect", () => {
//           setIsWebSocketConnected(true);
//           setConnectionStatus("connected");
//           toast.success("Real-time tracking connected");
//         });

//         socket.on("disconnect", () => {
//           setIsWebSocketConnected(false);
//           setConnectionStatus("disconnected");
//           toast.warning("Real-time tracking disconnected");
//         });

//         socket.on("connect_error", () => {
//           setIsWebSocketConnected(false);
//           setConnectionStatus("error");
//           toast.error("Failed to connect to real-time tracking");
//         });

//         // Listen for location updates
//         websocketService.onLocationUpdate(handleLocationUpdate);
//         setWebSocketInitialized(true);
//       }
//     } catch (error) {
//       console.error("WebSocket connection error:", error);
//       setConnectionStatus("error");
//       toast.error("Failed to initialize real-time tracking");
//     }
//   }, [handleLocationUpdate, webSocketInitialized]);

//   // Fetch drivers from API
//   const fetchDrivers = useCallback(
//     async (showToast = true) => {
//       try {
//         setError(null);
//         const drivers = await getDriversData();

//         if (drivers && drivers.length > 0) {
//           // Step 1: Update drivers data
//           setDriversData(drivers);

//           // Step 2: Initialize WebSocket only after we have driver data
//           if (!webSocketInitialized) {
//             setTimeout(() => {
//               initializeWebSocket();
//             }, 500); // Small delay to ensure state is updated
//           }

//           if (showToast) {
//             toast.success(`Loaded ${drivers.length} drivers successfully`);
//           }
//         } else {
//           setDriversData([]);
//           if (showToast) {
//             toast.info("No drivers found");
//           }
//         }
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : "Failed to fetch drivers";
//         setError(errorMessage);
//         toast.error(`Error loading drivers: ${errorMessage}`);
//       } finally {
//         setIsLoading(false);
//         setIsRefreshing(false);
//       }
//     },
//     [initializeWebSocket, webSocketInitialized]
//   );

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     await fetchDrivers(true);
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchDrivers(true);
//   }, [fetchDrivers]);

//   // Cleanup WebSocket on unmount
//   useEffect(() => {
//     return () => {
//       websocketService.offLocationUpdate(handleLocationUpdate);
//       websocketService.disconnect();
//     };
//   }, [handleLocationUpdate]);

//   // Filter drivers based on search query
//   const filteredDrivers = searchQuery
//     ? driversData.filter(
//         (driver) =>
//           `${driver.first_name} ${driver.last_name || ""}`
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase()) ||
//           driver.driver_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           driver.vehicles?.[0]?.type
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase())
//       )
//     : driversData;

//   // Connection status badge
//   const ConnectionStatusBadge = () => {
//     const getStatusConfig = () => {
//       switch (connectionStatus) {
//         case "connected":
//           return {
//             icon: Wifi,
//             text: "Live",
//             variant: "default" as const,
//             className: "bg-green-500",
//           };
//         case "connecting":
//           return {
//             icon: Loader2,
//             text: "Connecting",
//             variant: "secondary" as const,
//             className: "bg-yellow-500",
//           };
//         case "error":
//           return {
//             icon: WifiOff,
//             text: "Error",
//             variant: "destructive" as const,
//             className: "bg-red-500",
//           };
//         default:
//           return {
//             icon: WifiOff,
//             text: "Offline",
//             variant: "secondary" as const,
//             className: "bg-gray-500",
//           };
//       }
//     };

//     const { icon: Icon, text, variant, className } = getStatusConfig();

//     return (
//       <Badge variant={variant} className={`${className} text-white`}>
//         <Icon
//           className={`h-3 w-3 mr-1 ${
//             connectionStatus === "connecting" ? "animate-spin" : ""
//           }`}
//         />
//         {text}
//       </Badge>
//     );
//   };

//   // Loading skeleton component
//   const DriverSkeleton = () => (
//     <Card className="p-4">
//       <div className="flex items-center gap-3">
//         <Skeleton className="h-12 w-12 rounded-full" />
//         <div className="flex-1 space-y-2">
//           <div className="flex justify-between">
//             <Skeleton className="h-4 w-32" />
//             <Skeleton className="h-6 w-16 rounded-full" />
//           </div>
//           <Skeleton className="h-3 w-24" />
//           <Skeleton className="h-3 w-28" />
//           <div className="flex items-center gap-2">
//             <Skeleton className="h-3 w-12" />
//             <Skeleton className="h-3 w-20" />
//           </div>
//         </div>
//       </div>
//     </Card>
//   );

//   // Error state
//   if (error && !isLoading) {
//     return (
//       <div className="h-full flex flex-col">
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex flex-col gap-2">
//             <div className="flex items-center gap-3">
//               <h1 className="text-2xl font-bold tracking-tight">
//                 Driver Tracking
//               </h1>
//               <ConnectionStatusBadge />
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Track your drivers in <span className="font-bold">real-time</span>
//             </p>
//           </div>
//         </div>

//         <div className="flex-1 flex items-center justify-center">
//           <Card className="p-8 text-center max-w-md">
//             <h3 className="text-lg font-semibold mb-2">
//               Unable to load drivers
//             </h3>
//             <p className="text-muted-foreground mb-4">{error}</p>
//             <Button onClick={() => fetchDrivers(true)} disabled={isRefreshing}>
//               {isRefreshing ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Retrying...
//                 </>
//               ) : (
//                 "Try Again"
//               )}
//             </Button>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex flex-col gap-2">
//           <div className="flex items-center gap-3">
//             <h1 className="text-2xl font-bold tracking-tight">
//               Driver Tracking
//             </h1>
//             <ConnectionStatusBadge />
//           </div>
//           <p className="text-sm text-muted-foreground">
//             Track your drivers in <span className="font-bold">real-time</span>
//             {isWebSocketConnected && (
//               <span className="ml-2 text-green-600 font-medium">
//                 • Live updates active
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleRefresh}
//             disabled={isRefreshing}
//           >
//             <RefreshCw
//               className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
//             />
//             Refresh
//           </Button>
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
//                 All {isLoading ? "..." : filteredDrivers.length}
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="all" className="space-y-4 mr-3">
//               {isLoading ? (
//                 Array.from({ length: 4 }).map((_, i) => (
//                   <DriverSkeleton key={i} />
//                 ))
//               ) : filteredDrivers.length > 0 ? (
//                 filteredDrivers.map((driver) => (
//                   <DriverCard
//                     key={driver.driver_id}
//                     driver={driver}
//                     isLiveUpdate={isWebSocketConnected}
//                   />
//                 ))
//               ) : (
//                 <div className="text-center text-muted-foreground py-8">
//                   {searchQuery
//                     ? "No drivers match your search"
//                     : "No drivers available"}
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>

//         <div className="md:col-span-3 bg-muted/30 rounded-lg overflow-hidden">
//           {isLoading ? (
//             <div className="w-full h-full flex items-center justify-center">
//               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//             </div>
//           ) : (
//             <MapView drivers={filteredDrivers} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function DriverCard({
//   driver,
//   isLiveUpdate,
// }: {
//   driver: getAllDrivers;
//   isLiveUpdate: boolean;
// }) {
//   const fullName = `${driver.first_name} ${driver.last_name || ""}`.trim();
//   const vehicleDisplay = driver.vehicles?.[0]
//     ? `${driver.vehicles[0]?.type} - ${driver.vehicles[0]?.model}`
//     : "No vehicle assigned";

//   // Get last location update time
//   const lastLocationUpdate = driver.driver_location?.[0]?.updatedAt;
//   const lastUpdateTime = lastLocationUpdate
//     ? new Date(lastLocationUpdate).toLocaleTimeString()
//     : "N/A";

//   // Check if location is recent (within last 5 minutes)
//   const isLocationRecent = lastLocationUpdate
//     ? Date.now() - new Date(lastLocationUpdate).getTime() < 5 * 60 * 1000
//     : false;

//   return (
//     <Card className="p-4 hover:shadow-md transition-shadow">
//       <div className="flex items-center gap-3">
//         <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
//           <Image
//             src="/placeholder.svg"
//             alt={fullName}
//             className="h-full w-full object-cover"
//             width={48}
//             height={48}
//           />
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between items-start">
//             <h3 className="font-medium">{fullName}</h3>
//             <div className="flex items-center gap-2">
//               {isLiveUpdate && isLocationRecent && (
//                 <Badge
//                   variant="outline"
//                   className="text-xs bg-green-50 text-green-700 border-green-200"
//                 >
//                   <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
//                   Live
//                 </Badge>
//               )}
//             </div>
//           </div>
//           <div className="text-sm text-muted-foreground">
//             Vehicle: {vehicleDisplay}
//           </div>
//           <div className="text-sm text-muted-foreground">
//             Current Delivery: {/* Add your delivery logic here */}
//           </div>
//           <div className="text-sm text-muted-foreground">
//             Phone: {driver.phone_number}
//           </div>
//           <div className="text-sm text-muted-foreground">
//             Last update: {lastUpdateTime}
//           </div>
//           <div className="mt-2 flex items-center text-sm">
//             <div className="flex items-center">
//               <span className="text-amber-500 mr-1">★</span>
//               <span>{driver.rating?.toFixed(1) || "N/A"}</span>
//             </div>
//             <span className="mx-2">•</span>
//             <span>{driver.completed_deliveries} deliveries</span>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }


// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { Search, RefreshCw, Loader2, Wifi, WifiOff } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";
// import { MapView } from "./Mapview";
// import Image from "next/image";
// import { getDriversData } from "@/lib/fetchDataService";
// import { getAllDrivers } from "@/lib/types";
// import { toast } from "sonner";
// import { useDriverLocations } from "@/hooks/useDriverLocation";

// // Define the driver status type
// export type DriverStatus = "active" | "inactive" | "break" | "offline";

// export function Tracking() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Use the custom hook for WebSocket integration
//   const {
//     drivers: driversData,
//     updateDrivers,
//     isWebSocketConnected,
//     connectionStatus,
//     initializeWebSocket,
//   } = useDriverLocations();

//   const fetchDrivers = useCallback(
//     async (showToast = true) => {
//       try {
//         setError(null);
//         const drivers = await getDriversData();

//         if (drivers && drivers.length > 0) {
//           // First update the drivers data
//           updateDrivers(drivers);

//           // Then initialize WebSocket connection after we have driver data
//           if (!isWebSocketConnected && connectionStatus === "disconnected") {
//             initializeWebSocket();
//           }

//           if (showToast) {
//             toast.success(`Loaded ${drivers.length} drivers successfully`);
//           }
//         } else {
//           updateDrivers([]);
//           if (showToast) {
//             toast.info("No drivers found");
//           }
//         }
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : "Failed to fetch drivers";
//         setError(errorMessage);
//         toast.error(`Error loading drivers: ${errorMessage}`);
//       } finally {
//         setIsLoading(false);
//         setIsRefreshing(false);
//       }
//     },
//     [updateDrivers, isWebSocketConnected, connectionStatus, initializeWebSocket]
//   );

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     await fetchDrivers(true);
//   };

//   useEffect(() => {
//     fetchDrivers(true);
//   }, [fetchDrivers]);

//   // Filter drivers based on search query
//   const filteredDrivers = searchQuery
//     ? driversData.filter(
//         (driver) =>
//           `${driver.first_name} ${driver.last_name || ""}`
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase()) ||
//           driver.driver_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           driver.vehicles?.[0]?.type
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase())
//       )
//     : driversData;

//   // Connection status badge
//   const ConnectionStatusBadge = () => {
//     const getStatusConfig = () => {
//       switch (connectionStatus) {
//         case "connected":
//           return {
//             icon: Wifi,
//             text: "Live",
//             variant: "default" as const,
//             className: "bg-green-500",
//           };
//         case "connecting":
//           return {
//             icon: Loader2,
//             text: "Connecting",
//             variant: "secondary" as const,
//             className: "bg-yellow-500",
//           };
//         case "error":
//           return {
//             icon: WifiOff,
//             text: "Error",
//             variant: "destructive" as const,
//             className: "bg-red-500",
//           };
//         default:
//           return {
//             icon: WifiOff,
//             text: "Offline",
//             variant: "secondary" as const,
//             className: "bg-gray-500",
//           };
//       }
//     };

//     const { icon: Icon, text, variant, className } = getStatusConfig();

//     return (
//       <Badge variant={variant} className={`${className} text-white`}>
//         <Icon
//           className={`h-3 w-3 mr-1 ${
//             connectionStatus === "connecting" ? "animate-spin" : ""
//           }`}
//         />
//         {text}
//       </Badge>
//     );
//   };

//   // Loading skeleton component
//   const DriverSkeleton = () => (
//     <Card className="p-4">
//       <div className="flex items-center gap-3">
//         <Skeleton className="h-12 w-12 rounded-full" />
//         <div className="flex-1 space-y-2">
//           <div className="flex justify-between">
//             <Skeleton className="h-4 w-32" />
//             <Skeleton className="h-6 w-16 rounded-full" />
//           </div>
//           <Skeleton className="h-3 w-24" />
//           <Skeleton className="h-3 w-28" />
//           <div className="flex items-center gap-2">
//             <Skeleton className="h-3 w-12" />
//             <Skeleton className="h-3 w-20" />
//           </div>
//         </div>
//       </div>
//     </Card>
//   );

//   // Error state
//   if (error && !isLoading) {
//     return (
//       <div className="h-full flex flex-col">
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex flex-col gap-2">
//             <div className="flex items-center gap-3">
//               <h1 className="text-2xl font-bold tracking-tight">
//                 Driver Tracking
//               </h1>
//               <ConnectionStatusBadge />
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Track your drivers in <span className="font-bold">real-time</span>
//             </p>
//           </div>
//         </div>

//         <div className="flex-1 flex items-center justify-center">
//           <Card className="p-8 text-center max-w-md">
//             <h3 className="text-lg font-semibold mb-2">
//               Unable to load drivers
//             </h3>
//             <p className="text-muted-foreground mb-4">{error}</p>
//             <Button onClick={() => fetchDrivers(true)} disabled={isRefreshing}>
//               {isRefreshing ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Retrying...
//                 </>
//               ) : (
//                 "Try Again"
//               )}
//             </Button>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex flex-col gap-2">
//           <div className="flex items-center gap-3">
//             <h1 className="text-2xl font-bold tracking-tight">
//               Driver Tracking
//             </h1>
//             <ConnectionStatusBadge />
//           </div>
//           <p className="text-sm text-muted-foreground">
//             Track your drivers in <span className="font-bold">real-time</span>
//             {isWebSocketConnected && (
//               <span className="ml-2 text-green-600 font-medium">
//                 • Live updates active
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleRefresh}
//             disabled={isRefreshing}
//           >
//             <RefreshCw
//               className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
//             />
//             Refresh
//           </Button>
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
//                 All {isLoading ? "..." : filteredDrivers.length}
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="all" className="space-y-4 mr-3">
//               {isLoading ? (
//                 Array.from({ length: 4 }).map((_, i) => (
//                   <DriverSkeleton key={i} />
//                 ))
//               ) : filteredDrivers.length > 0 ? (
//                 filteredDrivers.map((driver) => (
//                   <DriverCard
//                     key={driver.driver_id}
//                     driver={driver}
//                     isLiveUpdate={isWebSocketConnected}
//                   />
//                 ))
//               ) : (
//                 <div className="text-center text-muted-foreground py-8">
//                   {searchQuery
//                     ? "No drivers match your search"
//                     : "No drivers available"}
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>

//         <div className="md:col-span-3 bg-muted/30 rounded-lg overflow-hidden">
//           {isLoading ? (
//             <div className="w-full h-full flex items-center justify-center">
//               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//             </div>
//           ) : (
//             <MapView drivers={filteredDrivers} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function DriverCard({
//   driver,
//   isLiveUpdate,
// }: {
//   driver: getAllDrivers;
//   isLiveUpdate: boolean;
// }) {
//   const fullName = `${driver.first_name} ${driver.last_name || ""}`.trim();
//   const vehicleDisplay = driver.vehicles?.[0]
//     ? `${driver.vehicles[0]?.type} - ${driver.vehicles[0]?.model}`
//     : "No vehicle assigned";

//   // Get last location update time
//   const lastLocationUpdate = driver.driver_location?.[0]?.updatedAt;
//   const lastUpdateTime = lastLocationUpdate
//     ? new Date(lastLocationUpdate).toLocaleTimeString()
//     : "N/A";

//   // Check if location is recent (within last 5 minutes)
//   const isLocationRecent = lastLocationUpdate
//     ? Date.now() - new Date(lastLocationUpdate).getTime() < 5 * 60 * 1000
//     : false;

//   return (
//     <Card className="p-4 hover:shadow-md transition-shadow">
//       <div className="flex items-center gap-3">
//         <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
//           <Image
//             src="/placeholder.svg"
//             alt={fullName}
//             className="h-full w-full object-cover"
//             width={48}
//             height={48}
//           />
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between items-start">
//             <h3 className="font-medium">{fullName}</h3>
//             <div className="flex items-center gap-2">
//               {isLiveUpdate && isLocationRecent && (
//                 <Badge
//                   variant="outline"
//                   className="text-xs bg-green-50 text-green-700 border-green-200"
//                 >
//                   <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
//                   Live
//                 </Badge>
//               )}
//             </div>
//           </div>
//           <div className="text-sm text-muted-foreground">
//             Vehicle: {vehicleDisplay}
//           </div>
//           <div className="text-sm text-muted-foreground">
//             Current Delivery: {/* Add your delivery logic here */}
//           </div>
//           <div className="text-sm text-muted-foreground">
//             Phone: {driver.phone_number}
//           </div>
//           <div className="text-sm text-muted-foreground">
//             Last update: {lastUpdateTime}
//           </div>
//           <div className="mt-2 flex items-center text-sm">
//             <div className="flex items-center">
//               <span className="text-amber-500 mr-1">★</span>
//               <span>{driver.rating?.toFixed(1) || "N/A"}</span>
//             </div>
//             <span className="mx-2">•</span>
//             <span>{driver.completed_deliveries} deliveries</span>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }

"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Loader2, Wifi, WifiOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapView } from "./Mapview";
import Image from "next/image";
import { getDriversData } from "@/lib/fetchDataService";
import { getAllDrivers } from "@/lib/types";
import { toast } from "sonner";
import { useDriverLocations } from "@/hooks/useDriverLocation";

// Define the driver status type
export type DriverStatus = "active" | "inactive" | "break" | "offline";

export function Tracking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the custom hook for WebSocket integration
  const {
    drivers: driversData,
    updateDrivers,
    isWebSocketConnected,
    connectionStatus,
    initializeWebSocket,
  } = useDriverLocations();

  const fetchDrivers = useCallback(
    async (showToast = true) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching drivers data...");
        const drivers = await getDriversData();

        if (drivers && drivers.length > 0) {
          console.log(`Fetched ${drivers.length} drivers`);
          // Update the drivers data first
          updateDrivers(drivers);

          // Initialize WebSocket connection after we have driver data
          // Only if not already connected or connecting
          if (connectionStatus === "disconnected") {
            console.log("Initializing WebSocket connection...");
            initializeWebSocket();
          }

          if (showToast) {
            toast.success(`Loaded ${drivers.length} drivers successfully`);
          }
        } else {
          console.log("No drivers found");
          updateDrivers([]);
          if (showToast) {
            toast.info("No drivers found");
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch drivers";
        console.error("Error fetching drivers:", err);
        setError(errorMessage);
        toast.error(`Error loading drivers: ${errorMessage}`);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [updateDrivers, connectionStatus, initializeWebSocket]
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDrivers(true);
  };

  // Initial load
  useEffect(() => {
    fetchDrivers(false); // Don't show toast on initial load
  }, []);

  // Debug: Log connection status changes
  useEffect(() => {
    console.log("Connection status changed:", connectionStatus);
    console.log("WebSocket connected:", isWebSocketConnected);
    console.log("Drivers count:", driversData.length);
  }, [connectionStatus, isWebSocketConnected, driversData.length]);

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
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : driversData;

  // Connection status badge
  const ConnectionStatusBadge = () => {
    const getStatusConfig = () => {
      switch (connectionStatus) {
        case "connected":
          return {
            icon: Wifi,
            text: "Live",
            variant: "default" as const,
            className: "bg-green-500 hover:bg-green-600",
          };
        case "connecting":
          return {
            icon: Loader2,
            text: "Connecting",
            variant: "secondary" as const,
            className: "bg-yellow-500 hover:bg-yellow-600",
          };
        case "error":
          return {
            icon: WifiOff,
            text: "Error",
            variant: "destructive" as const,
            className: "bg-red-500 hover:bg-red-600",
          };
        default:
          return {
            icon: WifiOff,
            text: "Offline",
            variant: "secondary" as const,
            className: "bg-gray-500 hover:bg-gray-600",
          };
      }
    };

    const { icon: Icon, text, variant, className } = getStatusConfig();

    return (
      <Badge
        variant={variant}
        className={`${className} text-white cursor-pointer`}
        onClick={() => {
          if (
            connectionStatus === "error" ||
            connectionStatus === "disconnected"
          ) {
            console.log("Retrying WebSocket connection...");
            initializeWebSocket();
          }
        }}
      >
        <Icon
          className={`h-3 w-3 mr-1 ${
            connectionStatus === "connecting" ? "animate-spin" : ""
          }`}
        />
        {text}
      </Badge>
    );
  };

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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                Driver Tracking
              </h1>
              <ConnectionStatusBadge />
            </div>
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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Driver Tracking
            </h1>
            <ConnectionStatusBadge />
          </div>
          <p className="text-sm text-muted-foreground">
            Track your drivers in <span className="font-bold">real-time</span>
            {isWebSocketConnected && (
              <span className="ml-2 text-green-600 font-medium">
                • Live updates active ({driversData.length} drivers)
              </span>
            )}
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
            </TabsList>

            <TabsContent value="all" className="space-y-4 mr-3">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <DriverSkeleton key={i} />
                ))
              ) : filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver) => (
                  <DriverCard
                    key={driver.driver_id}
                    driver={driver}
                    isLiveUpdate={isWebSocketConnected}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  {searchQuery
                    ? "No drivers match your search"
                    : "No drivers available"}
                </div>
              )}
            </TabsContent>
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

function DriverCard({
  driver,
  isLiveUpdate,
}: {
  driver: getAllDrivers;
  isLiveUpdate: boolean;
}) {
  const fullName = `${driver.first_name} ${driver.last_name || ""}`.trim();
  const vehicleDisplay = driver.vehicles?.[0]
    ? `${driver.vehicles[0]?.type} - ${driver.vehicles[0]?.model}`
    : "No vehicle assigned";

  // Get last location update time
  const lastLocationUpdate = driver.driver_location?.[0]?.updatedAt;
  const lastUpdateTime = lastLocationUpdate
    ? new Date(lastLocationUpdate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "N/A";

  // Check if location is recent (within last 2 minutes for more accurate live status)
  const isLocationRecent = lastLocationUpdate
    ? Date.now() - new Date(lastLocationUpdate).getTime() < 2 * 60 * 1000
    : false;

  // Get location coordinates for debugging
  const location = driver.driver_location?.[0];
  const hasLocation = location?.latitude && location?.longitude;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
          <Image
            src="/placeholder.svg"
            alt={fullName}
            className="h-full w-full object-cover"
            width={48}
            height={48}
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{fullName}</h3>
            <div className="flex items-center gap-2">
              {isLiveUpdate && isLocationRecent && hasLocation && (
                <Badge
                  variant="outline"
                  className="text-xs bg-green-50 text-green-700 border-green-200"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                  Live
                </Badge>
              )}
              {hasLocation && (
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  GPS
                </Badge>
              )}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Vehicle: {vehicleDisplay}
          </div>
          <div className="text-sm text-muted-foreground">
            Phone: {driver.phone_number}
          </div>
          {hasLocation && (
            <div className="text-sm text-muted-foreground">
              Location: {location.latitude.toFixed(4)},{" "}
              {location.longitude.toFixed(4)}
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            Last update: {lastUpdateTime}
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