"use client";
import { useState } from "react";
import { Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockParcels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Parcel } from "@/lib/types";

export function Orders() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParcels = searchQuery
    ? mockParcels.filter(
        (parcel) =>
          parcel.id.includes(searchQuery) ||
          parcel.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          parcel.pickupAddress
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          parcel.deliveryAddress
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : mockParcels;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground">View and manage all orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
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
              <DropdownMenuItem>Filter by status</DropdownMenuItem>
              <DropdownMenuItem>Filter by date</DropdownMenuItem>
              <DropdownMenuItem>Filter by type</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParcels.map((parcel) => (
              <OrderRow key={parcel.id} parcel={parcel} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function OrderRow({ parcel }: { parcel: Parcel }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-route":
        return "bg-green-100 text-green-800";
      case "waiting":
        return "bg-amber-100 text-amber-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusColor = getStatusColor(parcel.status);
  const date = new Date(
    Date.now() - Math.floor(Math.random() * 10000000000)
  ).toLocaleDateString();

  return (
    <TableRow>
      <TableCell className="font-medium">{parcel.id}</TableCell>
      <TableCell>{parcel.type}</TableCell>
      <TableCell className="max-w-[200px] truncate">
        {parcel.pickupAddress}
      </TableCell>
      <TableCell className="max-w-[200px] truncate">
        {parcel.deliveryAddress}
      </TableCell>
      <TableCell>
        <span className={cn("text-xs px-2 py-1 rounded-full", statusColor)}>
          {parcel.status === "on-route"
            ? "On route"
            : parcel.status === "waiting"
            ? "Waiting"
            : "Canceled"}
        </span>
      </TableCell>
      <TableCell>{date}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm">
          View
        </Button>
      </TableCell>
    </TableRow>
  );
}
