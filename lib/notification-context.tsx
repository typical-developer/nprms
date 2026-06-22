'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { mockNotifications } from '@/lib/mock-data'
import type { Notification } from '@/lib/mock-data'

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'notification_id' | 'is_read' | 'created_at'>) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  deleteNotification: (notificationId: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(
    mockNotifications.map((n) => ({
      ...n,
      is_read: false,
    }))
  )

  const addNotification = (notification: Omit<Notification, 'notification_id' | 'is_read' | 'created_at'>) => {
    setNotifications((prev) => [
      {
        ...notification,
        notification_id: `n${Date.now()}`,
        is_read: false,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ])
  }

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

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, clearAll }}
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
