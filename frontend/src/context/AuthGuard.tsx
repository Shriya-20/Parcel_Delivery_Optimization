"use client";

import { useAuth } from "@/context/AuthContext"; // Adjust path as needed
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isMainLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/login"];

  // Define routes that authenticated users shouldn't access
  const authRoutes = ["/", "/login"];

  useEffect(() => {
    // Don't do anything while loading
    if (isMainLoading) return;

    const isPublicRoute = publicRoutes.includes(pathname);
    const isAuthRoute = authRoutes.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      // User is not authenticated and trying to access a protected route
      router.push("/login");
    } else if (isAuthenticated && isAuthRoute) {
      // User is authenticated and trying to access auth routes (login/home)
      router.push("/dashboard");
    }
  }, [isAuthenticated, isMainLoading, pathname, router]);

  // Show loading while checking authentication
  if (isMainLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // For protected routes, only render if authenticated
  if (!publicRoutes.includes(pathname) && !isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // For auth routes, only render if not authenticated
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
