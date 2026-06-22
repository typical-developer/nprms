'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCases } from '@/lib/case-context'
import { Search, RotateCcw } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function RecordsArchivePage() {
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const { cases, updateCase } = useCases()

  const handleReopen = (caseId: string) => {
    updateCase(caseId, { status: 'Reopened', archived_at: null, updated_at: new Date().toISOString() })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const archivedCases = cases.filter((c) => c.status === 'Archived')

  const filteredCases = archivedCases.filter(
    (c) =>
      (c.case_number || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (c.title || '').toLowerCase().includes((search || '').toLowerCase())
  )

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      'Under Investigation': 'default',
      'Registered': 'secondary',
      'Assigned': 'outline',
      'Resolved': 'accent',
      'Closed': 'info',
      'Archived': 'secondary',
    }
    return variants[status] || 'default'
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Case Archive</h1>
          <p className="text-muted-foreground mt-1">View archived cases ({filteredCases.length} total)</p>
        </div>

        <Card className="p-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search case number or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Case Number</th>
                  <th className="py-3 px-4 text-left font-medium">Title</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-left font-medium">Category</th>
                  <th className="py-3 px-4 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCases.length > 0 ? (
                  filteredCases.map((caseItem) => (
                    <tr key={caseItem.case_id} className="hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{caseItem.case_number}</td>
                      <td className="py-3 px-4">{caseItem.title}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusVariant(caseItem.status)} className="text-xs">
                          {caseItem.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{caseItem.category}</td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline" onClick={() => handleReopen(caseItem.case_id)}>
                          <RotateCcw className="w-3 h-3 mr-1" /> Reopen
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 px-4 text-center text-muted-foreground">
                      No archived cases found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
  )
}
