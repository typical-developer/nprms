import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/components/nprms/auth-layout'
import { NPRMSHeader } from '@/components/nprms/header'
import { AdminStatsCards } from '@/components/nprms/admin/stats-cards'
import { StatusDistributionChart } from '@/components/nprms/admin/status-distribution'
import { OverdueCases } from '@/components/nprms/admin/overdue-cases'
import { ActivityLog } from '@/components/nprms/admin/activity-log'
import { UserPlus, FileText, ClipboardCheck } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <AuthLayout requiredRole="administrator">
      <NPRMSHeader
        title="Administrator Dashboard"
        description="Overview of all cases, officers, and system activity"
        actions={
          <>
            <Button className="w-full sm:w-auto h-9 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105 gap-2">
              <UserPlus className="w-4 h-4" />
              Create User
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto h-9 text-sm transition-all duration-300 hover:shadow-md hover:scale-105 gap-2"
            >
              <FileText className="w-4 h-4" />
              Assign Case
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto h-9 text-sm transition-all duration-300 hover:shadow-md hover:scale-105 gap-2"
            >
              <ClipboardCheck className="w-4 h-4" />
              View Reports
            </Button>
          </>
        }
      />

      <div className="mt-4 md:mt-5 space-y-3 md:space-y-4">
        {/* Stats Cards */}
        <AdminStatsCards />

        {/* Charts and Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          {/* Status Distribution */}
          <div className="lg:col-span-1">
            <StatusDistributionChart />
          </div>

          {/* Overdue Cases + Activity Log */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            <OverdueCases />
            <ActivityLog />
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
