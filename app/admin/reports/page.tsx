'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { ReportsDashboard } from '@/components/nprms/admin/reports-dashboard'

export default function ReportsPage() {
  return (
    <AuthLayout title="Reports" requiredRole="administrator">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">View system statistics and case analytics</p>
        </div>

        <ReportsDashboard />
      </div>
    </AuthLayout>
  )
}
