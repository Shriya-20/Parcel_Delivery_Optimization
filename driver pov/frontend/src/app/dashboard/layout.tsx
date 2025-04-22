import { MobileNav } from '@/components/mobile-nav'
import React from 'react'

const layout = ({
    children,
}:{
    children: React.ReactNode
}) => {
  return (
    <>
    {children}
    <MobileNav/>
    </>
  )
}

export default layout
