import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, DollarSign, TrendingUp } from "lucide-react"

export function DailySummary() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Daily Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
            <Package className="h-5 w-5 text-primary mb-1" />
            <span className="text-xl font-bold">12</span>
            <span className="text-xs text-muted-foreground">Deliveries</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
            <DollarSign className="h-5 w-5 text-primary mb-1" />
            <span className="text-xl font-bold">$142</span>
            <span className="text-xs text-muted-foreground">Earnings</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
            <Clock className="h-5 w-5 text-primary mb-1" />
            <span className="text-xl font-bold">5.2</span>
            <span className="text-xs text-muted-foreground">Hours</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
            <TrendingUp className="h-5 w-5 text-primary mb-1" />
            <span className="text-xl font-bold">98%</span>
            <span className="text-xs text-muted-foreground">On-time</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
