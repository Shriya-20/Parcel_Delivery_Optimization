// import { Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useRouter,Stack } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { isAuthenticated, isMainLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isMainLoading && isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isMainLoading]);

  // Don't render auth screens if authenticated (will redirect)
  if (!isMainLoading && isAuthenticated) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
