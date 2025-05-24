import { Customer } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
  
import { Separator } from "@radix-ui/react-separator";
import { User, Phone, Mail, MapPin } from "lucide-react";


// Customer Details Modal Component
interface CustomerModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerModal = ({ customer, isOpen, onClose }: CustomerModalProps) => (
  <Dialog open={isOpen} onOpenChange={onClose} >
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Customer Details
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {customer.first_name} {customer.last_name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Customer ID: {customer.customer_id}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{customer.phone_number || "Not provided"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{customer.email || "Not provided"}</span>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Address:</p>
              <p className="text-muted-foreground">
                {customer.address || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);