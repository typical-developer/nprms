'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Download, TrendingUp } from 'lucide-react'
import { mockCases } from '@/lib/mock-data'

export function ReportsDashboard() {
  // Case status distribution
  const statusData = [
    { name: 'Registered', value: mockCases.filter((c) => c.status === 'Registered').length },
    { name: 'Under Investigation', value: mockCases.filter((c) => c.status === 'Under Investigation').length },
    { name: 'Resolved', value: mockCases.filter((c) => c.status === 'Resolved').length },
    { name: 'Closed', value: mockCases.filter((c) => c.status === 'Closed').length },
    { name: 'Archived', value: mockCases.filter((c) => c.status === 'Archived').length },
  ]

  // Case category distribution
  const categoryData = [
    { name: 'Theft', value: mockCases.filter((c) => c.category === 'Theft').length },
    { name: 'Assault', value: mockCases.filter((c) => c.category === 'Assault').length },
    { name: 'Fraud', value: mockCases.filter((c) => c.category === 'Fraud').length },
    { name: 'Armed Robbery', value: mockCases.filter((c) => c.category === 'Armed Robbery').length },
    { name: 'Other', value: mockCases.filter((c) => !['Theft', 'Assault', 'Fraud', 'Armed Robbery'].includes(c.category)).length },
  ]

  // Monthly cases trend
  const monthlyData = [
    { month: 'Jan', cases: 2 },
    { month: 'Feb', cases: 3 },
    { month: 'Mar', cases: 2 },
    { month: 'Apr', cases: 4 },
    { month: 'May', cases: 5 },
    { month: 'Jun', cases: 4 },
  ]

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

  const handleExportPDF = () => {
    alert('PDF report exported successfully')
  }

  const handleExportExcel = () => {
    alert('Excel report exported successfully')
  }

  const handleEmailReport = () => {
    alert('Report sent to your email address')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Cases</p>
              <p className="text-3xl font-bold">{mockCases.length}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-primary/20" />
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Resolution Rate</p>
            <p className="text-3xl font-bold">
              {Math.round(
                ((mockCases.filter((c) => c.status === 'Closed' || c.status === 'Resolved').length / mockCases.length) * 100)
              )}%
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Active Cases</p>
            <p className="text-3xl font-bold">
              {mockCases.filter((c) => c.status === 'Under Investigation' || c.status === 'Assigned').length}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cases by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cases by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="cases" stroke="#22c55e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Report Options</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleEmailReport}>
            <Download className="w-4 h-4" />
            Email Report
          </Button>
        </div>
      </Card>
    </div>
  )
}
