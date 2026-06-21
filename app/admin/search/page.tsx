'use client'

import { SearchResults } from '@/components/nprms/shared/search-results'

export default function AdminSearchPage() {
  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Search</h1>
          <p className="text-muted-foreground mt-1">Find cases and users across the system</p>
        </div>

        <SearchResults rolePrefix="admin" />
      </div>
  )
}
