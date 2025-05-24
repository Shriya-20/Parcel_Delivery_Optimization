"use client";
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

// Mock time slots
const timeSlots = [
  "8:00 - 9:00",
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
];

interface EditTimeSlotDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (timeSlot: string) => void;
  deliveryId: string;
  currentTimeSlot: string;
}

export function EditTimeSlotDialog({
  open,
  onClose,
  onUpdate,
  deliveryId,
  currentTimeSlot,
}: EditTimeSlotDialogProps) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(currentTimeSlot);

  const handleUpdate = () => {
    if (selectedTimeSlot) {
      onUpdate(selectedTimeSlot);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Edit Time Slot for Delivery <br />{" "}
            <span className="text-md text-muted-foreground mt-2">
              Delivery ID: <br /> {deliveryId}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={selectedTimeSlot}
            onValueChange={setSelectedTimeSlot}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timeSlots.map((timeSlot) => (
                <div key={timeSlot} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={timeSlot}
                    id={`timeslot-${timeSlot}`}
                  />
                  <Label htmlFor={`timeslot-${timeSlot}`}>{timeSlot}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update Time Slot</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}