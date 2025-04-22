import { Card } from "@/components/ui/card"

export function DeliveryMap() {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Interactive Map</p>
            <p className="text-xs text-muted-foreground">Turn-by-turn navigation</p>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-background p-2 rounded-md shadow-sm text-sm">
            <p className="font-medium">123 Main St, Apt 4B</p>
            <p className="text-muted-foreground text-xs">Estimated arrival: 10 minutes</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
