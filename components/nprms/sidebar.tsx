'use client'

import { LayoutDashboard, FileText, Users, BarChart3, Search, Bell, Settings, HelpCircle, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Role } from '@/lib/mock-data'

interface MenuItem {
  icon: any
  label: string
  href: string
  badge?: string
}

function getMenuItemsForRole(role: Role): { menu: MenuItem[], general: MenuItem[] } {
  const getBaseGeneral = (rolePrefix: string): MenuItem[] => [
    { icon: Settings, label: 'Settings', href: `/${rolePrefix}/settings` },
    { icon: HelpCircle, label: 'Help', href: `/${rolePrefix}/help` },
    { icon: LogOut, label: 'Logout', href: '/logout' },
  ]

  switch (role) {
    case 'administrator':
      return {
        menu: [
          { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
          { icon: FileText, label: 'All Cases', href: '/admin/cases' },
          { icon: Users, label: 'Users', href: '/admin/users' },
          { icon: BarChart3, label: 'Reports', href: '/admin/reports' },
          { icon: Search, label: 'Search', href: '/admin/search' },
          { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
        ],
        general: [
          { icon: Settings, label: 'Profile', href: '/admin/profile' },
          ...getBaseGeneral('admin'),
        ],
      }
    case 'officer':
      return {
        menu: [
          { icon: LayoutDashboard, label: 'Dashboard', href: '/officer/dashboard' },
          { icon: FileText, label: 'My Cases', href: '/officer/cases' },
          { icon: Search, label: 'Search', href: '/officer/search' },
          { icon: Bell, label: 'Notifications', href: '/officer/notifications' },
        ],
        general: [
          { icon: Settings, label: 'Profile', href: '/officer/profile' },
          ...getBaseGeneral('officer'),
        ],
      }
    case 'records':
      return {
        menu: [
          { icon: LayoutDashboard, label: 'Dashboard', href: '/records/dashboard' },
          { icon: FileText, label: 'Register Case', href: '/records/register' },
          { icon: FileText, label: 'All Cases', href: '/records/cases' },
          { icon: BarChart3, label: 'Archive', href: '/records/archive' },
          { icon: Search, label: 'Search', href: '/records/search' },
          { icon: Bell, label: 'Notifications', href: '/records/notifications' },
        ],
        general: [
          { icon: Settings, label: 'Profile', href: '/records/profile' },
          ...getBaseGeneral('records'),
        ],
      }
    default:
      return { menu: [], general: getBaseGeneral('') }
  }
}

export function Sidebar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  const { menu: menuItems, general: generalItems } = getMenuItemsForRole(user.role)

  return (
    <aside className="fixed top-0 left-0 w-64 bg-card border-r border-border p-4 h-screen overflow-y-auto lg:block">
      {/* Logo/Header */}
      <div className="flex items-center gap-2 mb-6 group cursor-pointer">
        <Link href={user.role === 'administrator' ? '/admin/dashboard' : user.role === 'officer' ? '/officer/dashboard' : '/records/dashboard'} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-110 duration-300 relative">
            <div className="w-2 h-2 bg-primary-foreground rounded-full" />
          </div>
          <span className="text-lg font-semibold text-foreground">NPRMS</span>
        </Link>
      </div>

      <div className="space-y-4">
        {/* Main Menu */}
        <div>
          <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">Menu</p>
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    hoveredItem === item.label && !isActive && 'translate-x-1',
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* General Section */}
        <div>
          <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">Account</p>
          <nav className="space-y-0.5">
            {generalItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    hoveredItem === item.label && !isActive && 'translate-x-1',
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}
