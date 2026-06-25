'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from './mock-data'
import { api, setToken, getToken, sync } from './api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_KEY = 'nprms-user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage, then validate the token against the API.
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse stored user:', e)
      }
    }

    const token = getToken()
    if (token) {
      api
        .get<User>('/auth/me')
        .then((fresh) => {
          setUser(fresh)
          localStorage.setItem(USER_KEY, JSON.stringify(fresh))
        })
        .catch(() => {
          // Token invalid/expired or server down — clear if it was rejected.
          setUser(null)
          setToken(null)
          localStorage.removeItem(USER_KEY)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { token, user: loggedIn } = await api.post<{ token: string; user: User }>('/auth/login', {
      email,
      password,
    })
    setToken(token)
    setUser(loggedIn)
    localStorage.setItem(USER_KEY, JSON.stringify(loggedIn))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(USER_KEY)
  }

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...updates }
      localStorage.setItem(USER_KEY, JSON.stringify(next))
      return next
    })
    sync(api.patch('/users/me', updates), 'update own profile')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
