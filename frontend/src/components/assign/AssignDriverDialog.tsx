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
import { getAllDrivers } from "@/lib/types";



interface AssignDriverDialogProps {
  open: boolean;
  onClose: () => void;
  onAssign: (driverId: string, driverName: string) => void;
  deliveryId: string;
  driversData: getAllDrivers[];
}

export function AssignDriverDialog({
  open,
  onClose,
  onAssign,
  deliveryId,
  driversData
}: AssignDriverDialogProps) {
  const [selectedDriver, setSelectedDriver] = useState("");

  const handleAssign = () => {
    const driver = driversData.find((d) => d.driver_id === selectedDriver);
    if (driver) {
      onAssign(driver.driver_id, driver.first_name + " " + (driver.last_name || ""));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Driver to Delivery <br/> {deliveryId}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedDriver} onValueChange={setSelectedDriver}>
            {driversData.map((driver) => (
              <div
                key={driver.driver_id}
                className="flex items-center space-x-2 mb-4 last:mb-0"
              >
                <RadioGroupItem value={driver.driver_id} id={`driver-${driver.driver_id}`} />
                <Label htmlFor={`driver-${driver.driver_id}`} className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                      <Image
                        // src={driver.avatar}
                        src="/placeholder.svg"
                        alt={driver.first_name + " " + (driver.last_name || "")}
                        // Placeholder image, replace with driver.avatar when available
                        className="h-full w-full object-cover"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div>
                      <div className="font-medium">{driver.first_name + " " + (driver.last_name || "")}</div>
                      <div className="text-sm text-muted-foreground">
                        {driver.vehicles[0].type} • {driver.rating} ★ •{" "}
                        {driver.completed_deliveries} deliveries
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
