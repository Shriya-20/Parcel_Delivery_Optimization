import { Stack } from "expo-router";
import "./globals.css"
export default function RootLayout() {
  return <Stack >
    {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
    <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
    </Stack>;
}
