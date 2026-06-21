'use client'

import { OfficerStatsCards } from '@/components/nprms/officer/stats-cards'
import { MyCases } from '@/components/nprms/officer/my-cases'
import { CaseTimeline } from '@/components/nprms/officer/case-timeline'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function OfficerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your assigned cases</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Update Case
        </Button>
      </div>

      <OfficerStatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MyCases />
        </div>
        <div>
          <CaseTimeline />
        </div>
      </div>
    </div>
  )
}
