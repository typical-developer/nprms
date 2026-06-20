'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { CaseDetailView } from '@/components/nprms/shared/case-detail-view'

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  return (
    <AuthLayout title="Case Details" requiredRole="administrator">
      <CaseDetailView caseId={params.id} rolePrefix="admin" />
    </AuthLayout>
  )
}
