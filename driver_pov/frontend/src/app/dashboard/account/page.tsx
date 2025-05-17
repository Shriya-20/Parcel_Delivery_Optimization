import { Button } from "@/components/ui/button"
import { User, Truck, BarChart, DollarSign, Settings, LogOut, Star } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PerformanceMetrics } from "@/components/performance-metrics"
import { EarningsInfo } from "@/components/earnings-info"
import { ProfileSettings } from "@/components/profile-settings"
import { VehicleInfo } from "@/components/vehicle-info"

export default function AccountPage() {
  return (
    <div className="container px-4 py-6 pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account</h1>
          <p className="text-muted-foreground">Manage your profile and settings</p>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Keerthan Kumar C</h2>
          <div className="flex items-center text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span>4.9 Rating</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="performance">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="performance">
            <BarChart className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="earnings">
            <DollarSign className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Earnings</span>
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="vehicle">
            <Truck className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Vehicle</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="performance">
          <PerformanceMetrics />
        </TabsContent>
        <TabsContent value="earnings">
          <EarningsInfo />
        </TabsContent>
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="vehicle">
          <VehicleInfo />
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button variant="outline" className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
