import { CloudRain } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function WeatherAlert() {
  return (
    <Alert
      variant="destructive"
      className="bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900"
    >
      <CloudRain className="h-4 w-4" />
      <AlertTitle>Weather Alert</AlertTitle>
      <AlertDescription>Heavy rain expected on your route between 2-4 PM. Plan accordingly.</AlertDescription>
    </Alert>
  )
}
