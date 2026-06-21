'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { Sidebar } from '@/components/nprms/sidebar'
import { MobileNav } from '@/components/nprms/mobile-nav'
import { useAuth } from '@/lib/auth-context'
import React from 'react'

export default function RecordsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  if (!user || user.role !== 'records') {
    return null
  }

  return (
    <AuthLayout requiredRole="records" title="Records Officer">
      <div className="flex h-screen bg-background">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto lg:ml-64 flex flex-col">
          <MobileNav />
          <div className="p-6 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </AuthLayout>
  )
}
