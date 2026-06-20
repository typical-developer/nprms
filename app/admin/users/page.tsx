'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { UsersTable } from '@/components/nprms/admin/users-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function UsersPage() {
  return (
    <AuthLayout title="Users" requiredRole="administrator">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage police station personnel and access</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        <UsersTable />
      </div>
    </AuthLayout>
  )
}
