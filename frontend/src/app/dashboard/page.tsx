"use client"
import DeliveryDashboard from "@/components/dashboard/fallbackDashboard";
// import { Dashboard } from "@/components/dashboard/Dashboard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* <Dashboard /> */}
      <DeliveryDashboard/>
    </DashboardLayout>
  );
}
