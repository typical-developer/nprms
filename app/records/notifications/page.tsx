'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { NotificationsList } from '@/components/nprms/shared/notifications-list'

export default function RecordsNotificationsPage() {
  return (
    <AuthLayout title="Notifications" requiredRole="records">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated on system activities</p>
        </div>

        <NotificationsList />
      </div>
    </AuthLayout>
  )
}
