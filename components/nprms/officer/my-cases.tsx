'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useCases } from '@/lib/case-context'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStatusVariant, getPriorityVariant } from '@/lib/badge-colors'
import { formatDistanceToNow } from 'date-fns'
import { Eye } from 'lucide-react'

export function MyCases() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { cases } = useCases()

  useEffect(() => {
    setMounted(true)
  }, [])

  const officerCases = cases.filter(
    (c) => c.assigned_officer?.user_id === user?.user_id
  )

  if (!mounted) {
    return null
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">My Cases</h3>
      <div className="space-y-3">
        {officerCases.map((caseItem) => (
          <div
            key={caseItem.case_id}
            className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-sm">{caseItem.case_number}</p>
                <Badge variant={getStatusVariant(caseItem.status)} className="text-xs">
                  {caseItem.status}
                </Badge>
                <Badge variant={getPriorityVariant(caseItem.priority)} className="text-xs">
                  {caseItem.priority}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{caseItem.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Updated {formatDistanceToNow(new Date(caseItem.date_reported), { addSuffix: true })}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => router.push(`/officer/cases/${caseItem.case_id}`)}
              title={`View case ${caseItem.case_number}`}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}
