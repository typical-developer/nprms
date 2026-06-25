'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Loader2, AlertTriangle, TrendingUp, Flag, Lightbulb } from 'lucide-react'
import { aiClient, type InsightsResult } from '@/lib/ai'

export function AiInsights() {
  const [data, setData] = useState<InsightsResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    setLoading(true)
    setError('')
    try {
      setData(await aiClient.insights())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate insights')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Command Briefing</h3>
          {data && (
            <Badge variant={data.source === 'groq' ? 'default' : 'secondary'} className="text-xs">
              {data.source === 'groq' ? 'AI model' : 'Offline engine'}
            </Badge>
          )}
        </div>
        <Button onClick={run} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Analyzing caseload…' : data ? 'Refresh briefing' : 'Generate briefing'}
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-destructive">
          <AlertTriangle className="w-4 h-4 mt-0.5" /> {error}
        </div>
      )}

      {!data && !error && (
        <p className="text-sm text-muted-foreground">
          Generate an AI briefing across the whole caseload — trends, priorities and recommended actions. Free for every user.
        </p>
      )}

      {data && (
        <div className="space-y-5">
          {data.warning && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {data.warning}
            </p>
          )}

          <p className="text-base font-medium">{data.headline}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Stat label="Total" value={data.stats.total} />
            <Stat label="Active" value={data.stats.active} />
            <Stat label="Overdue" value={data.stats.overdue} highlight={data.stats.overdue > 0} />
            <Stat label="Unassigned" value={data.stats.unassigned} highlight={data.stats.unassigned > 0} />
            <Stat label="Critical open" value={data.stats.criticalOpen} highlight={data.stats.criticalOpen > 0} />
            <Stat label="Resolved %" value={`${data.stats.resolutionRate}%`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <InsightList icon={<TrendingUp className="w-4 h-4" />} title="Trends" items={data.trends} />
            <InsightList icon={<Flag className="w-4 h-4" />} title="Priorities" items={data.priorities} />
            <InsightList icon={<Lightbulb className="w-4 h-4" />} title="Recommendations" items={data.recommendations} />
          </div>
        </div>
      )}
    </Card>
  )
}

function Stat({ label, value, highlight }: { label: string; value: number | string; highlight?: boolean }) {
  return (
    <div className={'rounded-lg border p-3 ' + (highlight ? 'border-amber-400/50 bg-amber-50/50' : 'bg-card')}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}

function InsightList({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
        <span className="text-muted-foreground">{icon}</span> {title}
      </div>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-primary">•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
