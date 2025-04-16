"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { mockDrivers } from "@/lib/mock-data";
// import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
interface CreateRouteDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateRouteDialog({ open, onClose }: CreateRouteDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  // const { toast } = useToast();

  const handleDriverSelection = (driverId: string) => {
    setSelectedDrivers((prev) =>
      prev.includes(driverId)
        ? prev.filter((id) => id !== driverId)
        : [...prev, driverId]
    );
  };

  const selectAllDrivers = () => {
    if (selectedDrivers.length === mockDrivers.length) {
      setSelectedDrivers([]);
    } else {
      setSelectedDrivers(mockDrivers.map((driver) => driver.id));
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // This would submit the form in a real app
      toast.success("Route created",{
        description: "Your new route has been created successfully",
      });
      onClose();
      setStep(1);
      setSelectedDrivers([]);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
    setStep(1);
    setSelectedDrivers([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Route</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center justify-between mb-8">
            <Tabs value={step.toString()} className="w-full">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="1" disabled>
                  Choose vehicles
                </TabsTrigger>
                <TabsTrigger value="2" disabled>
                  Upload delivery information
                </TabsTrigger>
                <TabsTrigger value="3" disabled>
                  Generate routes
                </TabsTrigger>
                <TabsTrigger value="4" disabled>
                  Publish
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {step === 1 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm">
                  Available drivers: {mockDrivers.length}
                </div>
                <Button variant="link" size="sm" onClick={selectAllDrivers}>
                  {selectedDrivers.length === mockDrivers.length
                    ? "Deselect all"
                    : "Select all"}
                </Button>
              </div>

              <div className="relative mb-4">
                <Input type="text" placeholder="Search" className="pl-8" />
                <svg
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <div className="space-y-4">
                {mockDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="flex items-center justify-between border rounded-md p-3"
                  >
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        id={driver.id}
                        checked={selectedDrivers.includes(driver.id)}
                        onCheckedChange={() => handleDriverSelection(driver.id)}
                      />
                      <div className="flex items-center space-x-3">
                        <Image
                          src={driver.avatar}
                          alt={driver.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{driver.name}</div>
                          <div className="flex items-center">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(driver.rating)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            <span className="text-xs text-muted-foreground ml-1">
                              {driver.rating} of 5
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {driver.vehicleType}
                      </div>
                      <Image
                        src={`/lovable-uploads/f7188f69-9220-404d-ade2-87936e76061b.png`}
                        alt={driver.vehicleType}
                        className="h-10 w-auto object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-4">
                Upload Delivery Information
              </h3>
              <p className="text-muted-foreground mb-6">
                Upload a CSV file with delivery details or enter them manually
              </p>
              <div className="border-2 border-dashed rounded-lg p-12 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center">
                  <svg
                    className="h-12 w-12 text-muted-foreground mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    CSV, XLSX, or XML files up to 10MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-4">Generate Routes</h3>
              <p className="text-muted-foreground mb-6">
                Our system is optimizing routes for maximum efficiency
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                This may take a few moments...
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-4">Ready to Publish</h3>
              <p className="text-muted-foreground mb-6">
                Your routes have been optimized and are ready to publish
              </p>
              <div className="border rounded-lg p-6 mb-6">
                <div className="flex justify-between mb-4">
                  <div className="text-left">
                    <div className="text-sm text-muted-foreground">
                      Routes created
                    </div>
                    <div className="text-2xl font-bold">3</div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-muted-foreground">
                      Drivers assigned
                    </div>
                    <div className="text-2xl font-bold">
                      {selectedDrivers.length}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-muted-foreground">
                      Deliveries
                    </div>
                    <div className="text-2xl font-bold">24</div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="text-left">
                    <div className="text-muted-foreground">Estimated time</div>
                    <div className="font-medium">8h 45m</div>
                  </div>
                  <div className="text-left">
                    <div className="text-muted-foreground">Total distance</div>
                    <div className="font-medium">142.5 miles</div>
                  </div>
                  <div className="text-left">
                    <div className="text-muted-foreground">
                      Fuel consumption
                    </div>
                    <div className="font-medium">18.2 gallons</div>
                  </div>
                </div>
              </div>
              <p className="text-sm">
                Publishing will notify all drivers of their assigned routes and
                deliveries.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} className="mr-auto">
            Cancel
          </Button>
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button onClick={handleNext}>
            {step === 4 ? "Publish" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
