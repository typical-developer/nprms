'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { RecordsStatsCards } from '@/components/nprms/records/stats-cards'
import { AllCasesList } from '@/components/nprms/records/all-cases-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function RecordsDashboard() {
  return (
    <AuthLayout title="Dashboard" requiredRole="records">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Cases Database</h1>
            <p className="text-muted-foreground mt-1">Manage and track all registered cases</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Register New Case
          </Button>
        </div>

        <RecordsStatsCards />

        <AllCasesList />
      </div>
    </AuthLayout>
  )
}
