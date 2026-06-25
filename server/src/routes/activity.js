import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, genId, nowIso } from '../util.js'

export const activityRouter = Router()
activityRouter.use(requireAuth)

activityRouter.get('/', asyncHandler(async (_req, res) => {
  res.json(await query('SELECT * FROM activity_log ORDER BY timestamp DESC LIMIT 100'))
}))

activityRouter.post('/', asyncHandler(async (req, res) => {
  const b = req.body || {}
  if (!b.action_type) return res.status(400).json({ error: 'action_type is required' })
  const log_id = b.log_id || genId('a')
  const timestamp = b.timestamp || nowIso()
  await query(
    `INSERT INTO activity_log (log_id, user_name, action_type, description, case_number, timestamp)
     VALUES (?,?,?,?,?,?)`,
    [log_id, b.user_name || '', b.action_type, b.description || '', b.case_number || null, timestamp]
  )
  res.status(201).json({ log_id, ...b, timestamp })
}))
