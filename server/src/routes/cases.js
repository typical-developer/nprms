import { Router } from 'express'
import { query, queryOne } from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler, genId, nowIso } from '../util.js'
import { usersById, expandCase, caseIdsFromPayload } from '../serializers.js'

export const casesRouter = Router()
casesRouter.use(requireAuth)

const CASE_FIELDS = [
  'case_number', 'title', 'description', 'category', 'priority', 'status',
  'date_reported', 'location', 'complainant_name', 'complainant_contact',
  'complainant_address', 'resolution_summary', 'created_at', 'updated_at', 'archived_at',
]

// ── Cases ─────────────────────────────────────────────────────────────────────

casesRouter.get('/cases', asyncHandler(async (_req, res) => {
  const [rows, map] = await Promise.all([
    query('SELECT * FROM cases ORDER BY created_at DESC'),
    usersById(),
  ])
  res.json(rows.map((r) => expandCase(r, map)))
}))

casesRouter.get('/cases/:id', asyncHandler(async (req, res) => {
  const [row, map] = await Promise.all([
    queryOne('SELECT * FROM cases WHERE case_id = ?', [req.params.id]),
    usersById(),
  ])
  if (!row) return res.status(404).json({ error: 'Case not found' })
  res.json(expandCase(row, map))
}))

