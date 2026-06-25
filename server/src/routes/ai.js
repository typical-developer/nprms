import { Router } from 'express'
import { query, queryOne } from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../util.js'
import { usersById, expandCase } from '../serializers.js'
import { aiStatus, aiCategorize, aiAnalyzeCase, aiChat, aiInsights, aiCaseReport } from '../ai/index.js'

export const aiRouter = Router()
aiRouter.use(requireAuth)

// Load a case plus everything attached to it.
async function loadCaseBundle(caseId) {
  if (!caseId) return { caseData: null, related: {} }
  const [row, map] = await Promise.all([
    queryOne('SELECT * FROM cases WHERE case_id = ?', [caseId]),
    usersById(),
  ])
  if (!row) return { caseData: null, related: {} }
  const [updates, evidence, suspects, witnesses] = await Promise.all([
    query('SELECT * FROM investigation_updates WHERE case_id = ? ORDER BY created_at DESC', [caseId]),
    query('SELECT * FROM evidence WHERE case_id = ?', [caseId]),
    query('SELECT * FROM suspects WHERE case_id = ?', [caseId]),
    query('SELECT * FROM witnesses WHERE case_id = ?', [caseId]),
  ])
  return { caseData: expandCase(row, map), related: { updates, evidence, suspects, witnesses } }
}

// GET /api/ai/status — which engine is active (model vs fallback)
aiRouter.get('/status', (_req, res) => res.json(aiStatus()))

// POST /api/ai/categorize  { title, description }
aiRouter.post('/categorize', asyncHandler(async (req, res) => {
  const { title, description } = req.body || {}
  if (!title && !description) {
    return res.status(400).json({ error: 'Provide a title or description to classify' })
  }
  res.json(await aiCategorize({ title, description }))
}))

// POST /api/ai/case-analysis  { case_id }
aiRouter.post('/case-analysis', asyncHandler(async (req, res) => {
  const { case_id } = req.body || {}
  const { caseData, related } = await loadCaseBundle(case_id)
  if (!caseData) return res.status(404).json({ error: 'Case not found' })
  res.json(await aiAnalyzeCase(caseData, related))
}))

// POST /api/ai/chat  { question, history?, case_id? }
aiRouter.post('/chat', asyncHandler(async (req, res) => {
  const { question, history, case_id } = req.body || {}
  if (!question) return res.status(400).json({ error: 'question is required' })
  const { caseData, related } = await loadCaseBundle(case_id)
  res.json(await aiChat({ question, history: history || [], caseData, related }))
}))

// GET /api/ai/insights  (admin) — station-wide AI briefing computed from live data
aiRouter.get('/insights', requireRole('administrator'), asyncHandler(async (_req, res) => {
  const rows = await query('SELECT category, priority, status, updated_at, assigned_officer_id FROM cases')
  const total = rows.length
  const tally = (key) => rows.reduce((m, r) => ((m[r[key]] = (m[r[key]] || 0) + 1), m), {})
  const byStatus = tally('status')
  const byCategory = tally('category')

  const closedOrResolved = (byStatus['Closed'] || 0) + (byStatus['Resolved'] || 0)
  const active = rows.filter((r) => !['Closed', 'Archived'].includes(r.status)).length
  const unassigned = rows.filter((r) => !r.assigned_officer_id && !['Closed', 'Archived'].includes(r.status)).length
  const criticalOpen = rows.filter((r) => r.priority === 'Critical' && !['Closed', 'Archived'].includes(r.status)).length

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const overdue = rows.filter((r) => r.status === 'Under Investigation' && new Date(r.updated_at) < sevenDaysAgo).length

  const stats = {
    total, active, overdue, unassigned, criticalOpen,
    resolutionRate: total ? Math.round((closedOrResolved / total) * 100) : 0,
    byStatus, byCategory,
  }
  res.json({ stats, ...(await aiInsights(stats)) })
}))

// POST /api/ai/report  { case_id } — AI-drafted investigation report
aiRouter.post('/report', asyncHandler(async (req, res) => {
  const { case_id } = req.body || {}
  const { caseData, related } = await loadCaseBundle(case_id)
  if (!caseData) return res.status(404).json({ error: 'Case not found' })
  res.json({ case_number: caseData.case_number, ...(await aiCaseReport(caseData, related)) })
}))
