'use client'

import { CasesTable } from '@/components/nprms/shared/cases-table'

export default function OfficerCasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Assigned Cases</h1>
        <p className="text-muted-foreground mt-1">Cases currently assigned to you</p>
      </div>

      <CasesTable rolePrefix="officer" />
    </div>
  )
}
