'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { CasesTable } from '@/components/nprms/shared/cases-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function AdminCasesPage() {
  return (
    <AuthLayout title="Cases" requiredRole="administrator">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">All Cases</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor all police cases</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Case
          </Button>
        </div>

        <CasesTable rolePrefix="admin" />
      </div>
    </AuthLayout>
  )
}
