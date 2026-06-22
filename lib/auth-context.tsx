'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, mockUsers, Role } from './mock-data'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('nprms-user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse stored user:', e)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock authentication - find user by email
    const foundUser = mockUsers.find(u => u.email === email)
    
    if (!foundUser) {
      throw new Error('Invalid email or password')
    }

    // For demo purposes, accept any password
    setUser(foundUser)
    localStorage.setItem('nprms-user', JSON.stringify(foundUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('nprms-user')
  }

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...updates }
      localStorage.setItem('nprms-user', JSON.stringify(next))
      return next
    })
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
