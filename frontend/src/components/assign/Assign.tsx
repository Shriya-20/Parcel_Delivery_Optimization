// "use client";

// import { useCallback, useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import {
//   Calendar,
//   Truck,
// } from "lucide-react";
// import { AssignDriverDialog } from "./AssignDriverDialog";
// import { getDriversData, getTomorrowScheduledDeliveries } from "@/lib/fetchDataService";
// import {  getAllDrivers, getTommorrowScheduledDeliveries } from "@/lib/types";
// import { CustomerModal } from "./CustomerModal";
// import { DriverModal } from "./DriverModal";

// interface DeliveryWithAssignment extends getTommorrowScheduledDeliveries {
//   assignedDriver?: getAllDrivers | null;
// }

// const SKELETON_ROWS = 5;

// const DeliveriesSkeleton = () => (
//   <div className="flex flex-col gap-2">
//     <div className="text-center text-muted-foreground mb-4">
//       <Skeleton className="h-8 w-1/3 mx-auto" />
//     </div>
//     <Card>
//       <CardHeader className="bg-muted/50">
//         <CardTitle className="flex items-center gap-2 text-lg font-medium">
//           <Skeleton className="h-5 w-1/3" />
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-0">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {Array.from({ length: 7 }).map((_, index) => (
//                 <TableHead key={index}>
//                   <Skeleton className="h-4 w-full" />
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
//               <TableRow key={index}>
//                 {Array.from({ length: 7 }).map((_, cellIndex) => (
//                   <TableCell key={cellIndex} className="py-4">
//                     <Skeleton className="h-4 w-full" />
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   </div>
// );

// export function Assign() {
//   const [deliveries, setDeliveries] = useState<
//     getTommorrowScheduledDeliveries[]
//   >([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showAssignDialog, setShowAssignDialog] = useState(false);
//   const [selectedDelivery, setSelectedDelivery] =
//     useState<DeliveryWithAssignment | null>(null);
//   const [drivers, setDrivers] = useState<getAllDrivers[]>([]);

//   // Modal states
//   const [showCustomerModal, setShowCustomerModal] = useState(false);
//   const [showDriverModal, setShowDriverModal] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState<
//     getTommorrowScheduledDeliveries["customer"] | null
//   >(null);
//   const [selectedDriver, setSelectedDriver] =
//     useState<getAllDrivers | null>(null);

//   const handleAssignAllDrivers = useCallback(() => {
//     toast.success("Drivers assigned successfully!");
//   }, []);

//   const handleOpenAssignDialog = useCallback(
//     (delivery: DeliveryWithAssignment) => {
//       setSelectedDelivery(delivery);
//       setShowAssignDialog(true);
//     },
//     []
//   );

//   const handleAssignDriverToDelivery = useCallback(
//     (driverId: string, driverName: string) => {
//       if (!selectedDelivery) return;

//       const updatedDriver = drivers.find((d) => d.driver_id === driverId);
//       if (!updatedDriver) return;

//       toast.success(
//         `${driverName} assigned to delivery ${selectedDelivery.delivery_id} successfully`
//       );

//       setDeliveries((prevDeliveries) =>
//         prevDeliveries.map((delivery) =>
//           delivery.delivery_id === selectedDelivery.delivery_id
//             ? {
//                 ...delivery,
//                 Assignment: [
//                   {
//                     ...delivery.Assignment[0],
//                     driver: updatedDriver,
//                   },
//                 ],
//               }
//             : delivery
//         )
//       );

//       // Reset state *after* updating deliveries
//       setShowAssignDialog(false);
//       setSelectedDelivery(null);
//     },
//     [selectedDelivery, drivers]
//   );

//   const handleOpenCustomerModal = useCallback(
//     (customer: getTommorrowScheduledDeliveries["customer"]) => {
//       setSelectedCustomer(customer);
//       setShowCustomerModal(true);
//     },
//     []
//   );

//   const handleOpenDriverModal = useCallback((driver: getAllDrivers) => {
//     setSelectedDriver(driver);
//     setShowDriverModal(true);
//   }, []);

