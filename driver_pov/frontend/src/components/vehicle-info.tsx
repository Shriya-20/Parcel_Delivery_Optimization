import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function VehicleInfo() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select defaultValue="sedan">
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input id="make" defaultValue="Toyota" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" defaultValue="Camry" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" defaultValue="2022" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input id="color" defaultValue="Silver" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input id="licensePlate" defaultValue="ABC-1234" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Driver's License</p>
                  <p className="text-sm text-muted-foreground">Expires: 06/15/2027</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Vehicle Insurance</p>
                  <p className="text-sm text-muted-foreground">Expires: 09/30/2025</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Vehicle Registration</p>
                  <p className="text-sm text-muted-foreground">Expires: 11/15/2025</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-md flex items-start space-x-3 mb-4 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Maintenance Reminder</p>
              <p className="text-sm">Oil change recommended in 500 miles or 2 weeks.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border-b">
              <div>
                <p className="font-medium">Oil Change</p>
                <p className="text-sm text-muted-foreground">Last: March 10, 2025</p>
              </div>
              <Button variant="outline" size="sm">
                Log
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border-b">
              <div>
                <p className="font-medium">Tire Rotation</p>
                <p className="text-sm text-muted-foreground">Last: February 22, 2025</p>
              </div>
              <Button variant="outline" size="sm">
                Log
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border-b">
              <div>
                <p className="font-medium">Brake Inspection</p>
                <p className="text-sm text-muted-foreground">Last: January 15, 2025</p>
              </div>
              <Button variant="outline" size="sm">
                Log
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
