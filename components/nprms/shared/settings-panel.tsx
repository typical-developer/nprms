'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Settings, Bell, Lock, Eye } from 'lucide-react'

export function SettingsPanel() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Notification Settings</h2>
        </div>

        <div className="space-y-4">
          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Case Assignments</p>
              <p className="text-sm text-muted-foreground">
                Notify me when new cases are assigned
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Case Updates</p>
              <p className="text-sm text-muted-foreground">
                Notify me of updates to assigned cases
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Send notifications via email
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Alerts</p>
              <p className="text-sm text-muted-foreground">
                Send urgent alerts via SMS
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div>
            <Label htmlFor="notify-time">Quiet Hours</Label>
            <Select defaultValue="disabled">
              <SelectTrigger id="notify-time">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="9pm-7am">9 PM - 7 AM</SelectItem>
                <SelectItem value="10pm-8am">10 PM - 8 AM</SelectItem>
                <SelectItem value="custom">Custom Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Privacy & Security</h2>
        </div>

        <div className="space-y-4">
          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Add extra security to your account
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Session Timeout</p>
              <p className="text-sm text-muted-foreground">
                Auto-logout after inactivity
              </p>
            </div>
            <Select defaultValue="30min">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15min">15 minutes</SelectItem>
                <SelectItem value="30min">30 minutes</SelectItem>
                <SelectItem value="60min">1 hour</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <Button variant="outline" className="w-full">
            View Login History
          </Button>
          <Button variant="outline" className="w-full">
            Manage Active Sessions
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Display Settings</h2>
        </div>

        <div className="space-y-4">
          <Separator />

          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select defaultValue="system">
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="yo">Yoruba</SelectItem>
                <SelectItem value="ig">Igbo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Compact View</p>
              <p className="text-sm text-muted-foreground">
                Show more information on screen
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5" />
          <h2 className="text-xl font-semibold">System Settings</h2>
        </div>

        <div className="space-y-4">
          <Separator />

          <Button variant="outline" className="w-full justify-start">
            Clear Cache
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Export Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Download Activity Report
          </Button>
        </div>
      </Card>
    </div>
  )
}
