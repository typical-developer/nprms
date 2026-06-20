'use client'

import { use } from 'react'
import { AuthLayout } from '@/components/nprms/auth-layout'
import { CaseDetailView } from '@/components/nprms/shared/case-detail-view'

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  
  return (
    <AuthLayout title="Case Details" requiredRole="administrator">
      <CaseDetailView caseId={resolvedParams.id} rolePrefix="admin" />
    </AuthLayout>
  )
}