//   const fetchDeliveries = useCallback(async (showToast = true) => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const deliveries = await getTomorrowScheduledDeliveries();
//       const driversData = await getDriversData();
//       if (!driversData || driversData.length === 0) {
//         throw new Error("No drivers found");
//       }
//       setDrivers(driversData);
//       if (deliveries && deliveries.length > 0) {
//         setDeliveries(deliveries);
//         if (showToast) {
//           toast.success(`Loaded ${deliveries.length} deliveries successfully`);
//         }
//       } else {
//         setDeliveries([]);
//         if (showToast) {
//           toast.info("No deliveries scheduled for tomorrow");
//         }
//       }
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Failed to fetch deliveries";
//       setError(errorMessage);
//       toast.error(`Error loading deliveries: ${errorMessage}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDeliveries();
//   }, [fetchDeliveries]);

//   const renderDriverInfo = (delivery: getTommorrowScheduledDeliveries) => {
//     const assignment = delivery.Assignment[0];

//     if (!assignment) {
//       return <span className="text-muted-foreground">Not assigned</span>;
//     }

//     const driverName = assignment.driver
//       ? `${assignment.driver.first_name} ${assignment.driver.last_name}`
//       : "";

//     return (
//       <div className="flex items-center gap-2">
//         <Button
//           variant="ghost"
//           size="sm"
//           className="p-0 h-auto font-normal text-foreground hover:text-primary"
//           onClick={() => handleOpenDriverModal(assignment.driver)}
//         >
//           <span className="underline">{driverName}</span>
//         </Button>
//       </div>
//     );
//   };

//   const renderCustomerInfo = (
//     customer: getTommorrowScheduledDeliveries["customer"]
//   ) => {
//     const customerName = `${customer.first_name} ${customer.last_name}`;

//     return (
//       <Button
//         variant="ghost"
//         size="sm"
//         className="p-0 h-auto font-normal text-foreground hover:text-primary"
//         onClick={() => handleOpenCustomerModal(customer)}
//       >
//         <span className="underline">{customerName}</span>
//       </Button>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="container mx-auto py-6">
//         <DeliveriesSkeleton />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-6">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex flex-col gap-2">
//           <h1 className="text-2xl font-bold tracking-tight">
//             Assign Deliveries
//           </h1>
//           <p className="text-sm text-foreground">
//             Assign drivers to tomorrow&apos;s deliveries{" "}
//             <span className="font-bold">manually</span> or let our best{" "}
//             <span className="font-bold">driver algorithm</span> do it
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button onClick={handleAssignAllDrivers} className="gap-2">
//             <Truck className="h-4 w-4" />
//             Assign All Drivers
//           </Button>
//         </div>
//       </div>

//       {error && (
//         <Card className="mb-6 border-destructive">
//           <CardContent className="pt-6">
//             <p className="text-destructive text-sm">{error}</p>
//           </CardContent>
//         </Card>
//       )}

