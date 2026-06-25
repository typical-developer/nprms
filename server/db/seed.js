// Seeds the database with the canonical NPRMS dataset.
// Idempotent: clears the tables first, then inserts. Passwords are hashed.
import bcrypt from 'bcryptjs'
import { pool } from '../src/db.js'
import {
  SEED_PASSWORD, users, cases, evidence, suspects, witnesses,
  investigationUpdates, activityLog, notifications,
} from './seed-data.js'

async function main() {
  const conn = await pool.getConnection()
  try {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0')
    for (const t of [
      'notifications', 'activity_log', 'witnesses', 'suspects',
      'evidence', 'investigation_updates', 'cases', 'users',
    ]) {
      await conn.query(`DELETE FROM ${t}`)
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1')

    const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10)

    for (const u of users) {
      await conn.query(
        `INSERT INTO users (user_id, badge_number, full_name, email, password_hash, role, phone, status, last_login)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [u.user_id, u.badge_number, u.full_name, u.email, passwordHash, u.role, u.phone, u.status, u.last_login]
      )
    }

    for (const c of cases) {
      await conn.query(
        `INSERT INTO cases (case_id, case_number, title, description, category, priority, status,
           date_reported, location, complainant_name, complainant_contact, complainant_address,
           registered_by_id, assigned_officer_id, assigned_by_id, resolution_summary,
           created_at, updated_at, archived_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [c.case_id, c.case_number, c.title, c.description, c.category, c.priority, c.status,
         c.date_reported, c.location, c.complainant_name, c.complainant_contact, c.complainant_address,
         c.registered_by_id, c.assigned_officer_id, c.assigned_by_id, c.resolution_summary,
         c.created_at, c.updated_at, c.archived_at]
      )
    }

    for (const iu of investigationUpdates) {
      await conn.query(
        `INSERT INTO investigation_updates (update_id, case_id, officer_name, update_type, content, created_at)
         VALUES (?,?,?,?,?,?)`,
        [iu.update_id, iu.case_id, iu.officer_name, iu.update_type, iu.content, iu.created_at]
      )
    }

    for (const e of evidence) {
      await conn.query(
        `INSERT INTO evidence (evidence_id, case_id, uploaded_by, file_name, file_type, description, custody_notes, uploaded_at)
         VALUES (?,?,?,?,?,?,?,?)`,
        [e.evidence_id, e.case_id, e.uploaded_by, e.file_name, e.file_type, e.description, e.custody_notes, e.uploaded_at]
      )
    }

    for (const s of suspects) {
      await conn.query(
        `INSERT INTO suspects (suspect_id, case_id, full_name, alias, age, gender, address, identifying_marks, status)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [s.suspect_id, s.case_id, s.full_name, s.alias, s.age, s.gender, s.address, s.identifying_marks, s.status]
      )
    }

    for (const w of witnesses) {
      await conn.query(
        `INSERT INTO witnesses (witness_id, case_id, full_name, contact, statement, relationship_to_case)
         VALUES (?,?,?,?,?,?)`,
        [w.witness_id, w.case_id, w.full_name, w.contact, w.statement, w.relationship_to_case]
      )
    }

    for (const a of activityLog) {
      await conn.query(
        `INSERT INTO activity_log (log_id, user_name, action_type, description, case_number, timestamp)
         VALUES (?,?,?,?,?,?)`,
        [a.log_id, a.user_name, a.action_type, a.description, a.case_number, a.timestamp]
      )
    }

    for (const n of notifications) {
      await conn.query(
        `INSERT INTO notifications (notification_id, message, type, related_case_number, is_read, created_at)
         VALUES (?,?,?,?,?,?)`,
        [n.notification_id, n.message, n.type, n.related_case_number, n.is_read, n.created_at]
      )
    }

    console.log(`✓ Seeded ${users.length} users, ${cases.length} cases, ${evidence.length} evidence, ` +
      `${suspects.length} suspects, ${witnesses.length} witnesses, ${investigationUpdates.length} updates, ` +
      `${activityLog.length} activity entries, ${notifications.length} notifications.`)
    console.log(`  All accounts share the password: ${SEED_PASSWORD}`)
  } finally {
    conn.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error('✗ Seed failed:', err.message)
  process.exit(1)
})
