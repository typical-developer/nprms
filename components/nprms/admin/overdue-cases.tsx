import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getOverdueCases } from '@/lib/mock-data'
import { AlertTriangle } from 'lucide-react'

export function OverdueCases() {
  const overdueCases = getOverdueCases()

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'destructive'
      case 'High':
        return 'default'
      case 'Medium':
        return 'secondary'
      case 'Low':
        return 'outline'
      default:
        return 'default'
    }
  }

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">Overdue Cases</h3>
          <p className="text-xs text-muted-foreground">Under Investigation with no update in 7+ days</p>
        </div>
      </div>

      <div className="space-y-2">
        {overdueCases.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No overdue cases</p>
        ) : (
          overdueCases.map(caseItem => (
            <div
              key={caseItem.case_id}
              className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg hover:bg-destructive/10 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{caseItem.case_number}</p>
                  <p className="text-xs text-muted-foreground truncate">{caseItem.title}</p>
                </div>
                <Badge variant={getPriorityVariant(caseItem.priority)} className="whitespace-nowrap text-[10px]">
                  {caseItem.priority}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
