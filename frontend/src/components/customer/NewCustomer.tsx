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
import { toast } from "sonner";
import { Calendar, Edit, Mail } from "lucide-react";
// import { AssignDriverDialog } from "./AssignDriverDialog";
import { getTomorrowScheduledDeliveries } from "@/lib/clientSideDataServices";
import {
  //   DriverWithRatings,
  DriverWithRelations,
  getTommorrowScheduledDeliveries,
} from "@/lib/types";
import { CustomerModal } from "@/components/assign/CustomerModal";
// import { DriverModal } from "@/components/assign/DriverModal";
import { EditTimeSlotDialog } from "./EditTimeSlotDialog";
import { sendEmailsToCustomers } from "@/lib/clientSideDataServices";
import { formatDateForFetching } from "@/lib/utils";

interface DeliveryWithAssignment extends getTommorrowScheduledDeliveries {
  assignedDriver?: DriverWithRelations | null;
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

//TODO: For now the DB has only one type so preferred time slot is shown else will be blank so that one take care and also diff in timings and decide proper time slot and add to edittimeslotdialog also
export function Customer() {
  const [deliveries, setDeliveries] = useState<
    getTommorrowScheduledDeliveries[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTimeSlotDialog, setShowTimeSlotDialog] = useState(false);
  const [selectedDelivery, setSelectedDelivery] =
    useState<DeliveryWithAssignment | null>(null);

  // Modal states
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  //   const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<
    getTommorrowScheduledDeliveries["customer"] | null
  >(null);
  //   const [selectedDriver, setSelectedDriver] =
  // useState<DriverWithRatings | null>(null);

  const handleSendEmails = useCallback(async () => {
    console.log("deliveries", deliveries);
    const res = await sendEmailsToCustomers(deliveries);
    if(res!=null){
      toast.success("Emails sent to customers successfully!");
    }else{
      toast.error("Failed to send emails to customers.");
    }
    
  }, [deliveries]);

  const handleOpenTimeSlotDialog = useCallback(
    (delivery: DeliveryWithAssignment) => {
      setSelectedDelivery(delivery);
      setShowTimeSlotDialog(true);
    },
    []
  );

  const handleUpdateTimeSlot = useCallback(
    (timeSlot: string) => {
      setDeliveries((prev) =>
        prev.map((d) =>
          d.delivery_id === selectedDelivery?.delivery_id
            ? { ...d, preferredTimeSlot: timeSlot }
            : d
        )
      );
      setShowTimeSlotDialog(false);
      toast.success(
        `Time slot updated for delivery  ${selectedDelivery?.delivery_id}`
      );
    },
    [selectedDelivery]
  );

  const handleOpenCustomerModal = useCallback(
    (customer: getTommorrowScheduledDeliveries["customer"]) => {
      setSelectedCustomer(customer);
      setShowCustomerModal(true);
    },
    []
  );

  const fetchDeliveries = useCallback(async (showToast = true) => {
    try {
      setIsLoading(true);
      setError(null);

      //dynamically get fro two days later as for customer it is two days later and for assign it is one day later
      const today = new Date();
      const twoDaysLater = new Date(today); // Create another new Date object based on today
      twoDaysLater.setDate(today.getDate() + 2); // Add 2 days to the current date
      const twoDaysLaterFormatted = formatDateForFetching(twoDaysLater);


      const deliveries = await getTomorrowScheduledDeliveries(twoDaysLaterFormatted); //!IMP-> add like if assign or customer so that we can send date as one day next to today or 2 days next accordingly for customer or assign

      if (deliveries && deliveries.length > 0) {
        setDeliveries(deliveries);
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
            Customer Time Slots
          </h1>
          <p className="text-sm text-foreground">
            Manage your customer delivery time slots - Let your customers choose
            their <span className="font-bold"> preferred time slots</span> for
            delivery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSendEmails} className="gap-2">
            <Mail className="h-4 w-4" />
            Send Emails to Customers
          </Button>
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
            Upcoming Deliveries (2 days prior)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Delivery ID</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Delivery Address</TableHead>
                <TableHead>Default Time Slot</TableHead>
                <TableHead>Preferred Time</TableHead>
                <TableHead>Customer</TableHead>
                {/* <TableHead>Assigned Driver</TableHead> */}
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No upcoming deliveries
                  </TableCell>
                </TableRow>
              ) : (
                deliveries.map((delivery) => (
                  <TableRow key={delivery.delivery_id}>
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
                    <TableCell>{delivery.dropoff_location}</TableCell>
                    <TableCell>9:00 - 11:00</TableCell>
                    <TableCell>
                      {delivery.preffered_time || (
                        <span className="text-muted-foreground">
                          Not specified
                        </span>
                      )}
                    </TableCell>
                    <TableCell >
                      {renderCustomerInfo(delivery.customer)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenTimeSlotDialog(delivery)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assign Time Slot Dialog */}
      {selectedDelivery && (
        <EditTimeSlotDialog
          open={showTimeSlotDialog}
          onClose={() => setShowTimeSlotDialog(false)}
          onUpdate={handleUpdateTimeSlot}
          deliveryId={selectedDelivery.delivery_id}
          currentTimeSlot={
            selectedDelivery.preffered_time || "9:00 - 11:00" // Default time slot if not specified
          }
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
      {/* {selectedDriver && (
        <DriverModal
          driver={selectedDriver}
          isOpen={showDriverModal}
          onClose={() => {
            setShowDriverModal(false);
            setSelectedDriver(null);
          }}
        />
      )} */}
    </div>
  );
}
