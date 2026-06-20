'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockCases } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'
import { Search, Eye } from 'lucide-react'
import { useState } from 'react'

export function AllCasesList() {
  const [search, setSearch] = useState('')

  const filteredCases = mockCases.filter(
    (c) =>
      c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.assignedOfficer.toLowerCase().includes(search.toLowerCase())
  )

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
              <tr key={caseItem.id} className="border-b hover:bg-muted/50">
                <td className="py-3 px-2 font-medium">{caseItem.caseNumber}</td>
                <td className="py-3 px-2">{caseItem.title}</td>
                <td className="py-3 px-2">{caseItem.assignedOfficer}</td>
                <td className="py-3 px-2">
                  <Badge variant={getStatusVariant(caseItem.status)} className="text-xs">
                    {caseItem.status}
                  </Badge>
                </td>
                <td className="py-3 px-2 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(caseItem.updatedAt), { addSuffix: true })}
                </td>
                <td className="py-3 px-2 text-right">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Showing {filteredCases.length} of {mockCases.length} cases
      </p>
    </Card>
  )
}
