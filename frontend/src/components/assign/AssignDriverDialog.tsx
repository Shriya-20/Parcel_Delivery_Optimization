import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Mock drivers data (in a real app this would come from an API or context)
const mockDrivers = [
  {
    id: "d1",
    name: "Keerthan Kumar C",
    status: "active",
    location: { lat: 13.346573, lng: 74.794143 },
    vehicle: "van",
    currentDelivery: "P-4398",
    avatar: "/placeholder.svg",
    rating: 4.8,
    deliveriesCompleted: 342,
    phone: "+1 (555) 123-4567",
  },
  {
    id: "d2",
    name: "Shriya Bhat",
    status: "active",
    location: { lat: 13.369604, lng: 74.805201 },
    vehicle: "truck",
    currentDelivery: "P-8721",
    avatar: "/placeholder.svg",
    rating: 4.9,
    deliveriesCompleted: 512,
    phone: "+1 (555) 234-5678",
  },
  {
    id: "d3",
    name: "Bhanu Shashank",
    status: "inactive",
    location: { lat: 13.301463, lng: 74.735969 },
    vehicle: "car",
    currentDelivery: null,
    avatar: "/placeholder.svg",
    rating: 4.6,
    deliveriesCompleted: 198,
    phone: "+1 (555) 345-6789",
  },
  {
    id: "d4",
    name: "Santhosh",
    status: "break",
    location: { lat: 13.549314, lng: 74.702506 },
    vehicle: "minivan",
    currentDelivery: "P-2341",
    avatar: "/placeholder.svg",
    rating: 4.7,
    deliveriesCompleted: 287,
    phone: "+1 (555) 456-7890",
  },
];

interface AssignDriverDialogProps {
  open: boolean;
  onClose: () => void;
  onAssign: (driverId: string, driverName: string) => void;
  deliveryId: string;
}

export function AssignDriverDialog({
  open,
  onClose,
  onAssign,
  deliveryId,
}: AssignDriverDialogProps) {
  const [selectedDriver, setSelectedDriver] = useState("");

  const handleAssign = () => {
    const driver = mockDrivers.find((d) => d.id === selectedDriver);
    if (driver) {
      onAssign(driver.id, driver.name);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Driver to Delivery {deliveryId}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedDriver} onValueChange={setSelectedDriver}>
            {mockDrivers.map((driver) => (
              <div
                key={driver.id}
                className="flex items-center space-x-2 mb-4 last:mb-0"
              >
                <RadioGroupItem value={driver.id} id={`driver-${driver.id}`} />
                <Label htmlFor={`driver-${driver.id}`} className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                      <Image
                        src={driver.avatar}
                        alt={driver.name}
                        className="h-full w-full object-cover"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div>
                      <div className="font-medium">{driver.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {driver.vehicle} • {driver.rating} ★ •{" "}
                        {driver.deliveriesCompleted} deliveries
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedDriver}>
            Assign Driver
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
