'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNotifications } from '@/lib/notification-context'
import { mockCases } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'
import { AlertCircle, CheckCircle2, Bell, Clock, Trash2 } from 'lucide-react'

export function NotificationsList() {
  const [mounted, setMounted] = useState(false)
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Map notifications with case details
  const mappedNotifications = notifications
    .map((n) => {
      const relatedCase = mockCases.find((c) => c.case_number === n.related_case_number)
      return {
        ...n,
        case_number: n.related_case_number,
        caseTitle: relatedCase?.title || 'Unknown Case',
      }
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const unread = mappedNotifications.filter((n) => !n.is_read)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'reminder':
        return <Clock className="w-5 h-5 text-blue-500" />
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            All ({mappedNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unread.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2">
          {mappedNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground">No notifications yet</p>
            </Card>
          ) : (
            mappedNotifications.map((notification) => (
              <Card
                key={notification.notification_id}
                className={`p-4 transition-colors ${
                  !notification.is_read ? 'bg-muted/50 border-primary/20' : ''
                }`}
              >
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium text-sm ${!notification.is_read ? 'font-semibold' : ''}`}>
                            {notification.message}
                          </p>
                          {!notification.is_read && (
                            <Badge variant="default" className="text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Case: {notification.case_number}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.notification_id)}
                        className="text-muted-foreground hover:text-destructive"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.notification_id)}
                          className="text-xs h-auto py-0 px-2"
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-2">
          {unread.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500/20 mx-auto mb-3" />
              <p className="text-muted-foreground">All caught up!</p>
            </Card>
          ) : (
            unread.map((notification) => (
              <Card key={notification.notification_id} className="p-4 bg-muted/50 border-primary/20">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{notification.message}</p>
                          <Badge variant="default" className="text-xs">New</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Case: {notification.case_number}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.notification_id)}
                        className="text-muted-foreground hover:text-destructive"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.notification_id)}
                        className="text-xs h-auto py-0 px-2"
                      >
                        Mark as read
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {mappedNotifications.length > 0 && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
          <Button variant="outline" size="sm" className="text-destructive" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
