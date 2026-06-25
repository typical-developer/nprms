'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Sparkles, Send, AlertTriangle, Loader2, ShieldAlert, ListChecks, ScrollText, FileText, Download } from 'lucide-react'
import { aiClient, type CaseAnalysis, type ChatTurn } from '@/lib/ai'
import jsPDF from 'jspdf'
import { format } from 'date-fns'

interface Props {
  caseId: string
  caseNumber: string
}

function riskVariant(level: string) {
  const l = level.toLowerCase()
  if (l === 'high') return 'destructive'
  if (l === 'elevated') return 'warning'
  return 'secondary'
}

export function AiCaseAssistant({ caseId, caseNumber }: Props) {
  const [provider, setProvider] = useState<'groq' | 'rule-based' | null>(null)
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const [messages, setMessages] = useState<ChatTurn[]>([])
  const [question, setQuestion] = useState('')
  const [chatting, setChatting] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [report, setReport] = useState<string | null>(null)
  const [reporting, setReporting] = useState(false)

  useEffect(() => {
    aiClient.status().then((s) => setProvider(s.provider)).catch(() => setProvider(null))
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const runAnalysis = async () => {
    setAnalyzing(true)
    setError('')
    try {
      setAnalysis(await aiClient.analyzeCase(caseId))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  const generateReport = async () => {
    setReporting(true)
    setError('')
    try {
      const res = await aiClient.report(caseId)
      setReport(res.report)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Report generation failed')
    } finally {
      setReporting(false)
    }
  }

  const downloadPdf = () => {
    if (!report) return
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text(`NPRMS Investigation Report — ${caseNumber}`, 14, 16)
    doc.setFontSize(9)
    doc.setTextColor(120)
    doc.text(`Generated ${format(new Date(), 'PPP p')}`, 14, 22)
    doc.setTextColor(20)
    doc.setFontSize(10)
    const lines = doc.splitTextToSize(report, 180)
    doc.text(lines, 14, 32)
    doc.save(`nprms-report-${caseNumber}-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  }

  const send = async () => {
    const q = question.trim()
    if (!q || chatting) return
    const history = messages
    setMessages((prev) => [...prev, { role: 'user', content: q }])
    setQuestion('')
    setChatting(true)
    try {
      const res = await aiClient.chat(q, { case_id: caseId, history })
      setMessages((prev) => [...prev, { role: 'assistant', content: res.answer }])
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, I could not answer that: ${e instanceof Error ? e.message : 'error'}` },
      ])
    } finally {
      setChatting(false)
    }
  }

  return (
    <Card className="p-6 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Investigation Assistant</h2>
        </div>
        {provider && (
          <Badge variant={provider === 'groq' ? 'default' : 'secondary'} className="text-xs">
            {provider === 'groq' ? 'AI model' : 'Offline engine'}
          </Badge>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Generate an instant analysis of {caseNumber} or ask questions about the case file. Free for every user.
      </p>

      <Button onClick={runAnalysis} disabled={analyzing} className="gap-2">
        {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {analyzing ? 'Analyzing…' : analysis ? 'Re-analyze case' : 'Analyze this case'}
      </Button>

      {error && (
        <div className="mt-3 flex items-start gap-2 text-sm text-destructive">
          <AlertTriangle className="w-4 h-4 mt-0.5" /> {error}
        </div>
      )}

      {analysis && (
        <div className="mt-5 space-y-4">
          {analysis.warning && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {analysis.warning}
            </p>
          )}

          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Risk level:</span>
            <Badge variant={riskVariant(analysis.riskLevel) as any}>{analysis.riskLevel}</Badge>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <ScrollText className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Summary</h3>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysis.summary}</p>
          </div>

          {analysis.keyPoints?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Key points & gaps</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {analysis.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}

          {analysis.suggestedNextSteps?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ListChecks className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Suggested next steps</h3>
              </div>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                {analysis.suggestedNextSteps.map((p, i) => <li key={i}>{p}</li>)}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* AI-drafted report */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" /> AI-drafted investigation report
          </h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={generateReport} disabled={reporting} className="gap-2">
              {reporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {reporting ? 'Drafting…' : report ? 'Regenerate' : 'Draft report'}
            </Button>
            {report && (
              <Button size="sm" onClick={downloadPdf} className="gap-2">
                <Download className="w-4 h-4" /> PDF
              </Button>
            )}
          </div>
        </div>
        {report && (
          <pre className="mt-3 max-h-80 overflow-y-auto rounded-lg bg-muted p-3 text-xs whitespace-pre-wrap font-mono">
            {report}
          </pre>
        )}
      </div>

      {/* Ask AI */}
      <div className="mt-6 pt-4 border-t">
        <h3 className="text-sm font-semibold mb-2">Ask about this case</h3>
        {messages.length > 0 && (
          <div ref={scrollRef} className="mb-3 max-h-64 overflow-y-auto space-y-3 pr-1">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div
                  className={
                    'inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ' +
                    (m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground')
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {chatting && (
              <div className="text-left">
                <div className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Thinking…
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="e.g. What should the officer do next?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send() }}
            disabled={chatting}
          />
          <Button onClick={send} disabled={chatting || !question.trim()} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
