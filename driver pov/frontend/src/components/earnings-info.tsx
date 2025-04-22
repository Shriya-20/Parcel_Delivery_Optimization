import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function EarningsInfo() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Earnings Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="week">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
            <TabsContent value="week" className="pt-4">
              <div className="text-center mb-4">
                <p className="text-muted-foreground">Total Earnings</p>
                <h3 className="text-3xl font-bold">$842.50</h3>
                <p className="text-xs text-green-600 flex items-center justify-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  12% from last week
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">Deliveries</p>
                  <p className="font-bold">68</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">Avg. Per Delivery</p>
                  <p className="font-bold">$12.39</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">Tips</p>
                  <p className="font-bold">$124.50</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">Hours</p>
                  <p className="font-bold">32.5</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="month" className="pt-4">
              <div className="text-center mb-4">
                <p className="text-muted-foreground">Total Earnings</p>
                <h3 className="text-3xl font-bold">$3,245.75</h3>
                <p className="text-xs text-green-600 flex items-center justify-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  8% from last month
                </p>
              </div>
            </TabsContent>
            <TabsContent value="year" className="pt-4">
              <div className="text-center mb-4">
                <p className="text-muted-foreground">Total Earnings</p>
                <h3 className="text-3xl font-bold">$38,642.30</h3>
                <p className="text-xs text-green-600 flex items-center justify-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  15% from last year
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border-b">
              <div>
                <p className="font-medium">Weekly Payment</p>
                <p className="text-sm text-muted-foreground">April 15, 2025</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$845.32</p>
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Receipt
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border-b">
              <div>
                <p className="font-medium">Weekly Payment</p>
                <p className="text-sm text-muted-foreground">April 8, 2025</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$792.18</p>
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Receipt
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border-b">
              <div>
                <p className="font-medium">Weekly Payment</p>
                <p className="text-sm text-muted-foreground">April 1, 2025</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$812.45</p>
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Receipt
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
