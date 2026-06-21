'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCases } from '@/lib/case-context'
import { useUsers } from '@/lib/user-context'
import { getStatusVariant, getRoleBadgeVariant } from '@/lib/badge-colors'
import { Search, Eye } from 'lucide-react'
import Link from 'next/link'

interface SearchResultsProps {
  rolePrefix?: string
}

export function SearchResults({ rolePrefix = 'admin' }: SearchResultsProps) {
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')
  const { cases } = useCases()
  const { users } = useUsers()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const searchCases = (cases || []).filter(
    (c) =>
      (c.case_number || '').toLowerCase().includes((query || '').toLowerCase()) ||
      (c.title || '').toLowerCase().includes((query || '').toLowerCase()) ||
      (c.description || '').toLowerCase().includes((query || '').toLowerCase()) ||
      (c.location || '').toLowerCase().includes((query || '').toLowerCase())
  )

  const searchUsers = (users || []).filter(
    (u) =>
      (u.full_name || '').toLowerCase().includes((query || '').toLowerCase()) ||
      (u.email || '').toLowerCase().includes((query || '').toLowerCase()) ||
      (u.badge_number || '').toLowerCase().includes((query || '').toLowerCase())
  )

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      administrator: 'Administrator',
      officer: 'Investigating Officer',
      records: 'Records Officer',
    }
    return labels[role] || role
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search cases, users, locations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-base"
            autoFocus
          />
        </div>
        {query && (
          <p className="text-sm text-muted-foreground mt-2">
            Found {searchCases.length} cases and {searchUsers.length} users
          </p>
        )}
      </div>

      {query && (
        <Tabs defaultValue="cases" className="w-full">
          <TabsList>
            <TabsTrigger value="cases">Cases ({searchCases.length})</TabsTrigger>
            <TabsTrigger value="users">Users ({searchUsers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="space-y-3">
            {searchCases.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No cases found matching your search.</p>
              </Card>
            ) : (
              searchCases.map((caseItem) => (
                <Card key={caseItem.case_id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{caseItem.case_number}</h3>
                        <Badge variant={getStatusVariant(caseItem.status)} className="text-xs">
                          {caseItem.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{caseItem.title}</p>
                      <p className="text-xs text-muted-foreground mb-2">{caseItem.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>Location: {caseItem.location}</span>
                        <span>Officer: {caseItem.assigned_officer?.full_name || 'Unassigned'}</span>
                        <span>Category: {caseItem.category}</span>
                      </div>
                    </div>
                    <Link href={`/${rolePrefix}/cases/${caseItem.case_id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-3">
            {searchUsers.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No users found matching your search.</p>
              </Card>
            ) : (
              searchUsers.map((user) => (
                <Card key={user.user_id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{user.full_name}</h3>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                          {getRoleLabel(user.role)}
                        </Badge>
                        {user.status === 'Active' && <Badge variant="default" className="text-xs">Active</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Badge: {user.badge_number}</span>
                        <span>Station: Lagos State Command</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}

      {!query && (
        <Card className="p-12 text-center">
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Enter a search term to find cases or users</p>
        </Card>
      )}
    </div>
  )
}
