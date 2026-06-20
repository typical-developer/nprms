'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockCases } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'

export function CaseTimeline() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const recentUpdates = mockCases
    .filter((c) => c.assignedOfficer === 'Ibrahim Musa')
    .flatMap((caseItem) =>
      caseItem.investigationUpdates.slice(0, 3).map((update) => ({
        ...update,
        caseNumber: caseItem.caseNumber,
        caseTitle: caseItem.title,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Investigation Timeline</h3>
      <div className="space-y-4">
        {recentUpdates.map((update, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{update.caseNumber}</p>
              <p className="text-sm text-muted-foreground">{update.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(update.date), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
