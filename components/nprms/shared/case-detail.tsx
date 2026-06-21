'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { getStatusVariant, getPriorityVariant, getCategoryVariant } from '@/lib/badge-colors'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Case } from '@/lib/mock-data'

interface CaseDetailProps {
  caseData: Case
  onBack: () => void
  canEdit?: boolean
  onUpdate?: (updates: Partial<Case>) => void
}

export function CaseDetail({ caseData, onBack, canEdit = false, onUpdate }: CaseDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Case Title Section */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{caseData.case_number}: {caseData.title}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant={getStatusVariant(caseData.status)} className="text-sm">
                {caseData.status}
              </Badge>
              <Badge variant={getPriorityVariant(caseData.priority)} className="text-sm">
                {caseData.priority} Priority
              </Badge>
              <Badge variant={getCategoryVariant(caseData.category)} className="text-sm">
                {caseData.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Case Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Date Reported</p>
            <p className="font-medium">{format(new Date(caseData.date_reported), 'PPP p')}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Location</p>
            <p className="font-medium">{caseData.location}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Registered By</p>
            <p className="font-medium">{caseData.registered_by.full_name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Assigned Officer</p>
            <p className="font-medium">{caseData.assigned_officer?.full_name || 'Unassigned'}</p>
          </div>
        </div>
      </Card>

      {/* Case Description */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Case Description</h2>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{caseData.description}</p>
      </Card>

      {/* Complainant Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Complainant Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium">Name</Label>
            <p className="text-sm mt-1">{caseData.complainant_name}</p>
          </div>
          <div>
            <Label className="text-xs font-medium">Contact</Label>
            <p className="text-sm mt-1">{caseData.complainant_contact}</p>
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs font-medium">Address</Label>
            <p className="text-sm mt-1">{caseData.complainant_address}</p>
          </div>
        </div>
      </Card>

      {/* Case Status Update Section - Only for assigned officer */}
      {canEdit && (
        <Card className="p-6 border-primary/20 bg-primary/5">
          <h2 className="text-lg font-semibold mb-4">Investigation Update</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Investigation Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add investigation notes here..."
                className="mt-2 min-h-32"
              />
            </div>
            <div className="flex gap-2">
              <Button>Save Update</Button>
              <Button variant="outline">Add Evidence</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Timeline Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Case Timeline</h2>
        <div className="space-y-4">
          <div className="flex gap-4 pb-4 border-b">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Case Registered</p>
              <p className="text-xs text-muted-foreground">{format(new Date(caseData.created_at), 'PPP p')}</p>
              <p className="text-xs text-muted-foreground mt-1">By {caseData.registered_by.full_name}</p>
            </div>
          </div>
          {caseData.assigned_officer && (
            <div className="flex gap-4 pb-4 border-b">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Case Assigned</p>
                <p className="text-xs text-muted-foreground">To {caseData.assigned_officer.full_name}</p>
              </div>
            </div>
          )}
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Last Updated</p>
              <p className="text-xs text-muted-foreground">{format(new Date(caseData.updated_at), 'PPP p')}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
