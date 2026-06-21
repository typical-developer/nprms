'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockCases, mockInvestigationUpdates } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'

export function CaseTimeline() {
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const officerCases = mockCases.filter(
    (c) => c.assigned_officer?.user_id === user?.user_id
  )

  const recentUpdates = officerCases
    .flatMap((caseItem) =>
      mockInvestigationUpdates
        .filter((u) => u.case_id === caseItem.case_id)
        .slice(0, 3)
        .map((update) => ({
          ...update,
          case_number: caseItem.case_number,
          caseTitle: caseItem.title,
        }))
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Investigation Timeline</h3>
      <div className="space-y-4">
        {recentUpdates.length > 0 ? recentUpdates.map((update, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{update.case_number}</p>
              <p className="text-sm text-muted-foreground">{update.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        )) : (
          <p className="text-sm text-muted-foreground">No recent investigation updates.</p>
        )}
      </div>
    </Card>
  )
}
