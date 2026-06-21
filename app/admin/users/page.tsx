'use client'

import { useState } from 'react'
import { UsersTable } from '@/components/nprms/admin/users-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'

export default function UsersPage() {
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    badgeNumber: '',
    role: 'officer',
  })

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.badgeNumber) {
      alert('Please fill in all required fields')
      return
    }
    alert(`User "${newUser.name}" added successfully`)
    setNewUser({ name: '', email: '', badgeNumber: '', role: 'officer' })
    setShowAddUser(false)
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage police station personnel and access</p>
          </div>
          <Button className="gap-2" onClick={() => setShowAddUser(true)}>
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        {showAddUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-bold">Add New User</h2>
                  <p className="text-sm text-muted-foreground">Create a new user account</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      placeholder="Officer name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="officer@nprms.ng"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Badge Number</label>
                    <Input
                      placeholder="NPF-2025-0001"
                      value={newUser.badgeNumber}
                      onChange={(e) => setNewUser({ ...newUser, badgeNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <Select value={newUser.role} onValueChange={(role) => setNewUser({ ...newUser, role })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrator">Administrator</SelectItem>
                        <SelectItem value="officer">Investigating Officer</SelectItem>
                        <SelectItem value="records">Records Officer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAddUser(false)}>Cancel</Button>
                  <Button onClick={handleAddUser}>Create User</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        <UsersTable />
      </div>
  )
}
