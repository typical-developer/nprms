'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { Sidebar } from '@/components/nprms/sidebar'
import { useAuth } from '@/lib/auth-context'
import React from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  if (!user || user.role !== 'administrator') {
    return null
  }

  return (
    <AuthLayout requiredRole="administrator" title="Administrator">
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto ml-64 lg:ml-64">
          <div className="p-6 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </AuthLayout>
  )
}
