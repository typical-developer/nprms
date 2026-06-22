'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useUsers } from '@/lib/user-context'
import { UserProfile } from '@/components/nprms/shared/user-profile'
import { NPRMSHeader } from '@/components/nprms/header'

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const { user, updateUser: updateAuthUser } = useAuth()
  const { updateUser } = useUsers()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !user) {
    return null
  }

  return (
    <div className="space-y-6">
      <NPRMSHeader
        title="My Profile"
        description="View and manage your account information"
      />
      <UserProfile
        user={user}
        canEdit={true}
        onUpdate={(updates) => { updateUser(user.user_id, updates); updateAuthUser(updates) }}
      />
    </div>
  )
}
