'use client'

import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { mockActivityLog } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'

export function ActivityLog() {
  const recentActivity = mockActivityLog.slice(0, 10)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const getActionColor = (actionType: string) => {
    if (actionType.includes('Investigation')) return 'bg-blue-500/10 text-blue-600'
    if (actionType.includes('Assigned')) return 'bg-green-500/10 text-green-600'
    if (actionType.includes('Registered')) return 'bg-purple-500/10 text-purple-600'
    if (actionType.includes('Evidence')) return 'bg-orange-500/10 text-orange-600'
    if (actionType.includes('Status')) return 'bg-amber-500/10 text-amber-600'
    return 'bg-gray-500/10 text-gray-600'
  }

  return (
    <Card className="p-5 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Latest actions in the system</p>
      </div>

      <div className="space-y-3">
        {recentActivity.map((activity) => (
          <div
            key={activity.log_id}
            className="flex gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
          >
            <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
              <AvatarFallback className="text-xs text-xs bg-muted">
                {getInitials(activity.user_name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-medium text-foreground">{activity.user_name}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded ${getActionColor(activity.action_type)}`}>
                  {activity.action_type}
                </span>
                {activity.case_number && (
                  <span className="text-xs text-muted-foreground">{activity.case_number}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
