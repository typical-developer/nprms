'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useCases } from '@/lib/case-context'
import { getOverdueCases } from '@/lib/mock-data'

export function OfficerStatsCards() {
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()
  const { cases } = useCases()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !user) {
    return null
  }

  const assignedCases = cases.filter((c) => c.assigned_officer?.user_id === user.user_id)
  const inProgressCases = assignedCases.filter((c) => c.status === 'Under Investigation')
  const overdueCases = getOverdueCases(cases).filter((c) => c.assigned_officer?.user_id === user.user_id)
  const completedCases = assignedCases.filter((c) => c.status === 'Resolved' || c.status === 'Closed')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Assigned Cases</p>
            <p className="text-2xl font-bold">{assignedCases.length}</p>
          </div>
          <FileText className="w-10 h-10 text-primary/20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">In Progress</p>
            <p className="text-2xl font-bold">{inProgressCases.length}</p>
          </div>
          <Clock className="w-10 h-10 text-blue-500/20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Overdue</p>
            <p className="text-2xl font-bold">{overdueCases.length}</p>
          </div>
          <AlertCircle className="w-10 h-10 text-red-500/20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Completed</p>
            <p className="text-2xl font-bold">{completedCases.length}</p>
          </div>
          <CheckCircle2 className="w-10 h-10 text-green-500/20" />
        </div>
      </Card>
    </div>
  )
}
