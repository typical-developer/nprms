'use client'

import { Card } from '@/components/ui/card'
import { useCases } from '@/lib/case-context'
import { useUsers } from '@/lib/user-context'
import { getTotalCases, getActiveCases, getClosedCases, getTotalOfficers } from '@/lib/mock-data'
import { FileText, AlertCircle, CheckCircle, Users } from 'lucide-react'

export function AdminStatsCards() {
  const { cases } = useCases()
  const { users } = useUsers()
  const totalCases = getTotalCases(cases)
  const activeCases = getActiveCases(cases)
  const closedCases = getClosedCases(cases)
  const totalOfficers = getTotalOfficers(users)

  const stats = [
    {
      label: 'Total Cases',
      value: totalCases,
      icon: FileText,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Active Cases',
      value: activeCases,
      icon: AlertCircle,
      color: 'bg-accent/10 text-accent',
    },
    {
      label: 'Closed Cases',
      value: closedCases,
      icon: CheckCircle,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      label: 'Total Officers',
      value: totalOfficers,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">{stat.value}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
