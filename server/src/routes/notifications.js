import { Router } from 'express'
import { query, queryOne } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, genId, nowIso } from '../util.js'

export const notificationsRouter = Router()
notificationsRouter.use(requireAuth)

notificationsRouter.get('/', asyncHandler(async (_req, res) => {
  res.json(await query('SELECT * FROM notifications ORDER BY created_at DESC'))
}))

notificationsRouter.post('/', asyncHandler(async (req, res) => {
  const b = req.body || {}
  if (!b.message) return res.status(400).json({ error: 'message is required' })
  const notification_id = b.notification_id || genId('n')
  const created_at = b.created_at || nowIso()
  await query(
    `INSERT INTO notifications (notification_id, message, type, related_case_number, is_read, created_at)
     VALUES (?,?,?,?,?,?)`,
    [notification_id, b.message, b.type || 'System', b.related_case_number || null,
     b.is_read ? 1 : 0, created_at]
  )
  res.status(201).json(await queryOne('SELECT * FROM notifications WHERE notification_id = ?', [notification_id]))
}))

// Mark all as read — must precede /:id so "read-all" isn't treated as an id.
notificationsRouter.patch('/read-all', asyncHandler(async (_req, res) => {
  await query('UPDATE notifications SET is_read = 1')
  res.json({ ok: true })
}))

notificationsRouter.patch('/:id', asyncHandler(async (req, res) => {
  await query('UPDATE notifications SET is_read = ? WHERE notification_id = ?',
    [req.body?.is_read ? 1 : 0, req.params.id])
  const row = await queryOne('SELECT * FROM notifications WHERE notification_id = ?', [req.params.id])
  if (!row) return res.status(404).json({ error: 'Notification not found' })
  res.json(row)
}))

notificationsRouter.delete('/:id', asyncHandler(async (req, res) => {
  await query('DELETE FROM notifications WHERE notification_id = ?', [req.params.id])
  res.json({ ok: true })
}))

// Clear all.
notificationsRouter.delete('/', asyncHandler(async (_req, res) => {
  await query('DELETE FROM notifications')
  res.json({ ok: true })
}))
