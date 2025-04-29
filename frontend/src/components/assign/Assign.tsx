"use client"
import { useState } from "react";
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
import { toast } from "sonner";
import { Calendar, Truck } from "lucide-react";
import { mockParcels } from "@/lib/mock-data";
import { AssignDriverDialog } from "./AssignDriverDialog";
import { Driver, Parcel } from "@/lib/types";
import Image from "next/image";

// Mock data for tomorrow's deliveries
const tomorrowsDeliveries = mockParcels
  .filter((p) => p.status === "waiting")
  .map((p) => ({
    ...p,
    assignedDriver: null,
  }));
export interface tommorrowsDelivery extends Parcel {
  assignedDriver: Driver | null;
}
export function Assign() {
  const [deliveries, setDeliveries] = useState<tommorrowsDelivery[]>(tomorrowsDeliveries);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<tommorrowsDelivery | null>(null);

  const handleAssignDrivers = () => {
    // In a real app, this would open a more complex UI or do batch assignment
    toast.success("Drivers assigned successfully!");

    // Simulate automatic assignment
    setDeliveries((prev) =>
      prev.map((delivery, index) => ({
        ...delivery,
        assignedDriver: {
          id: `d${(index % 4) + 1}`,
          name: [
            "Keerthan Kumar C",
            "Shriya Bhat",  
            "Bhanu Shashank",
            "Santhosh",
          ][index % 4],
          avatar: "/placeholder.svg",
          rating: 4.8,
          deliveriesCompleted: 342,
          vehicle: ["van", "truck", "car", "minivan"][index % 4],
          available: true,
          phone: "+1 (555) 123-4567",
          status: "active",
          location: { lat: 13.346573, lng: 74.794143 },
          currentDelivery: delivery.id,
        },
      }))
    );
  };

  const handleOpenAssignDialog = (delivery: tommorrowsDelivery) => {
    setSelectedDelivery(delivery);
    setShowAssignDialog(true);
  };

  const handleAssignDriverToDelivery = (driverId: string, driverName: string) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === selectedDelivery?.id
          ? {
              ...d,
              assignedDriver: {
                id: driverId,
                name: driverName,
                avatar: "/placeholder.svg",
                rating: 4.8,
                deliveriesCompleted: 342,
                vehicle: "van",
                available: true,
                phone: "+1 (555) 123-4567",
                status: "active",
                location: { lat: 13.346573, lng: 74.794143 },
                currentDelivery: d.id,
              },
            }
          : d
      )
    );
    setShowAssignDialog(false);
    toast.success(`${driverName} assigned to delivery ${selectedDelivery?.id}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Assign Deliveries</h1>
          <p className="text-sm muted-foreground">Assign drivers to tomorrow&apos;s deliveries <span className="font-bold">Manually</span> or let our best <span className="font-bold">driver algorithm </span>do it</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleAssignDrivers} className="gap-2">
            <Truck className="h-4 w-4" />
            Assign All Drivers
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Calendar className="h-5 w-5" />
            Tomorrow&apos;s Scheduled Deliveries
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Delivery ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Pickup Address</TableHead>
                <TableHead>Delivery Address</TableHead>
                <TableHead>Assigned Driver</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No deliveries scheduled for tomorrow
                  </TableCell>
                </TableRow>
              ) : (
                deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.id}</TableCell>
                    <TableCell>{delivery.type}</TableCell>
                    <TableCell>{delivery.pickupAddress}</TableCell>
                    <TableCell>{delivery.deliveryAddress}</TableCell>
                    <TableCell>
                      {delivery.assignedDriver ? (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                            <Image
                              src={delivery.assignedDriver.avatar}
                              alt={delivery.assignedDriver.name}
                              className="h-full w-full object-cover"
                              width={32}
                              height={32}
                            />
                          </div>
                          <span>{delivery.assignedDriver.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          Not assigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenAssignDialog(delivery)}
                      >
                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedDelivery && (
        <AssignDriverDialog
          open={showAssignDialog}
          onClose={() => setShowAssignDialog(false)}
          onAssign={handleAssignDriverToDelivery}
          deliveryId={selectedDelivery.id}
        />
      )}
    </div>
  );
}