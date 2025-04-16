"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  // const { toast } = useToast();

  const handleSave = () => {
    toast.success("Notification settings saved",{
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for delivery updates
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your devices
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive text messages for important updates
              </p>
            </div>
            <Switch
              id="sms-notifications"
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Notification Types</h3>
          <p className="text-sm text-muted-foreground">
            Select which events you want to be notified about
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="delivery-updates" defaultChecked />
              <Label htmlFor="delivery-updates">Delivery Status Updates</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="driver-assignments" defaultChecked />
              <Label htmlFor="driver-assignments">Driver Assignments</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="new-orders" defaultChecked />
              <Label htmlFor="new-orders">New Orders</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="delivery-exceptions" defaultChecked />
              <Label htmlFor="delivery-exceptions">Delivery Exceptions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="billing-updates" />
              <Label htmlFor="billing-updates">Billing Updates</Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
}
