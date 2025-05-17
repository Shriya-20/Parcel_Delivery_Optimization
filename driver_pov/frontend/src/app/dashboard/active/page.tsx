"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Package, Search, Scan } from "lucide-react";
import { RecentDeliveries } from "@/components/recent-deliveries";

export default function ActiveDeliveryPage() {
  const router = useRouter();
  const [deliveryId, setDeliveryId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryId.trim()) {
      setError("Please enter a delivery ID");
      return;
    }

    // Validate delivery ID format (example: DEL-1234)
    const deliveryIdRegex = /^DEL-\d{4}$/;
    if (!deliveryIdRegex.test(deliveryId)) {
      setError("Please enter a valid delivery ID (format: DEL-1234)");
      return;
    }

    // Navigate to the specific delivery page
    router.push(`/dashboard/active/${deliveryId}`);
  };

  return (
    <div className="container px-4 py-6 pb-20 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Active Delivery</h1>
        <p className="text-muted-foreground">
          Track and manage your current deliveries
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-primary" />
            Enter Delivery ID
          </CardTitle>
          <CardDescription>
            Enter the delivery ID to view details and track the package
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryId">Delivery ID</Label>
              <div className="flex space-x-2">
                <Input
                  id="deliveryId"
                  placeholder="DEL-1234"
                  value={deliveryId}
                  onChange={(e) => {
                    setDeliveryId(e.target.value);
                    setError("");
                  }}
                  className={error ? "border-destructive" : ""}
                />
                <Button type="button" variant="outline" size="icon">
                  <Scan className="h-4 w-4" />
                </Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
          <Button onClick={handleSubmit}>
            <Search className="h-4 w-4 mr-2" />
            Find Delivery
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
          <CardDescription>
            Quick access to your recent deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentDeliveries />
        </CardContent>
      </Card>

      {/* <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
        <div>
          <h3 className="font-medium">Need to scan a package?</h3>
          <p className="text-sm text-muted-foreground">
            Use our barcode scanner for quick access
          </p>
        </div>
        <Button variant="secondary">
          <Scan className="h-4 w-4 mr-2" />
          Open Scanner
        </Button>
      </div> */}
    </div>
  );
}
