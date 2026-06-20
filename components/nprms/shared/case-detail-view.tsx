'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { mockCases, mockUsers } from '@/lib/mock-data'
import { formatDistanceToNow, format } from 'date-fns'
import { ArrowLeft, Download, Edit2 } from 'lucide-react'
import Link from 'next/link'

interface CaseDetailViewProps {
  caseId: string
  rolePrefix?: string
}

export function CaseDetailView({ caseId, rolePrefix = 'admin' }: CaseDetailViewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const caseItem = mockCases.find((c) => c.id === caseId)

  if (!caseItem) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Case not found</p>
      </div>
    )
  }

  const officer = mockUsers.find((u) => u.name === caseItem.assignedOfficer)

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      'Under Investigation': 'default',
      'Registered': 'secondary',
      'Assigned': 'outline',
      'Resolved': 'accent',
      'Closed': 'info',
      'Archived': 'secondary',
      'Reopened': 'warning',
    }
    return variants[status] || 'default'
  }

  const getPriorityVariant = (priority: string) => {
    const variants: Record<string, any> = {
      Critical: 'destructive',
      High: 'warning',
      Medium: 'info',
      Low: 'secondary',
    }
    return variants[priority] || 'secondary'
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <Link href={`/${rolePrefix}/cases`}>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Cases
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">{caseItem.caseNumber}</h1>
                <p className="text-muted-foreground mt-1">{caseItem.title}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            </div>

            <div className="flex gap-2 mb-4">
              <Badge variant={getStatusVariant(caseItem.status)}>{caseItem.status}</Badge>
              <Badge variant={getPriorityVariant(caseItem.priority)}>
                {caseItem.priority} Priority
              </Badge>
              <Badge variant="outline">{caseItem.category}</Badge>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Case Type</p>
                <p className="font-medium">{caseItem.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-medium">{caseItem.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Registered</p>
                <p className="font-medium">{format(new Date(caseItem.createdAt), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(caseItem.updatedAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Case Description</h2>
            <p className="text-muted-foreground leading-relaxed">{caseItem.description}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Investigation Updates</h2>
            <div className="space-y-4">
              {caseItem.investigationUpdates.map((update, index) => (
                <div key={index} className="pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">{update.description}</p>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(update.date), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">By: {update.updatedBy}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Assigned Officer</h3>
            {officer && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-medium">{officer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-xs">{officer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Badge</p>
                  <p className="font-medium">{officer.badgeNumber}</p>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Days Active</p>
                <p className="font-medium">
                  {Math.floor(
                    (new Date().getTime() - new Date(caseItem.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Investigation Updates</p>
                <p className="font-medium">{caseItem.investigationUpdates.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notifications</p>
                <p className="font-medium">
                  {caseItem.notifications?.length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Button className="w-full gap-2" variant="outline">
            <Download className="w-4 h-4" />
            Download Case File
          </Button>
        </div>
      </div>
    </div>
  )
}
