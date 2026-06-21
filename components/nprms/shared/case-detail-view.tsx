'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { mockCases, mockUsers, mockInvestigationUpdates } from '@/lib/mock-data'
import { getStatusVariant, getPriorityVariant } from '@/lib/badge-colors'
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

  const caseItem = mockCases.find((c) => c.case_id === caseId)

  if (!caseItem) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Case not found</p>
      </div>
    )
  }

  const officer = caseItem.assigned_officer && typeof caseItem.assigned_officer === 'object' ? caseItem.assigned_officer : null

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
                <h1 className="text-3xl font-bold">{caseItem.case_number}</h1>
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
                <p className="font-medium">{format(new Date(caseItem.date_reported), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(caseItem.date_reported), { addSuffix: true })}
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
              {mockInvestigationUpdates.filter((u) => u.case_id === caseItem.case_id).map((update, index) => (
                <div key={index} className="pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">{update.content}</p>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(update.created_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">By: {update.officer_name}</p>
                </div>
              ))}
              {mockInvestigationUpdates.filter((u) => u.case_id === caseItem.case_id).length === 0 && (
                <p className="text-sm text-muted-foreground">No investigation updates yet.</p>
              )}
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
                  <p className="font-medium">{officer.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-xs">{officer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Badge</p>
                  <p className="font-medium">{officer.badge_number}</p>
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
                    (new Date().getTime() - new Date(caseItem.date_reported).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Investigation Updates</p>
                <p className="font-medium">{mockInvestigationUpdates.filter((u) => u.case_id === caseItem.case_id).length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notifications</p>
                <p className="font-medium">
                  {(caseItem as any).notifications?.length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Button className="w-full gap-2" variant="outline" onClick={() => alert(`Case ${caseItem.case_number} file downloaded successfully`)}>
            <Download className="w-4 h-4" />
            Download Case File
          </Button>
        </div>
      </div>
    </div>
  )
}
