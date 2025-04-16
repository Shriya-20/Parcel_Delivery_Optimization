"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockParcels } from "@/lib/mock-data";
import { ParcelCard } from "./ParcelCard";
import { MapView } from "./Mapview";
import { CreateRouteDialog } from "./CreateRouteDialog";

export  function Tracking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateRouteDialog, setShowCreateRouteDialog] = useState(false);

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

  const onRouteParcels = filteredParcels.filter((p) => p.status === "on-route");
  const waitingParcels = filteredParcels.filter((p) => p.status === "waiting");
  const canceledParcels = filteredParcels.filter(
    (p) => p.status === "canceled"
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Tracking</h1>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search parcels..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowCreateRouteDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Route
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
        <div className="md:col-span-2 overflow-auto">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All {filteredParcels.length}
              </TabsTrigger>
              <TabsTrigger value="on-route">
                On route {onRouteParcels.length}
              </TabsTrigger>
              <TabsTrigger value="waiting">
                Waiting {waitingParcels.length}
              </TabsTrigger>
              <TabsTrigger value="canceled">
                Canceled {canceledParcels.length}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mr-3">
              {filteredParcels.map((parcel) => (
                <ParcelCard key={parcel.id} parcel={parcel} />
              ))}
            </TabsContent>

            <TabsContent value="on-route" className="space-y-4 mr-3">
              {onRouteParcels.map((parcel) => (
                <ParcelCard key={parcel.id} parcel={parcel} />
              ))}
            </TabsContent>

            <TabsContent value="waiting" className="space-y-4 mr-3">
              {waitingParcels.map((parcel) => (
                <ParcelCard key={parcel.id} parcel={parcel} />
              ))}
            </TabsContent>

            <TabsContent value="canceled" className="space-y-4 mr-3">
              {canceledParcels.map((parcel) => (
                <ParcelCard key={parcel.id} parcel={parcel} />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-3 bg-muted/30 rounded-lg overflow-hidden">
          <MapView parcels={filteredParcels} />
        </div>
      </div>

      <CreateRouteDialog
        open={showCreateRouteDialog}
        onClose={() => setShowCreateRouteDialog(false)}
      />
    </div>
  );
}
