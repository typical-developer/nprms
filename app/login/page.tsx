'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      
      // Get the user to determine which dashboard to redirect to
      // Since login sets the user in context, we'll do a small delay to allow state update
      setTimeout(() => {
        // The user is already set by login(), so we'll check localStorage
        const userStr = localStorage.getItem('nprms-user')
        if (userStr) {
          const user = JSON.parse(userStr)
          const roleDashboards: Record<string, string> = {
            administrator: '/admin/dashboard',
            officer: '/officer/dashboard',
            records: '/records/dashboard',
          }
          router.push(roleDashboards[user.role] || '/login')
        }
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <div className="w-3 h-3 bg-primary-foreground rounded-full" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">NPRMS</h1>
          <p className="text-sm text-muted-foreground">
            Nigeria Police Records Management System
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="officer@nprms.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-10 bg-card border-border"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="h-10 bg-card border-border"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="pt-4 border-t border-border space-y-2">
            <p className="text-xs font-medium text-muted-foreground text-center">Demo Credentials</p>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-secondary/50 rounded">
                <p className="font-medium">Administrator</p>
                <p className="text-muted-foreground">adekunle.okonkwo@nprms.ng</p>
              </div>
              <div className="p-2 bg-secondary/50 rounded">
                <p className="font-medium">Investigating Officer</p>
                <p className="text-muted-foreground">ibrahim.musa@nprms.ng</p>
              </div>
              <div className="p-2 bg-secondary/50 rounded">
                <p className="font-medium">Records Officer</p>
                <p className="text-muted-foreground">folake.adeyemi@nprms.ng</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Nigeria Police Force. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
