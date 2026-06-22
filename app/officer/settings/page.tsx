'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { NPRMSHeader } from '@/components/nprms/header'
import { useSettings } from '@/lib/settings-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function OfficerSettingsPage() {
  const { settings, updateSettings } = useSettings()
  const { notificationEmail, notificationPush, theme, language } = settings
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const setNotificationEmail = (v: boolean) => updateSettings({ notificationEmail: v })
  const setNotificationPush = (v: boolean) => updateSettings({ notificationPush: v })
  const setTheme = (v: string) => updateSettings({ theme: v })
  const setLanguage = (v: string) => updateSettings({ language: v })

  return (
    <div className="space-y-6 max-w-2xl">
      <NPRMSHeader
        title="Settings"
        description="Manage your preferences and application settings"
      />

      {/* Notification Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground mt-1">Receive case updates via email</p>
            </div>
            <Switch checked={notificationEmail} onCheckedChange={setNotificationEmail} />
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <Label className="font-medium">Push Notifications</Label>
              <p className="text-sm text-muted-foreground mt-1">Receive real-time browser notifications</p>
            </div>
            <Switch checked={notificationPush} onCheckedChange={setNotificationPush} />
          </div>
        </div>
      </Card>

      {/* Display Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Display Settings</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="theme" className="mb-2 block">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="language" className="mb-2 block">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="yoruba">Yoruba</SelectItem>
                <SelectItem value="hausa">Hausa</SelectItem>
                <SelectItem value="igbo">Igbo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Privacy & Security</h2>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Active Sessions
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Export My Data
          </Button>
        </div>
      </Card>

      {/* Save Settings */}
      <div className="flex gap-2">
        <Button onClick={handleSave}>{saved ? 'Saved!' : 'Save Settings'}</Button>
        <Button variant="outline">Reset to Default</Button>
      </div>
    </div>
  )
}
