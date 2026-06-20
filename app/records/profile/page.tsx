'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { ProfileCard } from '@/components/nprms/shared/profile-card'

export default function RecordsProfilePage() {
  return (
    <AuthLayout title="Profile" requiredRole="records">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        <ProfileCard />
      </div>
    </AuthLayout>
  )
}
