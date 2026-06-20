'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockCases } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'
import { Search, Eye } from 'lucide-react'
import Link from 'next/link'

export function CasesTable({ rolePrefix = 'admin' }: { rolePrefix?: string }) {
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const normalizedStatusFilter = statusFilter || 'all'
  const normalizedCategoryFilter = categoryFilter || 'all'

  const filteredCases = (mockCases || []).filter((c) => {
    if (!c || !search) {
      // Only check filters if no search
      const matchesStatus = normalizedStatusFilter === 'all' || c.status === statusFilter
      const matchesCategory = normalizedCategoryFilter === 'all' || c.category === categoryFilter
      return matchesStatus && matchesCategory
    }
    
    const matchesSearch =
      (c.caseNumber || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (c.title || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (c.location || '').toLowerCase().includes((search || '').toLowerCase())

    const matchesStatus = normalizedStatusFilter === 'all' || c.status === statusFilter
    const matchesCategory = normalizedCategoryFilter === 'all' || c.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const statuses = Array.from(new Set(mockCases.map((c) => c.status)))
  const categories = Array.from(new Set(mockCases.map((c) => c.category)))

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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search case number, title, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={normalizedStatusFilter} onValueChange={(val) => setStatusFilter(val === 'all' ? '' : val)}>
          <SelectTrigger className="w-full md:w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={normalizedCategoryFilter} onValueChange={(val) => setCategoryFilter(val === 'all' ? '' : val)}>
          <SelectTrigger className="w-full md:w-32">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left py-3 px-4 font-semibold">Case #</th>
              <th className="text-left py-3 px-4 font-semibold">Title</th>
              <th className="text-left py-3 px-4 font-semibold">Category</th>
              <th className="text-left py-3 px-4 font-semibold">Location</th>
              <th className="text-left py-3 px-4 font-semibold">Officer</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Updated</th>
              <th className="text-right py-3 px-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredCases && filteredCases.map((caseItem) => (
              <tr key={caseItem?.id || Math.random()} className="hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 font-medium">{caseItem.caseNumber}</td>
                <td className="py-3 px-4 max-w-xs truncate">{caseItem.title}</td>
                <td className="py-3 px-4 text-xs">{caseItem.category}</td>
                <td className="py-3 px-4 text-xs text-muted-foreground">{caseItem.location}</td>
                <td className="py-3 px-4 text-xs">{caseItem.assignedOfficer}</td>
                <td className="py-3 px-4">
                  <Badge variant={getStatusVariant(caseItem.status)} className="text-xs">
                    {caseItem.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground">
                  {caseItem.updatedAt && formatDistanceToNow(new Date(caseItem.updatedAt), { addSuffix: true })}
                </td>
                <td className="py-3 px-4 text-right">
                  <Link href={`/${rolePrefix}/cases/${caseItem.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filteredCases.length} of {mockCases.length} cases
      </p>
    </div>
  )
}
