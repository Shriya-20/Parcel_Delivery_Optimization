"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Route } from "lucide-react";

// Mock drivers data
const mockDrivers = [
  { id: "d1", name: "Keerthan Kumar C" },
  { id: "d2", name: "Shriya Bhat" },
  { id: "d3", name: "Bhanu Shashank" },
  { id: "d4", name: "Santhosh" },
];

// Mock routes for demo (Udupi addresses)
const mockRoutes: Record<
  string,
  { id: string; address: string; timeSlot: string }[]
> = {
  d1: [
    {
      id: "P-1234",
      address: "Manipal Institute of Technology, Udupi, Karnataka",
      timeSlot: "9:00 - 10:00",
    },
    {
      id: "P-2345",
      address: "End Point Road, Udupi, Karnataka",
      timeSlot: "10:00 - 11:00",
    },
    {
      id: "P-3456",
      address: "KMC Hospital, Manipal, Udupi, Karnataka",
      timeSlot: "11:00 - 12:00",
    },
    {
      id: "P-4567",
      address: "MIT Library, Manipal, Udupi, Karnataka",
      timeSlot: "13:00 - 14:00",
    },
  ],
  d2: [
    {
      id: "P-5678",
      address: "Manipal Lake, Udupi, Karnataka",
      timeSlot: "9:00 - 10:00",
    },
    {
      id: "P-6789",
      address: "Indrali Railway Station, Udupi, Karnataka",
      timeSlot: "10:00 - 11:00",
    },
    {
      id: "P-7890",
      address: "Udupi Bus Stand, Udupi, Karnataka",
      timeSlot: "14:00 - 15:00",
    },
  ],
  d3: [
    {
      id: "P-8901",
      address: "DC Office, Udupi, Karnataka",
      timeSlot: "11:00 - 12:00",
    },
    {
      id: "P-9012",
      address: "Sri Krishna Temple, Udupi, Karnataka",
      timeSlot: "13:00 - 14:00",
    },
  ],
  d4: [
    {
      id: "P-0123",
      address: "MIT Ground, Udupi, Karnataka",
      timeSlot: "15:00 - 16:00",
    },
    {
      id: "P-1235",
      address: "Tiger Circle, Udupi, Karnataka",
      timeSlot: "16:00 - 17:00",
    },
    {
      id: "P-2346",
      address: "Manipal Lake View, Udupi, Karnataka",
      timeSlot: "17:00 - 18:00",
    },
  ],
};

export function OptimizeRoutes() {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [optimized, setOptimized] = useState(true); // default is Optimized
  const [routes, setRoutes] = useState<
    { id: string; address: string; timeSlot: string }[]
  >([]);

  const handleSelectDriver = (driverId: string) => {
    setSelectedDriver(driverId);
    setRoutes(mockRoutes[driverId as keyof typeof mockRoutes] || []);
    setOptimized(true); // reset to optimized view
  };

  const handleOptimizeRoute = () => {
    if (!selectedDriver) return;

    toast.success(
      `Route re-optimized for ${
        mockDrivers.find((d) => d.id === selectedDriver)?.name
      }`
    );

    // Shuffle to simulate re-optimization
    setRoutes([...routes].sort(() => Math.random() - 0.5));
    setOptimized(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Optimize Routes</h1>
          <p className="text-sm text-foreground">
            View the <span className="font-bold">Optimized Routes</span> for
            your drivers (Assign the drivers first).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Route Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Driver</label>
                  <Select
                    onValueChange={handleSelectDriver}
                    value={selectedDriver || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDrivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full gap-2"
                  onClick={handleOptimizeRoute}
                  disabled={!selectedDriver || routes.length === 0}
                >
                  <Route className="h-4 w-4" />
                  Re-optimize Route
                </Button>

                {selectedDriver && routes.length > 0 && (
                  <div className="border rounded-md p-4 bg-muted/30">
                    <h3 className="font-medium mb-2">Route Summary</h3>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        Driver:{" "}
                        {mockDrivers.find((d) => d.id === selectedDriver)?.name}
                      </p>
                      <p>Deliveries: {routes.length}</p>
                      <p>Status: {optimized ? "Optimized" : "Not optimized"}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-rows-2 gap-6 h-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Route Map</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[300px]">
                <div className="h-full w-full bg-[#f2f5f7] relative">
                  {!selectedDriver ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Select a driver to view their route
                    </div>
                  ) : routes.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No deliveries assigned to this driver
                    </div>
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(
                        routes[0].address
                      )}&destination=${encodeURIComponent(
                        routes[routes.length - 1].address
                      )}&waypoints=${routes
                        .slice(1, -1)
                        .map((r) => encodeURIComponent(r.address))
                        .join("|")}`}
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Delivery Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[300px] overflow-auto">
                  {routes.length === 0 ? (
                    <div className="flex items-center justify-center h-[100px] text-muted-foreground">
                      No deliveries to display
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="text-left p-3 text-sm">Stop</th>
                          <th className="text-left p-3 text-sm">
                            Delivery Address
                          </th>
                          <th className="text-left p-3 text-sm">Time Slot</th>
                        </tr>
                      </thead>
                      <tbody>
                        {routes.map((stop, index) => (
                          <tr
                            key={stop.id}
                            className="border-b last:border-b-0"
                          >
                            <td className="p-3">
                              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                {index + 1}
                              </div>
                            </td>
                            <td className="p-3">{stop.address}</td>
                            <td className="p-3">{stop.timeSlot}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
