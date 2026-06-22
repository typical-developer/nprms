'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Settings {
  notificationEmail: boolean
  notificationPush: boolean
  theme: string
  language: string
}

const defaultSettings: Settings = {
  notificationEmail: true,
  notificationPush: true,
  theme: 'light',
  language: 'english',
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (updates: Partial<Settings>) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const STORAGE_KEY = 'nprms_settings'

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setSettings({ ...defaultSettings, ...JSON.parse(stored) })
    } catch {}
  }, [])

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
