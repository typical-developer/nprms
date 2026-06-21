'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Spinner } from '@/components/ui/spinner'

interface AuthLayoutProps {
  children: React.ReactNode
  requiredRole?: 'administrator' | 'officer' | 'records'
  title?: string
}

export function AuthLayout({ children, requiredRole, title }: AuthLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (title) {
      document.title = `NPRMS — ${title}`
    }
  }, [title])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && requiredRole && user?.role !== requiredRole) {
      // Redirect to appropriate dashboard if accessing wrong role's page
      const roleDashboards: Record<string, string> = {
        administrator: '/admin/dashboard',
        officer: '/officer/dashboard',
        records: '/records/dashboard',
      }
      router.push(roleDashboards[user?.role!] || '/login')
    }
  }, [user, loading, requiredRole, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
