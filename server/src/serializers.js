import { query } from './db.js'
import { publicUser } from './util.js'

// Build a lookup of user_id -> public user object.
export async function usersById() {
  const rows = await query('SELECT * FROM users')
  const map = new Map()
  for (const r of rows) map.set(r.user_id, publicUser(r))
  return map
}

// The frontend expects each case to embed full user objects for
// registered_by / assigned_officer / assigned_by. Expand the *_id columns.
export function expandCase(row, map) {
  if (!row) return null
  const {
    registered_by_id, assigned_officer_id, assigned_by_id, ...rest
  } = row
  return {
    ...rest,
    registered_by: map.get(registered_by_id) || null,
    assigned_officer: assigned_officer_id ? map.get(assigned_officer_id) || null : null,
    assigned_by: assigned_by_id ? map.get(assigned_by_id) || null : null,
  }
}

// Collapse an incoming case payload's nested users back into *_id columns.
export function caseIdsFromPayload(body) {
  return {
    registered_by_id: body.registered_by?.user_id ?? body.registered_by_id ?? null,
    assigned_officer_id: body.assigned_officer?.user_id ?? body.assigned_officer_id ?? null,
    assigned_by_id: body.assigned_by?.user_id ?? body.assigned_by_id ?? null,
  }
}
