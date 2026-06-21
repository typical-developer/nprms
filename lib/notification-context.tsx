'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { mockNotifications } from '@/lib/mock-data'
import type { Notification } from '@/lib/mock-data'

interface NotificationContextType {
  notifications: Notification[]
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  deleteNotification: (notificationId: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Initialize from mock data on mount
    setNotifications(
      mockNotifications.map((n) => ({
        ...n,
        is_read: false,
      }))
    )
    setMounted(true)
  }, [])

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.notification_id === notificationId ? { ...n, is_read: true } : n
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.notification_id !== notificationId))
  }

  const clearAll = () => {
    setNotifications([])
  }

  if (!mounted) return <>{children}</>

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, markAllAsRead, deleteNotification, clearAll }}
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
