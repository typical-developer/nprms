'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, mockUsers } from './mock-data'

interface UserContextType {
  users: User[]
  addUser: (user: User) => void
  updateUser: (user_id: string, updates: Partial<User>) => void
  deleteUser: (user_id: string) => void
  getUser: (user_id: string) => User | undefined
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Initialize with mock users on first mount
    setUsers([...mockUsers])
    setInitialized(true)
  }, [])

  const addUser = (user: User) => {
    setUsers((prevUsers) => {
      // Check if user already exists
      if (prevUsers.some((u) => u.user_id === user.user_id)) {
        return prevUsers
      }
      return [...prevUsers, user]
    })
  }

  const updateUser = (user_id: string, updates: Partial<User>) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.user_id === user_id ? { ...u, ...updates } : u))
    )
  }

  const deleteUser = (user_id: string) => {
    setUsers((prevUsers) => prevUsers.filter((u) => u.user_id !== user_id))
  }

  const getUser = (user_id: string) => {
    return users.find((u) => u.user_id === user_id)
  }

  if (!initialized) {
    return <>{children}</>
  }

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        deleteUser,
        getUser,
      }}
    >
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
