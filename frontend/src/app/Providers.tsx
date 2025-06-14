"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { Toaster } from "@/components/ui/toaster";
import { Toaster } from "sonner";
import { useState } from "react";
import { AuthProvider } from "@/context/AuthContext"; // Adjust path as needed
import AuthGuard from "@/context/AuthGuard"; // Adjust path as needed

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a client for each request to prevent data sharing between users
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
              border: "1px solid hsl(var(--border))",
            },
          }}
        />
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
        {/* <Sonner /> */}
        {/* {children} */}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
