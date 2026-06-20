'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { SettingsPanel } from '@/components/nprms/shared/settings-panel'

export default function RecordsSettingsPage() {
  return (
    <AuthLayout title="Settings" requiredRole="records">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your account and system preferences</p>
        </div>

        <SettingsPanel />
      </div>
    </AuthLayout>
  )
}
