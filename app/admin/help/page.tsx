'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { Card } from '@/components/ui/card'
import { HelpCircle, FileText, Users, BarChart3, Search } from 'lucide-react'

export default function AdminHelpPage() {
  const helpTopics = [
    {
      icon: BarChart3,
      title: 'Dashboard Overview',
      description: 'View key statistics and system metrics at a glance. Monitor overall case status, user activity, and generate quick reports.',
    },
    {
      icon: FileText,
      title: 'Case Management',
      description: 'Access all cases in the system. View, filter, and export case information. Manage case assignments and statuses.',
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Create, edit, and manage user accounts. Assign roles and manage permissions for administrators, officers, and records staff.',
    },
    {
      icon: BarChart3,
      title: 'Reports & Analytics',
      description: 'Generate comprehensive reports on case statistics, officer performance, and system metrics. Export data in various formats.',
    },
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Search across all cases and users using multiple criteria. Filter by status, date, officer, location, and more.',
    },
  ]

  return (
    <AuthLayout title="Help" requiredRole="administrator">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Help Center</h1>
          <p className="text-muted-foreground mt-1">Get help with common tasks and features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {helpTopics.map((topic) => (
            <Card key={topic.title} className="p-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <topic.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-secondary/50">
          <div className="flex gap-4">
            <HelpCircle className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Need More Help?</h3>
              <p className="text-sm text-muted-foreground">
                For additional support, contact the system administrator or refer to the documentation.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AuthLayout>
  )
}
