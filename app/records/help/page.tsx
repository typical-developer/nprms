'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { Card } from '@/components/ui/card'
import { HelpCircle, FileText, Plus, BarChart3, Search } from 'lucide-react'

export default function RecordsHelpPage() {
  const helpTopics = [
    {
      icon: Plus,
      title: 'Register New Case',
      description: 'Create and register new cases in the system. Enter case details including description, location, and category.',
    },
    {
      icon: FileText,
      title: 'All Cases',
      description: 'View and manage all registered cases. Filter, search, and export case data.',
    },
    {
      icon: BarChart3,
      title: 'Archive',
      description: 'View and manage archived cases. Archive completed cases or restore archived cases.',
    },
    {
      icon: Search,
      title: 'Search Cases',
      description: 'Search across all cases using multiple criteria including case number, title, and status.',
    },
    {
      icon: FileText,
      title: 'Case Records',
      description: 'Maintain accurate case records and documentation. View case history and investigation progress.',
    },
  ]

  return (
    <AuthLayout title="Help" requiredRole="records">
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
                For additional support, contact your administrator or refer to the system documentation.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AuthLayout>
  )
}
