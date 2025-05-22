"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
// import { mockParcels } from "@/lib/mock-data";
import { MapView } from "./Mapview";
import Image from "next/image";
// import io from "socket.io-client";

// const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL as string);

// Mock drivers data (in a real application, this would come from an API)
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
type Driver = {
  id: string;
  name: string;
  status: string;
  location: { lat: number; lng: number };
  vehicle: string;
  currentDelivery: string | null;
  avatar: string;
  rating: number;
  deliveriesCompleted: number;
  phone: string;
};

export function Tracking() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter drivers based on search query
  const filteredDrivers = searchQuery
    ? mockDrivers.filter(
        (driver) =>
          driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockDrivers;

  const activeDrivers = filteredDrivers.filter((d) => d.status === "active");
  const inactiveDrivers = filteredDrivers.filter(
    (d) => d.status === "inactive" || d.status === "break"
  );

  //for now we are just updating mock data else we load the data from api and maintain state and then we update that state
  // useEffect(()=>{
  //   socket.on("location_update", (data) => {
  //     console.log(data);
  //     const updatedDriver = mockDrivers.find((driver) => driver.id === data.driverId);
  //     if (updatedDriver) {
  //       updatedDriver.location = {
  //         lat: data.latitude,
  //         lng: data.longitude,
  //       };
  //     }
  //     filteredDrivers.forEach((driver) => {
  //       if (driver.id === data.driverId) {
  //         driver.location = {
  //           lat: data.latitude,
  //           lng: data.longitude,
  //         };
  //       }
  //     });
  //   });
  // },[filteredDrivers]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col  gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Driver Tracking</h1>
          <p className="text-sm muted-foreground">
            Track your drivers in <span className="font-bold">real-time</span>{" "}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search drivers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
        <div className="md:col-span-2 overflow-auto">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All {filteredDrivers.length}
              </TabsTrigger>
              <TabsTrigger value="active">
                Active {activeDrivers.length}
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive {inactiveDrivers.length}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mr-3">
              {filteredDrivers.map((driver) => (
                <DriverCard key={driver.id} driver={driver} />
              ))}
            </TabsContent>

            <TabsContent value="active" className="space-y-4 mr-3">
              {activeDrivers.map((driver) => (
                <DriverCard key={driver.id} driver={driver} />
              ))}
            </TabsContent>

            <TabsContent value="inactive" className="space-y-4 mr-3">
              {inactiveDrivers.map((driver) => (
                <DriverCard key={driver.id} driver={driver} />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-3 bg-muted/30 rounded-lg overflow-hidden">
          <MapView drivers={filteredDrivers} />
        </div>
      </div>
    </div>
  );
}

function DriverCard({ driver }: { driver: Driver }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
          <Image
            src={driver.avatar}
            alt={driver.name}
            className="h-full w-full object-cover"
            width={48}
            height={48}
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-medium">{driver.name}</h3>
            <div
              className={`px-2 py-1 text-xs rounded-full ${
                driver.status === "active"
                  ? "bg-green-100 text-green-800"
                  : driver.status === "break"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {driver.status === "active"
                ? "Active"
                : driver.status === "break"
                ? "On Break"
                : "Inactive"}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Vehicle: {driver.vehicle}
          </div>
          <div className="text-sm text-muted-foreground">
            Current Delivery: {driver.currentDelivery || "None"}
          </div>
          <div className="mt-2 flex items-center text-sm">
            <div className="flex items-center">
              <span className="text-amber-500 mr-1">★</span>
              <span>{driver.rating}</span>
            </div>
            <span className="mx-2">•</span>
            <span>{driver.deliveriesCompleted} deliveries</span>
          </div>
        </div>
      </div>
    </Card>
  );
}