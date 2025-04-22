import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, MessageSquare, Info, Camera, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { DeliveryMap } from "@/components/delivery-map"
import { DeliveryInfo } from "@/components/delivery-info"

export default function ActiveDelivery({ params }: { params: { id: string } }) {
  return (
    <div className="container px-4 py-6 pb-20 space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Active Delivery</h1>
          <p className="text-muted-foreground">{params.id}</p>
        </div>
      </div>

      <DeliveryMap />

      <div className="grid grid-cols-1 gap-4">
        <DeliveryInfo />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">John Smith</p>
                <p className="text-sm text-muted-foreground">123 Main St, Apt 4B</p>
              </div>
              <div className="flex space-x-2">
                <Button size="icon" variant="outline">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <p className="font-medium flex items-center">
                <Info className="h-4 w-4 mr-2 text-primary" />
                Delivery Instructions
              </p>
              <p className="text-sm mt-1">
                Please leave package at the front door. Ring doorbell upon delivery. Gate code: 1234.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-3">
          <Button className="flex-1" variant="outline">
            <Camera className="h-4 w-4 mr-2" />
            Proof of Delivery
          </Button>
          <Button className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Delivery
          </Button>
        </div>
      </div>
    </div>
  )
}
