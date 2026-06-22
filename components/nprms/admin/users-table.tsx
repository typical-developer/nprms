'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useUsers } from '@/lib/user-context'
import { Edit2, UserX, UserCheck, Shield, Search } from 'lucide-react'

export function UsersTable() {
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [togglingUser, setTogglingUser] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState({ full_name: '', email: '', badge_number: '' })
  const { users, updateUser } = useUsers()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const filteredUsers = (users || []).filter(
    (u) =>
      (u.full_name || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (u.email || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (u.role || '').toLowerCase().includes((search || '').toLowerCase())
  )

  const handleEditClick = (user_id: string) => {
    const user = users.find((u) => u.user_id === user_id)
    if (user) {
      setEditFormData({
        full_name: user.full_name,
        email: user.email,
        badge_number: user.badge_number,
      })
    }
    setEditingUser(user_id)
  }

  const handleSaveEdit = () => {
    if (editingUser) {
      updateUser(editingUser, editFormData)
      setEditingUser(null)
    }
  }

  const handleToggleStatus = () => {
    if (togglingUser) {
      const target = users.find((u) => u.user_id === togglingUser)
      if (target) {
        updateUser(togglingUser, { status: target.status === 'Active' ? 'Inactive' : 'Active' })
      }
      setTogglingUser(null)
    }
  }

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
                    onClick={() => handleEditClick(user.user_id)}
                    title={`Edit ${user.full_name}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={user.status === 'Active' ? 'text-destructive' : 'text-green-600'}
                    onClick={() => setTogglingUser(user.user_id)}
                    title={user.status === 'Active' ? `Deactivate ${user.full_name}` : `Reactivate ${user.full_name}`}
                  >
                    {user.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filteredUsers.length} of {users.length} users
      </p>

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-bold">Edit User</h2>
                <p className="text-sm text-muted-foreground">User: {filteredUsers.find(u => u.user_id === editingUser)?.full_name}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    value={editFormData.full_name}
                    onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    placeholder="Enter email"
                    type="email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Badge Number</label>
                  <Input
                    value={editFormData.badge_number}
                    onChange={(e) => setEditFormData({ ...editFormData, badge_number: e.target.value })}
                    placeholder="Enter badge number"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {togglingUser && (() => {
        const target = users.find((u) => u.user_id === togglingUser)
        const isActive = target?.status === 'Active'
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-bold">{isActive ? 'Deactivate' : 'Reactivate'} User</h2>
                  <p className="text-sm text-muted-foreground">
                    {isActive
                      ? 'This user will lose access to NPRMS. Their case history is preserved.'
                      : 'This user will regain access to NPRMS.'}
                  </p>
                </div>
                <div className="bg-muted border rounded p-3 text-sm">
                  <p className="font-medium">{target?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{target?.badge_number} · {target?.role}</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setTogglingUser(null)}>Cancel</Button>
                  <Button variant={isActive ? 'destructive' : 'default'} onClick={handleToggleStatus}>
                    {isActive ? 'Deactivate' : 'Reactivate'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )
      })()}
    </div>
  )
}
