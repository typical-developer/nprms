'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockCases } from '@/lib/mock-data'
import { formatDistanceToNow, format } from 'date-fns'
import { AlertCircle, CheckCircle2, Bell, Clock } from 'lucide-react'

export function NotificationsList() {
  // Generate notifications from mock data
  const notifications = mockCases
    .flatMap((c) =>
      c.notifications?.map((n) => ({
        ...n,
        caseNumber: c.caseNumber,
        caseTitle: c.title,
      })) || []
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const unread = notifications.filter((n) => !n.read)

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
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unread.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2">
          {notifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground">No notifications yet</p>
            </Card>
          ) : (
            notifications.map((notification, index) => (
              <Card
                key={index}
                className={`p-4 cursor-pointer transition-colors hover:bg-muted ${
                  !notification.read ? 'bg-muted/50 border-primary/20' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`font-medium text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Case: {notification.caseNumber}
                        </p>
                      </div>
                      {!notification.read && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                    </p>
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
            unread.map((notification, index) => (
              <Card key={index} className="p-4 bg-muted/50 border-primary/20">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Case: {notification.caseNumber}
                        </p>
                      </div>
                      <Badge variant="default" className="text-xs">New</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {notifications.length > 0 && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Mark All as Read
          </Button>
          <Button variant="outline" size="sm" className="text-destructive">
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
