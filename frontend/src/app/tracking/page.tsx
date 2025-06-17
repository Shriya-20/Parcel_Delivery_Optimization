"use client";
// import { Tracking } from "@/components/tracking/Tracking";
import {Tracking} from "@/components/tracking/LiveTracking"
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function TrackingPage() {
  return (
    <DashboardLayout>
      {/* <Tracking /> */}
      <Tracking />
    </DashboardLayout>
  );
}
