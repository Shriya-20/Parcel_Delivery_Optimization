"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Navigation, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Active",
    href: "/dashboard/active",
    icon: Navigation,
  },
  {
    name: "Route",
    href: "/dashboard/route",
    icon: MapPin,
  },
  {
    name: "Account",
    href: "/dashboard/account",
    icon: User,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div className="grid h-full grid-cols-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center",
              pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
