'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { mockNotifications } from '@/lib/mock-data'
import type { Notification } from '@/lib/mock-data'
import { api, getToken, sync } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'notification_id' | 'is_read' | 'created_at'>) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  deleteNotification: (notificationId: string) => void
  clearAll: () => void
  refresh: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(
    mockNotifications.map((n) => ({ ...n, is_read: false }))
  )
  const { user } = useAuth()

  const refresh = () => {
    if (!getToken()) return
    api.get<Notification[]>('/notifications')
      .then((rows) => setNotifications(rows.map((n) => ({ ...n, is_read: Boolean(n.is_read) }))))
      .catch(() => {})
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id])

  const addNotification = (
    notification: Omit<Notification, 'notification_id' | 'is_read' | 'created_at'>
  ) => {
    const full: Notification = {
      ...notification,
      notification_id: `n${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString(),
    }
    setNotifications((prev) => [full, ...prev])
    sync(api.post('/notifications', full), 'add notification')
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === notificationId ? { ...n, is_read: true } : n))
    )
    sync(api.patch(`/notifications/${notificationId}`, { is_read: true }), 'mark notification read')
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    sync(api.patch('/notifications/read-all'), 'mark all read')
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.notification_id !== notificationId))
    sync(api.del(`/notifications/${notificationId}`), 'delete notification')
  }

  const clearAll = () => {
    setNotifications([])
    sync(api.del('/notifications'), 'clear notifications')
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, clearAll, refresh }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
