"use client";
import { Orders } from "@/components/orders/Orders";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <Orders />
    </DashboardLayout>
  );
}
