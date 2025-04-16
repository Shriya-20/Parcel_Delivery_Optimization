"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

export function BillingSettings() {
//   const { toast } = useToast();

  const handleSave = () => {
    toast.success("Billing information updated",{
      description: "Your billing information has been saved.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>
          Manage your subscription and payment methods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md border p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">Current Plan</h3>
              <p className="text-sm text-muted-foreground">Professional Plan</p>
            </div>
            <div className="text-right">
              <p className="font-medium">$49.99/month</p>
              <p className="text-sm text-muted-foreground">
                Renews on May 15, 2025
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm">
              Upgrade Plan
            </Button>
            <Button variant="outline" size="sm">
              Cancel Subscription
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Payment Methods</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-md border p-4">
              <div className="flex items-center space-x-4">
                <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="24" rx="4" fill="#E3F2FD" />
                    <path d="M5 12H19" stroke="#2196F3" strokeWidth="2" />
                    <path d="M5 7H19" stroke="#2196F3" strokeWidth="2" />
                    <path d="M5 17H19" stroke="#2196F3" strokeWidth="2" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-muted-foreground">
                    Expires 04/2027
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-4">
            Add Payment Method
          </Button>
        </div>

        <div>
          <h3 className="font-medium mb-2">Billing Address</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="billing-name">Full Name</Label>
              <Input id="billing-name" defaultValue="Benjamin Rodriguez" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-company">Company Name</Label>
              <Input id="billing-company" defaultValue="QuickDrop Logistics" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-address">Address</Label>
              <Input id="billing-address" defaultValue="123 Delivery St" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-city">City</Label>
              <Input id="billing-city" defaultValue="New York" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-state">State</Label>
              <Input id="billing-state" defaultValue="NY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-zip">ZIP Code</Label>
              <Input id="billing-zip" defaultValue="10001" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save Billing Information</Button>
      </CardFooter>
    </Card>
  );
}
