import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Weight } from "lucide-react"

export function DeliveryInfo() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Package Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Standard Package</p>
              <p className="text-sm text-muted-foreground">Tracking: PKG-9876543</p>
            </div>
          </div>
          <Badge>Priority</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
            <Weight className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Weight</p>
              <p className="font-medium">3.2 lbs</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
            <Package className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Size</p>
              <p className="font-medium">Medium</p>
            </div>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground">Special Handling</p>
          <p>Fragile - Handle with care</p>
        </div>
      </CardContent>
    </Card>
  )
}
