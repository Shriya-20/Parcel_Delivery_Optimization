"use client";

import { Parcel } from "@/lib/types";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
interface ParcelCardProps {
  parcel: Parcel;
}

export function ParcelCard({ parcel }: ParcelCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-route":
        return "bg-status-onroute text-white";
      case "waiting":
        return "bg-status-waiting text-black";
      case "canceled":
        return "bg-status-canceled text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const statusColor = getStatusColor(parcel.status);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-sm text-muted-foreground">ID {parcel.id}</div>
            <div className="font-medium">{parcel.type}</div>
          </div>
          <div className={cn("text-xs px-2 py-1 rounded-full", statusColor)}>
            {parcel.status === "on-route"
              ? "On route"
              : parcel.status === "waiting"
              ? "Waiting"
              : "Canceled"}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-1">
            <Image
              src={parcel.vehicle?.image || "/carrier2.jpeg"}
              alt={parcel.vehicle?.type || "vehicle"}
              className="w-full h-auto object-contain"
              width={100}
              height={100}
            />
          </div>
          <div className="col-span-4 flex flex-col text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium">Pickup</div>
                <div className="text-muted-foreground">
                  {parcel.pickupAddress}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 mt-3">
              <MapPin className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium">Delivery</div>
                <div className="text-muted-foreground">
                  {parcel.deliveryAddress}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
