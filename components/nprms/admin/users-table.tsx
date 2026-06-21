'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { mockUsers } from '@/lib/mock-data'
import { Edit2, Trash2, Shield, Search } from 'lucide-react'

export function UsersTable() {
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [deletingUser, setDeletingUser] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const filteredUsers = (mockUsers || []).filter(
    (u) =>
      (u.full_name || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (u.email || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (u.role || '').toLowerCase().includes((search || '').toLowerCase())
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
              <tr key={user.user_id} className="hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 font-medium">{user.full_name}</td>
                <td className="py-3 px-4 text-xs text-muted-foreground">{user.email}</td>
                <td className="py-3 px-4 font-mono text-xs">{user.badge_number}</td>
                <td className="py-3 px-4">
                  <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                    {getRoleLabel(user.role)}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-xs">{'Lagos State Command'}</td>
                <td className="py-3 px-4">
                  <Badge variant={user.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                    {user.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right flex gap-1 justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingUser(user.user_id)}
                    title={`Edit ${user.full_name}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => setDeletingUser(user.user_id)}
                    title={`Delete ${user.full_name}`}
                  >
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

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-bold">Edit User</h2>
                <p className="text-sm text-muted-foreground">User: {filteredUsers.find(u => u.user_id === editingUser)?.full_name}</p>
              </div>
              <div className="space-y-3 text-sm">
                <p>Edit functionality would be implemented in a production app with form fields for updating user details.</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                <Button onClick={() => {
                  setEditingUser(null)
                  alert('User updated successfully')
                }}>Save Changes</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {deletingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-bold">Delete User</h2>
                <p className="text-sm text-muted-foreground">Are you sure you want to delete this user?</p>
              </div>
              <div className="bg-destructive/10 border border-destructive/30 rounded p-3 text-sm">
                <p className="font-medium">User: {filteredUsers.find(u => u.user_id === deletingUser)?.full_name}</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDeletingUser(null)}>Cancel</Button>
                <Button variant="destructive" onClick={() => {
                  setDeletingUser(null)
                  alert('User deleted successfully')
                }}>Delete</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
