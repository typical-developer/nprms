'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth-context'
import { mockUsers } from '@/lib/mock-data'
import { Edit2, Mail, Phone, MapPin, Shield } from 'lucide-react'

export function ProfileCard() {
  const { user } = useAuth()
  const userData = mockUsers.find((u) => u.email === user?.email)

  if (!userData) {
    return null
  }

  const roleLabels: Record<string, string> = {
    administrator: 'Administrator',
    officer: 'Investigating Officer',
    records: 'Records Officer',
  }

  const roleBadgeVariants: Record<string, any> = {
    administrator: 'default',
    officer: 'secondary',
    records: 'outline',
  }

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {(userData.full_name || userData.name || 'User')
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{userData.full_name || userData.name}</h1>
              <Badge variant={roleBadgeVariants[userData.role]} className="mt-2">
                {roleLabels[userData.role]}
              </Badge>
            </div>
          </div>
          <Button className="gap-2">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Email Address</p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <p className="font-medium">{userData.email}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Badge Number</p>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <p className="font-mono font-medium">{userData.badge_number || userData.badgeNumber || 'N/A'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Station</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <p className="font-medium">{userData.station || 'Lagos State Command'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Badge variant={userData.status === 'Active' || userData.active ? 'default' : 'secondary'}>
              {userData.status || (userData.active ? 'Active' : 'Inactive')}
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Login History
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Connected Devices
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Notification Settings
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Privacy Settings
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Email Preferences
          </Button>
        </div>
      </Card>

      <Card className="p-6 border-destructive/20">
        <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
        <Button variant="destructive" className="w-full">
          Sign Out of All Devices
        </Button>
      </Card>
    </div>
  )
}
