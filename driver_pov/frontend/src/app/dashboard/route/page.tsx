import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"
import { RouteList } from "@/components/route-list"

export default function RoutePage() {
  return (
    <div className="container px-4 py-6 pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Route Overview</h1>
          <p className="text-muted-foreground">Today, April 22</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Today's Deliveries</span>
            <Badge variant="outline">15 Total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RouteList />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline">Request Route Change</Button>
      </div>
    </div>
  )
}
