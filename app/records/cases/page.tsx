'use client'

import { CasesTable } from '@/components/nprms/shared/cases-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function RecordsCasesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Cases</h1>
          <p className="text-muted-foreground mt-1">Manage and view all registered cases</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/records/cases/new">
            <Plus className="w-4 h-4" />
            New Case
          </Link>
        </Button>
      </div>

      <CasesTable rolePrefix="records" />
    </div>
  )
}
