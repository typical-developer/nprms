'use client'

import { AuthLayout } from '@/components/nprms/auth-layout'
import { SearchResults } from '@/components/nprms/shared/search-results'

export default function RecordsSearchPage() {
  return (
    <AuthLayout title="Search" requiredRole="records">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Search</h1>
          <p className="text-muted-foreground mt-1">Find cases and users</p>
        </div>

        <SearchResults rolePrefix="records" />
      </div>
    </AuthLayout>
  )
}
