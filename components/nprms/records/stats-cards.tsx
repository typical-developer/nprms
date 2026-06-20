'use client'

import { Card } from '@/components/ui/card'
import { Database, Plus, Archive, CheckCircle2 } from 'lucide-react'

export function RecordsStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Cases Registered</p>
            <p className="text-2xl font-bold">20</p>
          </div>
          <Database className="w-10 h-10 text-primary/20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Pending Registration</p>
            <p className="text-2xl font-bold">3</p>
          </div>
          <Plus className="w-10 h-10 text-yellow-500/20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Archived Cases</p>
            <p className="text-2xl font-bold">2</p>
          </div>
          <Archive className="w-10 h-10 text-gray-500/20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">This Month</p>
            <p className="text-2xl font-bold">5</p>
          </div>
          <CheckCircle2 className="w-10 h-10 text-green-500/20" />
        </div>
      </Card>
    </div>
  )
}
