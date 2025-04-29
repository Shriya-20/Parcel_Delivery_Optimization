"use client"
import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDrivers } from "@/lib/mock-data";
import { Driver } from "@/lib/types";
import Image from "next/image";

export function Carriers() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDrivers = searchQuery
    ? mockDrivers.filter(
        (driver) =>
          driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockDrivers;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Carriers</h1>
          <p className="text-muted-foreground">
            Manage your drivers and vehicles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search carriers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Filter by availability</DropdownMenuItem>
              <DropdownMenuItem>Filter by vehicle type</DropdownMenuItem>
              <DropdownMenuItem>Filter by rating</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Driver
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Drivers</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="busy">Busy</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers
              .filter((driver) => driver.status === "active")
              .map((driver) => (
                <DriverCard key={driver.id} driver={driver} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="busy" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers
              .filter((driver) => driver.status === "inactive")
              .map((driver) => (
                <DriverCard key={driver.id} driver={driver} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DriverCard({ driver }: { driver: Driver }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Image
              src={driver.avatar}
              alt={driver.name}
              className="h-12 w-12 rounded-full object-cover"
              width={48}
              height={48}
            />
            <div>
              <h3 className="font-medium">{driver.name}</h3>
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
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              driver.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {driver.status === "active" ? "Available" : "Busy"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-muted-foreground">Vehicle Type</p>
            <p className="font-medium capitalize">{driver.vehicle}</p>
          </div>
          <div>
            <p className="text-muted-foreground">License</p>
            <p className="font-medium">CDL-{driver.id.slice(-4)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Completed Deliveries</p>
            <p className="font-medium">
              {Math.floor(Math.random() * 500) + 100}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Join Date</p>
            <p className="font-medium">
              {new Date(
                Date.now() - Math.floor(Math.random() * 10000000000)
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            Profile
          </Button>
          {/* <Button variant="outline" size="sm" className="flex-1">
            Assign
          </Button> */}
          <Button size="sm" className="flex-1">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
