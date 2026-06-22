'use client'

'use client'

import { CasesTable } from '@/components/nprms/shared/cases-table'

export default function AdminCasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Cases</h1>
        <p className="text-muted-foreground mt-1">Manage and monitor all police cases</p>
      </div>

      <CasesTable rolePrefix="admin" />
    </div>
  )
}
