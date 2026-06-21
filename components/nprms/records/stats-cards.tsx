'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Database, Plus, Archive, CheckCircle2 } from 'lucide-react'
import { mockCases } from '@/lib/mock-data'
import { isThisMonth } from 'date-fns'

export function RecordsStatsCards() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const totalCases = mockCases.length
  const pendingCases = mockCases.filter((c) => c.status === 'Registered' && !c.assigned_officer).length
  const archivedCases = mockCases.filter((c) => c.status === 'Archived').length
  const thisMonthCases = mockCases.filter((c) => isThisMonth(new Date(c.date_reported))).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Cases Registered</p>
            <p className="text-2xl font-bold">{totalCases}</p>
          </div>
          <Database className="w-10 h-10 text-primary/20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Pending Registration</p>
            <p className="text-2xl font-bold">{pendingCases}</p>
          </div>
          <Plus className="w-10 h-10 text-yellow-500/20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Archived Cases</p>
            <p className="text-2xl font-bold">{archivedCases}</p>
          </div>
          <Archive className="w-10 h-10 text-gray-500/20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">This Month</p>
            <p className="text-2xl font-bold">{thisMonthCases}</p>
          </div>
          <CheckCircle2 className="w-10 h-10 text-green-500/20" />
        </div>
      </Card>
    </div>
  )
}
