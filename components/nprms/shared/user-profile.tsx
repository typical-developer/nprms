'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { User } from '@/lib/mock-data'

interface UserProfileProps {
  user: User
  canEdit?: boolean
  onUpdate?: (updates: Partial<User>) => void
}

export function UserProfile({ user, canEdit = false, onUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    email: user.email,
    badge_number: user.badge_number,
  })

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(formData)
      setIsEditing(false)
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'Administrator'
      case 'officer':
        return 'Investigating Officer'
      case 'records':
        return 'Records Officer'
      default:
        return role
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-8">
        <div className="flex items-start gap-6 mb-6">
          <Avatar className="w-20 h-20 ring-2 ring-primary/20">
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{user.full_name}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="default" className="text-sm">
                {getRoleLabel(user.role)}
              </Badge>
              <Badge
                variant={user.status === 'Active' ? 'default' : 'secondary'}
                className="text-sm"
              >
                {user.status}
              </Badge>
            </div>
            {canEdit && !isEditing && (
              <Button onClick={() => setIsEditing(true)} size="sm">
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Information */}
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Full Name</Label>
              <p className="text-lg font-medium mt-2">{user.full_name}</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Email</Label>
              <p className="text-lg font-medium mt-2">{user.email}</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Badge Number</Label>
              <p className="text-lg font-medium mt-2">{user.badge_number}</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Role</Label>
              <p className="text-lg font-medium mt-2">{getRoleLabel(user.role)}</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Status</Label>
              <p className="text-lg font-medium mt-2">{user.status}</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Last Login</Label>
              <p className="text-lg font-medium mt-2">
                {new Date(user.last_login).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-6 border-t">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="badge_number">Badge Number</Label>
              <Input
                id="badge_number"
                value={formData.badge_number}
                onChange={(e) => setFormData({ ...formData, badge_number: e.target.value })}
                className="mt-2"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    full_name: user.full_name,
                    email: user.email,
                    badge_number: user.badge_number,
                  })
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Account Info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Account Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between pb-3 border-b">
            <span className="text-muted-foreground">Account ID</span>
            <span className="font-medium">{user.user_id}</span>
          </div>
          <div className="flex justify-between pb-3 border-b">
            <span className="text-muted-foreground">Phone</span>
            <span className="font-medium">{user.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Login</span>
            <span className="font-medium">{new Date(user.last_login).toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
