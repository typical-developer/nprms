'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { CaseDetailView } from '@/components/nprms/shared/case-detail-view'

export default function OfficerCaseDetailPage({ params }: { params: { id: string } }) {
  return (
    <AuthLayout title="Case Details" requiredRole="officer">
      <CaseDetailView caseId={params.id} rolePrefix="officer" />
    </AuthLayout>
  )
}
