import jwt from 'jsonwebtoken'
import { config } from '../config.js'

// Verifies the Bearer token and attaches `req.user = { user_id, role, email }`.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: 'Missing authentication token' })
  }
  try {
    req.user = jwt.verify(token, config.jwt.secret)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Guard a route to one or more roles.
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions for this action' })
    }
    next()
  }
}

export function signToken(user) {
  return jwt.sign(
    { user_id: user.user_id, role: user.role, email: user.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  )
}
