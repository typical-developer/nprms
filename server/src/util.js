// Wrap an async route handler so thrown errors hit the error middleware.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

export function nowIso() {
  return new Date().toISOString()
}

// Generate an id with a prefix, e.g. genId('case') -> 'case-l8x...'.
export function genId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

// Strip password_hash before sending a user row to a client.
export function publicUser(row) {
  if (!row) return null
  const { password_hash, ...rest } = row
  return rest
}
