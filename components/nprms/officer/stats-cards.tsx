'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react'

export function OfficerStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Assigned Cases</p>
            <p className="text-2xl font-bold">8</p>
          </div>
          <FileText className="w-10 h-10 text-primary/20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">In Progress</p>
            <p className="text-2xl font-bold">5</p>
          </div>
          <Clock className="w-10 h-10 text-blue-500/20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Overdue</p>
            <p className="text-2xl font-bold">1</p>
          </div>
          <AlertCircle className="w-10 h-10 text-red-500/20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Completed</p>
            <p className="text-2xl font-bold">2</p>
          </div>
          <CheckCircle2 className="w-10 h-10 text-green-500/20" />
        </div>
      </Card>
    </div>
  )
}
