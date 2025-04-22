import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DeliveryQueue } from "@/components/delivery-queue"
import { DailySummary } from "@/components/daily-summary"
import { WeatherAlert } from "@/components/weather-alert"

export default function Dashboard() {
  return (
    <div className="container px-4 py-6 pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Alex</p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="status" defaultChecked />
          <Label htmlFor="status">Available</Label>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Current Delivery Queue</span>
            <Badge variant="outline" className="ml-2">
              5 Packages
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DeliveryQueue />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <WeatherAlert />
        <DailySummary />
      </div>
    </div>
  )
}
