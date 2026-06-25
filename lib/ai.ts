'use client'

import { api } from './api'
import type { CaseCategory, Priority } from './mock-data'

export interface AiStatus {
  provider: 'groq' | 'rule-based'
  modelConfigured: boolean
}

export interface CategorizeResult {
  category: CaseCategory
  priority: Priority
  suggestedTitle?: string
  rationale?: string
  confidence?: string
  source: 'groq' | 'rule-based'
  warning?: string
}

export interface CaseAnalysis {
  summary: string
  riskLevel: string
  keyPoints: string[]
  suggestedNextSteps: string[]
  source: 'groq' | 'rule-based'
  warning?: string
}

export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResult {
  answer: string
  note?: string
  source: 'groq' | 'rule-based'
  warning?: string
}

export interface InsightsResult {
  stats: {
    total: number
    active: number
    overdue: number
    unassigned: number
    criticalOpen: number
    resolutionRate: number
    byStatus: Record<string, number>
    byCategory: Record<string, number>
  }
  headline: string
  trends: string[]
  priorities: string[]
  recommendations: string[]
  source: 'groq' | 'rule-based'
  warning?: string
}

export interface ReportResult {
  case_number: string
  report: string
  source: 'groq' | 'rule-based'
  warning?: string
}

export const aiClient = {
  status: () => api.get<AiStatus>('/ai/status'),
  categorize: (title: string, description: string) =>
    api.post<CategorizeResult>('/ai/categorize', { title, description }),
  analyzeCase: (case_id: string) =>
    api.post<CaseAnalysis>('/ai/case-analysis', { case_id }),
  chat: (question: string, opts: { case_id?: string; history?: ChatTurn[] } = {}) =>
    api.post<ChatResult>('/ai/chat', { question, case_id: opts.case_id, history: opts.history || [] }),
  insights: () => api.get<InsightsResult>('/ai/insights'),
  report: (case_id: string) => api.post<ReportResult>('/ai/report', { case_id }),
}
