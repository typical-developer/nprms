'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { CaseRegistrationForm } from '@/components/nprms/records/case-registration-form'

export default function CaseRegistrationPage() {
  return (
    <AuthLayout title="Register Case" requiredRole="records">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Register New Case</h1>
          <p className="text-muted-foreground mt-1">Create a new case entry in the system</p>
        </div>

        <CaseRegistrationForm />
      </div>
    </AuthLayout>
  )
}
