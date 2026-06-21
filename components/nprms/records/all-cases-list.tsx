'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCases } from '@/lib/case-context'
import { getStatusVariant } from '@/lib/badge-colors'
import { formatDistanceToNow } from 'date-fns'
import { Search, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AllCasesList() {
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const { cases } = useCases()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const filteredCases = (cases || []).filter(
    (c) =>
      (c.case_number || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (c.title || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (c.assigned_officer?.full_name || '').toLowerCase().includes((search || '').toLowerCase())
  )

  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search case number, title, or officer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 font-semibold">Case Number</th>
              <th className="text-left py-3 px-2 font-semibold">Title</th>
              <th className="text-left py-3 px-2 font-semibold">Officer</th>
              <th className="text-left py-3 px-2 font-semibold">Status</th>
              <th className="text-left py-3 px-2 font-semibold">Updated</th>
              <th className="text-right py-3 px-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((caseItem) => (
              <tr key={caseItem.case_id} className="border-b hover:bg-muted/50">
                <td className="py-3 px-2 font-medium">{caseItem.case_number}</td>
                <td className="py-3 px-2">{caseItem.title}</td>
                <td className="py-3 px-2">{caseItem.assigned_officer?.full_name || 'Unassigned'}</td>
                <td className="py-3 px-2">
                  <Badge variant={getStatusVariant(caseItem.status)} className="text-xs">
                    {caseItem.status}
                  </Badge>
                </td>
                <td className="py-3 px-2 text-xs text-muted-foreground">
                  {caseItem.updated_at && formatDistanceToNow(new Date(caseItem.updated_at), { addSuffix: true })}
                </td>
                <td className="py-3 px-2 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/records/cases/${caseItem.case_id}`)}
                    title={`View case ${caseItem.case_number}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Showing {filteredCases.length} of {cases.length} cases
      </p>
    </Card>
  )
}
