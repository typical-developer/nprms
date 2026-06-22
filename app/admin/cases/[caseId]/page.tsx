'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useCases } from '@/lib/case-context'
import { useUsers } from '@/lib/user-context'
import { CaseDetail } from '@/components/nprms/shared/case-detail'
import { NPRMSHeader } from '@/components/nprms/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function CaseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { cases, updateCase } = useCases()
  const { users } = useUsers()
  const [mounted, setMounted] = useState(false)
  const [assignedOfficerId, setAssignedOfficerId] = useState<string>('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const caseItem = cases.find(
    (c) => c.case_id === params.caseId || c.case_number === params.caseId
  )

  const officerUsers = users.filter((u) => u.role === 'officer')

  if (!mounted) {
    return null
  }

  if (!caseItem) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Case not found</p>
      </div>
    )
  }

  const handleAssignCase = () => {
    const officer = users.find((u) => u.user_id === assignedOfficerId)
    if (officer) {
      updateCase(caseItem.case_id, {
        assigned_officer: officer,
        assigned_by: user,
        status: 'Assigned',
      })
      setAssignedOfficerId('')
    }
  }

  return (
    <div className="space-y-6">
      <NPRMSHeader
        title={`Case ${caseItem.case_number}`}
        description={caseItem.title}
      />
      <CaseDetail
        caseData={caseItem}
        onBack={() => router.back()}
        canEdit={false}
      />

      {/* Admin Assignment / Reassignment Section */}
      {(caseItem.status === 'Registered' || caseItem.assigned_officer) && !['Closed', 'Archived', 'Resolved'].includes(caseItem.status) && (
        <Card className="p-6 border-primary/20 bg-primary/5">
          <h2 className="text-lg font-semibold mb-1">
            {caseItem.status === 'Registered' ? 'Assign Case to Officer' : 'Reassign Case'}
          </h2>
          {caseItem.assigned_officer && caseItem.status !== 'Registered' && (
            <p className="text-sm text-muted-foreground mb-4">
              Currently assigned to <span className="font-medium">{caseItem.assigned_officer.full_name}</span>
            </p>
          )}
          <div className="space-y-4">
            <div>
              <Label htmlFor="officer">
                {caseItem.status === 'Registered' ? 'Select Officer' : 'Select New Officer'}
              </Label>
              <Select value={assignedOfficerId} onValueChange={setAssignedOfficerId}>
                <SelectTrigger id="officer" className="mt-2">
                  <SelectValue placeholder="Choose an investigating officer" />
                </SelectTrigger>
                <SelectContent>
                  {officerUsers.map((officer) => (
                    <SelectItem key={officer.user_id} value={officer.user_id}>
                      {officer.full_name} ({officer.badge_number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAssignCase} disabled={!assignedOfficerId}>
              {caseItem.status === 'Registered' ? 'Assign Case' : 'Reassign Case'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
