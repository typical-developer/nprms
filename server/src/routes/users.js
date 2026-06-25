import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { query, queryOne } from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler, publicUser, genId } from '../util.js'

export const usersRouter = Router()
usersRouter.use(requireAuth)

const DEFAULT_PASSWORD = 'password123'
const EDITABLE = ['badge_number', 'full_name', 'email', 'role', 'phone', 'status']

// GET /api/users
usersRouter.get('/', asyncHandler(async (_req, res) => {
  const rows = await query('SELECT * FROM users ORDER BY full_name')
  res.json(rows.map(publicUser))
}))

// PATCH /api/users/me  — update own profile (any authenticated role)
usersRouter.patch('/me', asyncHandler(async (req, res) => {
  await applyUpdate(req.user.user_id, req.body, res)
}))

// GET /api/users/:id
usersRouter.get('/:id', asyncHandler(async (req, res) => {
  const row = await queryOne('SELECT * FROM users WHERE user_id = ?', [req.params.id])
  if (!row) return res.status(404).json({ error: 'User not found' })
  res.json(publicUser(row))
}))

// POST /api/users  (admin only) — accepts a client-supplied user_id
usersRouter.post('/', requireRole('administrator'), asyncHandler(async (req, res) => {
  const b = req.body || {}
  if (!b.full_name || !b.email || !b.role) {
    return res.status(400).json({ error: 'full_name, email and role are required' })
  }
  const user_id = b.user_id || genId('u')
  const passwordHash = await bcrypt.hash(b.password || DEFAULT_PASSWORD, 10)
  try {
    await query(
      `INSERT INTO users (user_id, badge_number, full_name, email, password_hash, role, phone, status, last_login)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [user_id, b.badge_number || '', b.full_name, b.email, passwordHash, b.role,
       b.phone || '', b.status || 'Active', b.last_login || null]
    )
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A user with that email or badge number already exists' })
    }
    throw e
  }
  const row = await queryOne('SELECT * FROM users WHERE user_id = ?', [user_id])
  res.status(201).json(publicUser(row))
}))

// PATCH /api/users/:id  (admin only)
usersRouter.patch('/:id', requireRole('administrator'), asyncHandler(async (req, res) => {
  await applyUpdate(req.params.id, req.body, res)
}))

// DELETE /api/users/:id  (admin only)
usersRouter.delete('/:id', requireRole('administrator'), asyncHandler(async (req, res) => {
  if (req.params.id === req.user.user_id) {
    return res.status(400).json({ error: 'You cannot delete your own account' })
  }
  await query('DELETE FROM users WHERE user_id = ?', [req.params.id])
  res.json({ ok: true })
}))

async function applyUpdate(userId, body, res) {
  const fields = []
  const values = []
  for (const key of EDITABLE) {
    if (body[key] !== undefined) {
      fields.push(`${key} = ?`)
      values.push(body[key])
    }
  }
  if (body.password) {
    fields.push('password_hash = ?')
    values.push(await bcrypt.hash(body.password, 10))
  }
  if (fields.length === 0) {
    const row = await queryOne('SELECT * FROM users WHERE user_id = ?', [userId])
    return res.json(publicUser(row))
  }
  values.push(userId)
  await query(`UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`, values)
  const row = await queryOne('SELECT * FROM users WHERE user_id = ?', [userId])
  if (!row) return res.status(404).json({ error: 'User not found' })
  res.json(publicUser(row))
}
