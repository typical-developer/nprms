'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useCases } from '@/lib/case-context'
import { CaseDetail } from '@/components/nprms/shared/case-detail'
import { NPRMSHeader } from '@/components/nprms/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Archive, RotateCcw } from 'lucide-react'

export default function CaseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { cases, updateCase } = useCases()
  const [mounted, setMounted] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const caseItem = cases.find(
    (c) => c.case_id === params.caseId || c.case_number === params.caseId
  )

  if (!mounted) return null

  if (!caseItem) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Case not found</p>
      </div>
    )
  }

  const canArchive = ['Closed', 'Resolved'].includes(caseItem.status)
  const canReopen = caseItem.status === 'Archived'

  const handleArchive = () => {
    if (!confirmed) { setConfirmed(true); return }
    updateCase(caseItem.case_id, {
      status: 'Archived',
      archived_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    setConfirmed(false)
  }

  const handleReopen = () => {
    updateCase(caseItem.case_id, {
      status: 'Reopened',
      archived_at: null,
      updated_at: new Date().toISOString(),
    })
  }

  return (
    <div className="space-y-6">
      <NPRMSHeader
        title={`Case ${caseItem.case_number}`}
        description={caseItem.title}
      />

      {/* Records actions panel */}
      {(canArchive || canReopen) && (
        <Card className="p-4 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">Records Actions:</span>
          {canArchive && (
            <Button
              variant={confirmed ? 'destructive' : 'outline'}
              size="sm"
              onClick={handleArchive}
              onBlur={() => setConfirmed(false)}
            >
              <Archive className="w-4 h-4 mr-1" />
              {confirmed ? 'Click again to confirm archive' : 'Archive Case'}
            </Button>
          )}
          {canReopen && (
            <Button variant="outline" size="sm" onClick={handleReopen}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reopen Case
            </Button>
          )}
        </Card>
      )}

      <CaseDetail
        caseData={caseItem}
        onBack={() => router.back()}
        canEdit={false}
      />
    </div>
  )
}
