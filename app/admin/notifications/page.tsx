'use client'

import { useEffect, useState } from 'react'
import { NotificationsList } from '@/components/nprms/shared/notifications-list'

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground mt-1">Stay updated on case activities and system events</p>
      </div>

      <NotificationsList />
    </div>
  )
}
