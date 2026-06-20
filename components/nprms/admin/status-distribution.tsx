'use client'

import { Card } from '@/components/ui/card'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { getCasesByStatus, mockCases } from '@/lib/mock-data'

export function StatusDistributionChart() {
  const statuses = ['Registered', 'Assigned', 'Under Investigation', 'Resolved', 'Closed', 'Archived', 'Reopened']
  
  const data = statuses.map(status => ({
    name: status,
    value: mockCases.filter(c => c.status === status).length,
  }))

  const colors = ['#e5e7eb', '#3b82f6', '#f59e0b', '#10b981', '#6366f1', '#9ca3af', '#ef4444']

  return (
    <Card className="p-5 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Case Status Distribution</h3>
        <p className="text-xs text-muted-foreground mt-0.5">All cases by status</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
