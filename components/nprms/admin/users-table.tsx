'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockUsers } from '@/lib/mock-data'
import { Edit2, Trash2, Shield, Search } from 'lucide-react'

export function UsersTable() {
  const [search, setSearch] = useState('')

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  )

  const getRoleBadgeVariant = (role: string) => {
    const variants: Record<string, any> = {
      administrator: 'default',
      officer: 'secondary',
      records: 'outline',
    }
    return variants[role] || 'secondary'
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      administrator: 'Administrator',
      officer: 'Investigating Officer',
      records: 'Records Officer',
    }
    return labels[role] || role
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">Email</th>
              <th className="text-left py-3 px-4 font-semibold">Badge #</th>
              <th className="text-left py-3 px-4 font-semibold">Role</th>
              <th className="text-left py-3 px-4 font-semibold">Station</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-right py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 font-medium">{user.name}</td>
                <td className="py-3 px-4 text-xs text-muted-foreground">{user.email}</td>
                <td className="py-3 px-4 font-mono text-xs">{user.badgeNumber}</td>
                <td className="py-3 px-4">
                  <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                    {getRoleLabel(user.role)}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-xs">{user.station}</td>
                <td className="py-3 px-4">
                  <Badge variant={user.active ? 'default' : 'secondary'} className="text-xs">
                    {user.active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right flex gap-1 justify-end">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filteredUsers.length} of {mockUsers.length} users
      </p>
    </div>
  )
}
