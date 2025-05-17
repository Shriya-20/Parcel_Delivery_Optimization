import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Clock, ThumbsUp, Star, Package } from "lucide-react"

export function PerformanceMetrics() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Customer Rating</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold">4.9</span>
                <span className="text-muted-foreground text-sm ml-1">/5</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>On-Time Rate</span>
              </div>
              <div className="font-bold">98%</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-primary" />
                <span>Successful Deliveries</span>
              </div>
              <div className="font-bold">99.5%</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ThumbsUp className="h-4 w-4 text-primary" />
                <span>Customer Compliments</span>
              </div>
              <div className="font-bold">32</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weekly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted rounded-md flex items-center justify-center">
            <div className="text-center">
              <BarChart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Performance Chart</p>
              <p className="text-xs text-muted-foreground">Deliveries and ratings over time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-md">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <span className="text-sm text-muted-foreground">Yesterday</span>
              </div>
              <p className="text-sm">"Very professional and friendly. Package was delivered safely and on time."</p>
            </div>

            <div className="p-3 bg-muted rounded-md">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <span className="text-sm text-muted-foreground">2 days ago</span>
              </div>
              <p className="text-sm">"Driver went above and beyond to ensure my package was delivered safely."</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
