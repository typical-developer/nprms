'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, mockUsers } from './mock-data'
import { api, getToken, sync } from './api'
import { useAuth } from './auth-context'

interface UserContextType {
  users: User[]
  addUser: (user: User) => void
  updateUser: (user_id: string, updates: Partial<User>) => void
  deleteUser: (user_id: string) => void
  getUser: (user_id: string) => User | undefined
  refresh: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Seeded from mock data for an instant first paint, then replaced by the API.
  const [users, setUsers] = useState<User[]>([...mockUsers])
  const { user } = useAuth()

  const refresh = () => {
    if (!getToken()) return
    api.get<User[]>('/users').then(setUsers).catch(() => {})
  }

  // Refetch whenever the authenticated user changes (login / restore / logout).
  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id])

  const addUser = (user: User) => {
    setUsers((prev) => (prev.some((u) => u.user_id === user.user_id) ? prev : [...prev, user]))
    sync(
      api.post<User>('/users', user).then((saved) =>
        setUsers((prev) => prev.map((u) => (u.user_id === user.user_id ? saved : u)))
      ),
      'create user'
    )
  }

  const updateUser = (user_id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.user_id === user_id ? { ...u, ...updates } : u)))
    sync(api.patch(`/users/${user_id}`, updates), 'update user')
  }

  const deleteUser = (user_id: string) => {
    setUsers((prev) => prev.filter((u) => u.user_id !== user_id))
    sync(api.del(`/users/${user_id}`), 'delete user')
  }

  const getUser = (user_id: string) => users.find((u) => u.user_id === user_id)

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser, getUser, refresh }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUsers() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUsers must be used within UserProvider')
  }
  return context
}
