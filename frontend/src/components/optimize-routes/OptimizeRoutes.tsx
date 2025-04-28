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
// import { mockParcels } from "@/lib/mock-data";

// Mock drivers data
const mockDrivers = [
  { id: "d1", name: "Alex Johnson" },
  { id: "d2", name: "Maria Garcia" },
  { id: "d3", name: "James Smith" },
  { id: "d4", name: "Sarah Williams" },
];

// Mock routes for demo
const mockRoutes: Record<string, { id: string; address: string; timeSlot: string }[]> = {
  d1: [
    {
      id: "P-1234",
      address: "123 Main St, New York, NY",
      timeSlot: "9:00 - 10:00",
    },
    {
      id: "P-2345",
      address: "456 Broadway, New York, NY",
      timeSlot: "10:00 - 11:00",
    },
    {
      id: "P-3456",
      address: "789 5th Ave, New York, NY",
      timeSlot: "11:00 - 12:00",
    },
    {
      id: "P-4567",
      address: "101 Park Ave, New York, NY",
      timeSlot: "13:00 - 14:00",
    },
  ],
  d2: [
    {
      id: "P-5678",
      address: "202 Madison Ave, New York, NY",
      timeSlot: "9:00 - 10:00",
    },
    {
      id: "P-6789",
      address: "303 Lexington Ave, New York, NY",
      timeSlot: "10:00 - 11:00",
    },
    {
      id: "P-7890",
      address: "404 3rd Ave, New York, NY",
      timeSlot: "14:00 - 15:00",
    },
  ],
  d3: [
    {
      id: "P-8901",
      address: "505 7th Ave, New York, NY",
      timeSlot: "11:00 - 12:00",
    },
    {
      id: "P-9012",
      address: "606 8th Ave, New York, NY",
      timeSlot: "13:00 - 14:00",
    },
  ],
  d4: [
    {
      id: "P-0123",
      address: "707 9th Ave, New York, NY",
      timeSlot: "15:00 - 16:00",
    },
    {
      id: "P-1235",
      address: "808 10th Ave, New York, NY",
      timeSlot: "16:00 - 17:00",
    },
    {
      id: "P-2346",
      address: "909 11th Ave, New York, NY",
      timeSlot: "17:00 - 18:00",
    },
  ],
};

export function OptimizeRoutes() {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [optimized, setOptimized] = useState(false);
  const [routes, setRoutes] = useState<{ id: string; address: string; timeSlot: string }[]>([]);

  const handleSelectDriver = (driverId: string) => {
    setSelectedDriver(driverId);
    // Load the driver's assigned deliveries
    setRoutes(mockRoutes[driverId as keyof typeof mockRoutes] || []);
    setOptimized(false);
  };

  const handleOptimizeRoute = () => {
    if (!selectedDriver) return;

    toast.success(
      `Route optimized for ${
        mockDrivers.find((d) => d.id === selectedDriver)?.name
      }`
    );

    // In a real app, we'd call an API to optimize the route
    // For this demo, we'll just shuffle the routes to simulate optimization
    setRoutes([...routes].sort(() => Math.random() - 0.5));
    setOptimized(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Optimize Routes</h1>
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
                  Optimize Route
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
                    /* In a real app, this would be a map component showing the route */
                    <svg
                      width="100%"
                      height="100%"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <line x1="0" y1="0" x2="100" y2="100" stroke="#e2e2e2" />
                      <line x1="100" y1="0" x2="0" y2="100" stroke="#e2e2e2" />
                      <line x1="50" y1="0" x2="50" y2="100" stroke="#e2e2e2" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e2e2" />

                      {optimized &&
                        routes.map((stop, index) => {
                          const x = 10 + index * (80 / routes.length);
                          return (
                            <g key={stop.id}>
                              {index > 0 && (
                                <line
                                  x1={10 + (index - 1) * (80 / routes.length)}
                                  y1="50"
                                  x2={x}
                                  y2="50"
                                  stroke="#4CAF50"
                                  strokeWidth="2"
                                  strokeDasharray="4"
                                />
                              )}
                              <circle cx={x} cy="50" r="3" fill="#4CAF50" />
                              <text
                                x={x}
                                y="45"
                                fontSize="3"
                                textAnchor="middle"
                                fill="#333"
                              >
                                {index + 1}
                              </text>
                            </g>
                          );
                        })}
                    </svg>
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
                          <th className="text-left p-3 text-sm">
                            {optimized ? "Stop" : "ID"}
                          </th>
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
                              {optimized ? (
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                  {index + 1}
                                </div>
                              ) : (
                                stop.id
                              )}
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
