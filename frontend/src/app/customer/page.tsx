import { Customer } from '@/components/customer/Customer'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import React from 'react'

const page = () => {
  return (
    <DashboardLayout>
      <Customer/>
    </DashboardLayout>
  )
}

export default page
