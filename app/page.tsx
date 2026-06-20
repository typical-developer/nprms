'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Spinner } from '@/components/ui/spinner'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect to appropriate dashboard based on role
        const roleDashboards: Record<string, string> = {
          administrator: '/admin/dashboard',
          officer: '/officer/dashboard',
          records: '/records/dashboard',
        }
        router.push(roleDashboards[user.role] || '/login')
      } else {
        router.push('/login')
      }
    }
  }, [user, loading, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="w-8 h-8" />
    </div>
  )
}
