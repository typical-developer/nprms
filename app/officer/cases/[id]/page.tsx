'use client'

import { use } from 'react'
import { AuthLayout } from '@/components/nprms/auth-layout'
import { CaseDetailView } from '@/components/nprms/shared/case-detail-view'

export default function OfficerCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  
  return (
    <AuthLayout title="Case Details" requiredRole="officer">
      <CaseDetailView caseId={resolvedParams.id} rolePrefix="officer" />
    </AuthLayout>
  )
}
