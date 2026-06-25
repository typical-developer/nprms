import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { query, queryOne } from '../db.js'
import { signToken, requireAuth } from '../middleware/auth.js'
import { asyncHandler, publicUser, nowIso } from '../util.js'

export const authRouter = Router()

// POST /api/auth/login  { email, password } -> { token, user }
authRouter.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const user = await queryOne('SELECT * FROM users WHERE email = ?', [email])
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  if (user.status === 'Inactive') {
    return res.status(403).json({ error: 'This account is inactive. Contact an administrator.' })
  }

  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const last_login = nowIso()
  await query('UPDATE users SET last_login = ? WHERE user_id = ?', [last_login, user.user_id])

  const safe = publicUser({ ...user, last_login })
  res.json({ token: signToken(user), user: safe })
}))

// GET /api/auth/me -> current user
authRouter.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await queryOne('SELECT * FROM users WHERE user_id = ?', [req.user.user_id])
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(publicUser(user))
}))
