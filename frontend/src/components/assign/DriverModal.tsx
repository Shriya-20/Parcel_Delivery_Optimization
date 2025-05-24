import { DriverWithRatings } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
  
import { Separator } from "@radix-ui/react-separator";
import { Truck, User, Star, Phone, Mail, Car, Package} from "lucide-react";

// Driver Details Modal Component
interface DriverModalProps {
  driver: DriverWithRatings;
  isOpen: boolean;
  onClose: () => void;
}

export const DriverModal = ({ driver, isOpen, onClose }: DriverModalProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Driver Details
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {driver.first_name} {driver.last_name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Driver ID: <br /> {driver.driver_id}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {driver.rating || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{driver.phone_number || "Not provided"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{driver.email || "Not provided"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {driver.vehicles[0].type || "Not specified"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {driver.completed_deliveries || 0} deliveries completed
            </span>
          </div>

          {/* <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Badge
              variant={driver.status === "active" ? "default" : "secondary"}
            >
              {driver.status || "Unknown"}
            </Badge>
          </div> */}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
