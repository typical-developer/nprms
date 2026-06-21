'use client'

import { Card } from '@/components/ui/card'
import { HelpCircle, FileText, Search, Clock, AlertCircle } from 'lucide-react'

export default function OfficerHelpPage() {
  const helpTopics = [
    {
      icon: FileText,
      title: 'My Cases',
      description: 'View and manage the cases assigned to you. Update case status, add investigation notes, and track progress.',
    },
    {
      icon: Clock,
      title: 'Investigation Timeline',
      description: 'Track all investigation updates and milestones for your cases. View investigation history and timestamps.',
    },
    {
      icon: Search,
      title: 'Search Cases',
      description: 'Search across all available cases using keywords, case number, location, or status.',
    },
    {
      icon: AlertCircle,
      title: 'Notifications',
      description: 'Receive and manage notifications about case updates, assignments, and system alerts.',
    },
    {
      icon: FileText,
      title: 'Case Details',
      description: 'View comprehensive case information including description, location, assigned officer, and investigation updates.',
    },
  ]

  return (
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
  )
}
