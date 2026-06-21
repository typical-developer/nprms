'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useCases } from '@/lib/case-context'
import { CaseDetail } from '@/components/nprms/shared/case-detail'
import { NPRMSHeader } from '@/components/nprms/header'

export default function CaseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { cases } = useCases()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const caseItem = cases.find(
    (c) => c.case_id === params.caseId || c.case_number === params.caseId
  )

  if (!mounted) {
    return null
  }

  if (!caseItem) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Case not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <NPRMSHeader
        title={`Case ${caseItem.case_number}`}
        description={caseItem.title}
      />
      <CaseDetail
        caseData={caseItem}
        onBack={() => router.back()}
        canEdit={false}
      />
    </div>
  )
}
