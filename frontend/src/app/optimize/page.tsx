import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { OptimizeRoutes } from '@/components/optimize-routes/OptimizeRoutes'
import React from 'react'

const page = () => {
  return (
    <DashboardLayout>
        <OptimizeRoutes/>
    </DashboardLayout>
  )
}

export default page