casesRouter.post('/cases', asyncHandler(async (req, res) => {
  const b = req.body || {}
  if (!b.title || !b.category || !b.priority) {
    return res.status(400).json({ error: 'title, category and priority are required' })
  }
  const case_id = b.case_id || genId('case')
  const ids = caseIdsFromPayload(b)
  const created = b.created_at || nowIso()
  try {
    await query(
      `INSERT INTO cases (case_id, case_number, title, description, category, priority, status,
         date_reported, location, complainant_name, complainant_contact, complainant_address,
         registered_by_id, assigned_officer_id, assigned_by_id, resolution_summary,
         created_at, updated_at, archived_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [case_id, b.case_number || case_id, b.title, b.description || '', b.category, b.priority,
       b.status || 'Registered', b.date_reported || created, b.location || '',
       b.complainant_name || '', b.complainant_contact || '', b.complainant_address || '',
       ids.registered_by_id || req.user.user_id, ids.assigned_officer_id, ids.assigned_by_id,
       b.resolution_summary || null, created, b.updated_at || created, b.archived_at || null]
    )
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A case with that case number already exists' })
    }
    throw e
  }
  const [row, map] = await Promise.all([
    queryOne('SELECT * FROM cases WHERE case_id = ?', [case_id]),
    usersById(),
  ])
  res.status(201).json(expandCase(row, map))
}))

casesRouter.patch('/cases/:id', asyncHandler(async (req, res) => {
  const b = req.body || {}
  const fields = []
  const values = []
  for (const key of CASE_FIELDS) {
    if (b[key] !== undefined) { fields.push(`${key} = ?`); values.push(b[key]) }
  }
  // Allow reassigning users via either nested objects or *_id keys.
  const ids = caseIdsFromPayload(b)
  if (b.assigned_officer !== undefined || b.assigned_officer_id !== undefined) {
    fields.push('assigned_officer_id = ?'); values.push(ids.assigned_officer_id)
  }
  if (b.assigned_by !== undefined || b.assigned_by_id !== undefined) {
    fields.push('assigned_by_id = ?'); values.push(ids.assigned_by_id)
  }
  if (fields.length === 0) return res.status(400).json({ error: 'No updatable fields supplied' })

  values.push(req.params.id)
  await query(`UPDATE cases SET ${fields.join(', ')} WHERE case_id = ?`, values)
  const [row, map] = await Promise.all([
    queryOne('SELECT * FROM cases WHERE case_id = ?', [req.params.id]),
    usersById(),
  ])
  if (!row) return res.status(404).json({ error: 'Case not found' })
  res.json(expandCase(row, map))
}))

casesRouter.delete('/cases/:id', requireRole('administrator'), asyncHandler(async (req, res) => {
  await query('DELETE FROM cases WHERE case_id = ?', [req.params.id])
  res.json({ ok: true })
}))

// ── Investigation updates ─────────────────────────────────────────────────────

casesRouter.get('/investigation-updates', asyncHandler(async (_req, res) => {
  res.json(await query('SELECT * FROM investigation_updates ORDER BY created_at DESC'))
}))

casesRouter.post('/investigation-updates', asyncHandler(async (req, res) => {
  const b = req.body || {}
  if (!b.case_id || !b.content) return res.status(400).json({ error: 'case_id and content are required' })
  const update_id = b.update_id || genId('iu')
  const created_at = b.created_at || nowIso()
  await query(
    `INSERT INTO investigation_updates (update_id, case_id, officer_name, update_type, content, created_at)
     VALUES (?,?,?,?,?,?)`,
    [update_id, b.case_id, b.officer_name || '', b.update_type || 'Note', b.content, created_at]
  )
  // Keep the parent case's updated_at in sync, mirroring frontend behavior.
  await query('UPDATE cases SET updated_at = ? WHERE case_id = ?', [created_at, b.case_id])
  res.status(201).json(await queryOne('SELECT * FROM investigation_updates WHERE update_id = ?', [update_id]))
}))

// ── Evidence ──────────────────────────────────────────────────────────────────

casesRouter.get('/evidence', asyncHandler(async (_req, res) => {
  res.json(await query('SELECT * FROM evidence ORDER BY uploaded_at DESC'))
}))

casesRouter.post('/evidence', asyncHandler(async (req, res) => {
  const b = req.body || {}
  if (!b.case_id || !b.file_name) return res.status(400).json({ error: 'case_id and file_name are required' })
  const evidence_id = b.evidence_id || genId('ev')
  const uploaded_at = b.uploaded_at || nowIso()
  await query(
    `INSERT INTO evidence (evidence_id, case_id, uploaded_by, file_name, file_type, description, custody_notes, uploaded_at)
     VALUES (?,?,?,?,?,?,?,?)`,
    [evidence_id, b.case_id, b.uploaded_by || '', b.file_name, b.file_type || 'Document',
     b.description || '', b.custody_notes || '', uploaded_at]
  )
  await query('UPDATE cases SET updated_at = ? WHERE case_id = ?', [uploaded_at, b.case_id])
  res.status(201).json(await queryOne('SELECT * FROM evidence WHERE evidence_id = ?', [evidence_id]))
}))

// ── Suspects ──────────────────────────────────────────────────────────────────

casesRouter.get('/suspects', asyncHandler(async (_req, res) => {
  res.json(await query('SELECT * FROM suspects'))
}))

casesRouter.post('/suspects', asyncHandler(async (req, res) => {
  const b = req.body || {}
  if (!b.case_id || !b.full_name) return res.status(400).json({ error: 'case_id and full_name are required' })
  const suspect_id = b.suspect_id || genId('s')
  await query(
    `INSERT INTO suspects (suspect_id, case_id, full_name, alias, age, gender, address, identifying_marks, status)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [suspect_id, b.case_id, b.full_name, b.alias || null, b.age || 0, b.gender || 'Unknown',
     b.address || 'Unknown', b.identifying_marks || '', b.status || 'At Large']
  )
  res.status(201).json(await queryOne('SELECT * FROM suspects WHERE suspect_id = ?', [suspect_id]))
}))

casesRouter.patch('/suspects/:id', asyncHandler(async (req, res) => {
  const { status } = req.body || {}
  if (!status) return res.status(400).json({ error: 'status is required' })
  await query('UPDATE suspects SET status = ? WHERE suspect_id = ?', [status, req.params.id])
  const row = await queryOne('SELECT * FROM suspects WHERE suspect_id = ?', [req.params.id])
  if (!row) return res.status(404).json({ error: 'Suspect not found' })
  res.json(row)
}))

// ── Witnesses ─────────────────────────────────────────────────────────────────

casesRouter.get('/witnesses', asyncHandler(async (_req, res) => {
  res.json(await query('SELECT * FROM witnesses'))
}))

casesRouter.post('/witnesses', asyncHandler(async (req, res) => {
  const b = req.body || {}
  if (!b.case_id || !b.full_name) return res.status(400).json({ error: 'case_id and full_name are required' })
  const witness_id = b.witness_id || genId('w')
  await query(
    `INSERT INTO witnesses (witness_id, case_id, full_name, contact, statement, relationship_to_case)
     VALUES (?,?,?,?,?,?)`,
    [witness_id, b.case_id, b.full_name, b.contact || '', b.statement || '', b.relationship_to_case || '']
  )
  res.status(201).json(await queryOne('SELECT * FROM witnesses WHERE witness_id = ?', [witness_id]))
}))
