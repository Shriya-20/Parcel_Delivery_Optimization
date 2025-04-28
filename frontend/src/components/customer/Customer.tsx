"use client";
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
import { Calendar, Mail, Edit } from "lucide-react";
import { mockParcels } from "@/lib/mock-data";
import { EditTimeSlotDialog } from "./EditTimeSlotDialog";
import { Parcel } from "@/lib/types";

// Mock data for customer deliveries (2 days prior)
const customerDeliveries = mockParcels.map((p) => ({
  ...p,
  defaultTimeSlot: "9:00 - 10:00",
  preferredTimeSlot: null,
}));
export interface delivery extends Parcel {
  defaultTimeSlot: string;
  preferredTimeSlot: string | null;
}

export function Customer() {
  const [deliveries, setDeliveries] = useState<delivery[]>(customerDeliveries);
  const [showTimeSlotDialog, setShowTimeSlotDialog] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<delivery | null>(null);

  const handleSendEmails = () => {
    toast.success("Emails sent to customers successfully!");
  };

  const handleOpenTimeSlotDialog = (delivery : delivery) => {
    setSelectedDelivery(delivery);
    setShowTimeSlotDialog(true);
  };

  const handleUpdateTimeSlot = (timeSlot: string) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === selectedDelivery?.id ? { ...d, preferredTimeSlot: timeSlot } : d
      )
    );
    setShowTimeSlotDialog(false);
    toast.success(`Time slot updated for delivery ${selectedDelivery?.id}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Customer Time Slots
          </h1>
          <p className="text-sm muted-foreground">
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
                <TableHead>Type</TableHead>
                <TableHead>Delivery Address</TableHead>
                <TableHead>Default Time Slot</TableHead>
                <TableHead>Preferred Time Slot</TableHead>
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
                    No upcoming deliveries
                  </TableCell>
                </TableRow>
              ) : (
                deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.id}</TableCell>
                    <TableCell>{delivery.type}</TableCell>
                    <TableCell>{delivery.deliveryAddress}</TableCell>
                    <TableCell>{delivery.defaultTimeSlot}</TableCell>
                    <TableCell>
                      {delivery.preferredTimeSlot || (
                        <span className="text-muted-foreground">
                          Not specified
                        </span>
                      )}
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

      {selectedDelivery && (
        <EditTimeSlotDialog
          open={showTimeSlotDialog}
          onClose={() => setShowTimeSlotDialog(false)}
          onUpdate={handleUpdateTimeSlot}
          deliveryId={selectedDelivery.id}
          currentTimeSlot={
            selectedDelivery.preferredTimeSlot ||
            selectedDelivery.defaultTimeSlot
          }
        />
      )}
    </div>
  );
}