//       <Card>
//         <CardHeader className="bg-muted/50">
//           <CardTitle className="flex items-center gap-2 text-lg font-medium">
//             <Calendar className="h-5 w-5" />
//             Tomorrow&apos;s Scheduled Deliveries
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Delivery ID</TableHead>
//                 <TableHead>Priority</TableHead>
//                 <TableHead>Delivery Address</TableHead>
//                 <TableHead>Preferred Time</TableHead>
//                 <TableHead>Customer Name</TableHead>
//                 <TableHead>Assigned Driver</TableHead>
//                 <TableHead className="w-[100px]">Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {deliveries.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={7}
//                     className="text-center py-8 text-muted-foreground"
//                   >
//                     No deliveries scheduled for tomorrow
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 deliveries.map((delivery) => (
//                   <TableRow key={delivery.delivery_id}>
//                     <TableCell className="font-medium">
//                       {delivery.delivery_id}
//                     </TableCell>
//                     <TableCell>
//                       <span
//                         className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                           delivery.priority >= 7
//                             ? "bg-red-100 text-red-800"
//                             : delivery.priority >= 4 && delivery.priority < 7
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-green-100 text-green-800"
//                         }`}
//                       >
//                         {delivery.priority >= 7
//                           ? "High"
//                           : delivery.priority >= 4 && delivery.priority < 7
//                           ? "Medium"
//                           : "Low"}
//                       </span>
//                     </TableCell>
//                     <TableCell className="max-w-xs truncate">
//                       {delivery.dropoff_location}
//                     </TableCell>
//                     <TableCell>{delivery.preffered_time}</TableCell>
//                     <TableCell>
//                       {renderCustomerInfo(delivery.customer)}
//                     </TableCell>
//                     <TableCell>{renderDriverInfo(delivery)}</TableCell>
//                     <TableCell>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleOpenAssignDialog(delivery)}
//                       >
//                         {delivery.Assignment.length > 0 ? "Reassign" : "Assign"}
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* Assignment Dialog */}
//       {selectedDelivery && (
//         <AssignDriverDialog
//           open={showAssignDialog}
//           onClose={() => {
//             setShowAssignDialog(false);
//             setSelectedDelivery(null);
//           }}
//           onAssign={handleAssignDriverToDelivery}
//           deliveryId={selectedDelivery.delivery_id}
//           driversData={drivers}
//         />
//       )}

//       {/* Customer Details Modal */}
//       {selectedCustomer && (
//         <CustomerModal
//           customer={selectedCustomer}
//           isOpen={showCustomerModal}
//           onClose={() => {
//             setShowCustomerModal(false);
//             setSelectedCustomer(null);
//           }}
//         />
//       )}

//       {/* Driver Details Modal */}
//       {selectedDriver && (
//         <DriverModal
//           driver={selectedDriver}
//           isOpen={showDriverModal}
//           onClose={() => {
//             setShowDriverModal(false);
//             setSelectedDriver(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, Truck, RefreshCw } from "lucide-react";
import { AssignDriverDialog } from "./AssignDriverDialog";
import {
  assignBulkRoutes,
  getDriversData,
  getTomorrowScheduledDeliveries,
} from "@/lib/clientSideDataServices";
import { getAllDrivers, getTommorrowScheduledDeliveries } from "@/lib/types";
import { CustomerModal } from "./CustomerModal";
import { DriverModal } from "./DriverModal";
import { formatDateForFetching } from "@/lib/utils";

interface DeliveryWithAssignment extends getTommorrowScheduledDeliveries {
  assignedDriver?: getAllDrivers | null;
}

const SKELETON_ROWS = 5;

const DeliveriesSkeleton = () => (
  <div className="flex flex-col gap-2">
    <div className="text-center text-muted-foreground mb-4">
      <Skeleton className="h-8 w-1/3 mx-auto" />
    </div>
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Skeleton className="h-5 w-1/3" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 7 }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 7 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex} className="py-4">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export function Assign() {
  const [deliveries, setDeliveries] = useState<
    getTommorrowScheduledDeliveries[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedDelivery, setSelectedDelivery] =
    useState<DeliveryWithAssignment | null>(null);
  const [drivers, setDrivers] = useState<getAllDrivers[]>([]);

  // Modal states
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<
    getTommorrowScheduledDeliveries["customer"] | null
  >(null);
  const [selectedDriver, setSelectedDriver] = useState<getAllDrivers | null>(
    null
  );

  // Get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Helper functions for assignment counts
  const getUnassignedCount = () => {
    return deliveries.filter((delivery) => delivery.Assignment.length === 0)
      .length;
  };

  const getAssignedCount = () => {
    return deliveries.filter((delivery) => delivery.Assignment.length > 0)
      .length;
  };

  // Integrated assignment logic from AssignDeliveries component
  const handleAssignAllDrivers = useCallback(async () => {
    if (deliveries.length === 0) {
      toast.error("No deliveries to assign");
      return;
    }

    const unassignedCount = getUnassignedCount();
    if (unassignedCount === 0) {
      toast.info("All deliveries are already assigned");
      return;
    }

    setIsAssigning(true);
    try {
      // const tomorrowDate = getTomorrowDate();
      // const date = "2025-05-26";//for now hardcoded date

      //to get the tommorrow date dynamically
      const today = new Date();
      const tomorrow = new Date(today); // Create a new Date object based on today
      tomorrow.setDate(today.getDate() + 1); // Add 1 day to the current date
      const tomorrowFormatted = formatDateForFetching(tomorrow);

      const response = await assignBulkRoutes(deliveries, tomorrowFormatted);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to assign deliveries");
      }

      const result = response.data;

      if (result.status === "success") {
        // Update the deliveries with new assignments
        setDeliveries(result.data.optimizedDeliveries);
        toast.success(
          `Successfully assigned ${result.data.totalAssignments} deliveries to ${result.data.totalDrivers} drivers`
        );
      } else {
        throw new Error(result.error || "Assignment failed");
      }
    } catch (error) {
      console.error("Error assigning deliveries:", error);
      toast.error("Failed to assign deliveries. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  }, [deliveries]);

  // const handleOpenAssignDialog = useCallback(
  //   (delivery: DeliveryWithAssignment) => {
  //     setSelectedDelivery(delivery);
  //     setShowAssignDialog(true);
  //   },
  //   []
  // );

  const handleAssignDriverToDelivery = useCallback(
    (driverId: string, driverName: string) => {
      if (!selectedDelivery) return;

      const updatedDriver = drivers.find((d) => d.driver_id === driverId);
      if (!updatedDriver) return;

      toast.success(
        `${driverName} assigned to delivery ${selectedDelivery.delivery_id} successfully`
      );

      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.delivery_id === selectedDelivery.delivery_id
            ? {
                ...delivery,
                Assignment: [
                  {
                    ...delivery.Assignment[0],
                    driver: updatedDriver,
                  },
                ],
              }
            : delivery
        )
      );

      setShowAssignDialog(false);
      setSelectedDelivery(null);
    },
    [selectedDelivery, drivers]
  );

  const handleOpenCustomerModal = useCallback(
    (customer: getTommorrowScheduledDeliveries["customer"]) => {
      setSelectedCustomer(customer);
      setShowCustomerModal(true);
    },
    []
  );

  const handleOpenDriverModal = useCallback((driver: getAllDrivers) => {
    setSelectedDriver(driver);
    setShowDriverModal(true);
  }, []);

  const fetchDeliveries = useCallback(async (showToast = true) => {
    try {
      setIsLoading(true);
      setError(null);
      //to get the tommorrow date dynamically
      const today = new Date();
      const tomorrow = new Date(today); // Create a new Date object based on today
      tomorrow.setDate(today.getDate() + 1); // Add 1 day to the current date
      const tomorrowFormatted = formatDateForFetching(tomorrow);
      //so fetching deliveries for tomorrow
      const deliveries = await getTomorrowScheduledDeliveries(tomorrowFormatted);
      const driversData = await getDriversData();

      if (!driversData || driversData.length === 0) {
        throw new Error("No drivers found");
      }

      setDrivers(driversData);

      if (deliveries && deliveries.length > 0) {
        setDeliveries(deliveries);
        console.log("deliveries", deliveries);
        if (showToast) {
          toast.success(`Loaded ${deliveries.length} deliveries successfully`);
        }
      } else {
        setDeliveries([]);
        if (showToast) {
          toast.info("No deliveries scheduled for tomorrow");
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch deliveries";
      setError(errorMessage);
      toast.error(`Error loading deliveries: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const renderDriverInfo = (delivery: getTommorrowScheduledDeliveries) => {
    const assignment = delivery.Assignment[0];

    if (!assignment) {
      return <span className="text-muted-foreground">Not assigned</span>;
    }

    const driverName = assignment.driver
      ? `${assignment.driver.first_name} ${assignment.driver.last_name}`
      : "Unknown Driver";

    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto font-normal text-foreground hover:text-primary"
          onClick={() =>
            assignment.driver && handleOpenDriverModal(assignment.driver)
          }
          disabled={!assignment.driver}
        >
          <span className="underline hover:cursor-pointer">{driverName}</span>
        </Button>
      </div>
    );
  };

  const renderCustomerInfo = (
    customer: getTommorrowScheduledDeliveries["customer"]
  ) => {
    const customerName = `${customer.first_name} ${customer.last_name}`;

    return (
      <Button
        variant="ghost"
        size="sm"
        className="p-0 h-auto font-normal text-foreground hover:text-primary"
        onClick={() => handleOpenCustomerModal(customer)}
      >
        <span className="underline hover:cursor-pointer">{customerName}</span>
      </Button>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <DeliveriesSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Assign Deliveries
          </h1>
          <p className="text-sm text-foreground">
            Assign drivers to tomorrow&apos;s deliveries{" "}
            <span className="font-bold">manually</span> or let our best{" "}
            <span className="font-bold">driver algorithm</span> do it
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Assignment Statistics */}
          <div className="flex gap-2">
            <Badge variant="outline" className="text-sm">
              <Truck className="w-4 h-4 mr-1" />
              Total: {deliveries.length}
            </Badge>
            <Badge variant="destructive" className="text-sm">
              Unassigned: {getUnassignedCount()}
            </Badge>
            <Badge variant="default" className="text-sm">
              Assigned: {getAssignedCount()}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDeliveries()}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>

            <Button
              onClick={handleAssignAllDrivers}
              disabled={isAssigning || getUnassignedCount() === 0}
              className="min-w-40"
            >
              {isAssigning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Optimizing Routes...
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4 mr-2" />
                  Assign All Drivers ({getUnassignedCount()})
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Calendar className="h-5 w-5" />
            Tomorrow&apos;s Scheduled Deliveries ({getTomorrowDate()})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Delivery ID</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Delivery Address</TableHead>
                <TableHead>Preferred Time</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Assigned Driver</TableHead>
                {/* <TableHead className="w-[100px]">Action</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No deliveries scheduled for tomorrow
                  </TableCell>
                </TableRow>
              ) : (
                deliveries.map((delivery) => (
                  <TableRow
                    key={delivery.delivery_id}
                    className={
                      delivery.Assignment.length > 0 ? "bg-green-50" : ""
                    }
                  >
                    <TableCell className="font-medium">
                      {delivery.delivery_id}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          delivery.priority >= 7
                            ? "bg-red-100 text-red-800"
                            : delivery.priority >= 4 && delivery.priority < 7
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {delivery.priority >= 7
                          ? "High"
                          : delivery.priority >= 4 && delivery.priority < 7
                          ? "Medium"
                          : "Low"}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {delivery.dropoff_location}
                    </TableCell>
                    <TableCell>{delivery.preffered_time}</TableCell>
                    <TableCell>
                      {renderCustomerInfo(delivery.customer)}
                    </TableCell>
                    <TableCell>{renderDriverInfo(delivery)}</TableCell>
                    {/* <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenAssignDialog(delivery)}
                      >
                        {delivery.Assignment.length > 0 ? "Reassign" : "Assign"}
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assignment Dialog */}
      {selectedDelivery && (
        <AssignDriverDialog
          open={showAssignDialog}
          onClose={() => {
            setShowAssignDialog(false);
            setSelectedDelivery(null);
          }}
          onAssign={handleAssignDriverToDelivery}
          deliveryId={selectedDelivery.delivery_id}
          driversData={drivers}
        />
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          isOpen={showCustomerModal}
          onClose={() => {
            setShowCustomerModal(false);
            setSelectedCustomer(null);
          }}
        />
      )}

      {/* Driver Details Modal */}
      {selectedDriver && (
        <DriverModal
          driver={selectedDriver}
          isOpen={showDriverModal}
          onClose={() => {
            setShowDriverModal(false);
            setSelectedDriver(null);
          }}
        />
      )}
    </div>
  );
}
