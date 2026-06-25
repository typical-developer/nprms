import { config } from './config.js'

// Driver-agnostic data layer. Routes/seed only use `query`, `queryOne` and a
// minimal `pool` shim, so the rest of the app is identical whether the backing
// store is MySQL (production default) or an embedded SQLite file (zero-install).

const driver = config.db.driver
export const dbDriver = driver

let query, queryOne, pool

if (driver === 'sqlite') {
  const { default: Database } = await import('better-sqlite3')
  const fs = await import('node:fs')
  const path = await import('node:path')

  fs.mkdirSync(path.dirname(config.db.sqliteFile), { recursive: true })
  const sdb = new Database(config.db.sqliteFile)
  sdb.pragma('journal_mode = WAL')
  sdb.pragma('foreign_keys = ON')

  const isRead = (sql) => /^\s*(select|pragma|with)/i.test(sql)
  const isNoop = (sql) => /^\s*set\s+foreign_key_checks/i.test(sql) // MySQL-only; ignore

  const normalize = (e) => {
    if (e && typeof e.code === 'string' && e.code.startsWith('SQLITE_CONSTRAINT')) {
      const err = new Error(e.message)
      err.code = 'ER_DUP_ENTRY' // so routes can detect duplicates uniformly
      return err
    }
    return e
  }

  const exec = (sql, params = []) => {
    if (isNoop(sql)) return []
    const safe = params.map((p) => (p === undefined ? null : p))
    const stmt = sdb.prepare(sql)
    return isRead(sql) ? stmt.all(...safe) : stmt.run(...safe)
  }

  query = async (sql, params = []) => {
    try {
      return exec(sql, params)
    } catch (e) {
      throw normalize(e)
    }
  }
  queryOne = async (sql, params = []) => {
    const rows = await query(sql, params)
    return Array.isArray(rows) ? rows[0] || null : null
  }

  // mysql2-compatible shim used by seed.js and the health check.
  pool = {
    query: async (sql, params = []) => [await query(sql, params)],
    execute: async (sql, params = []) => [await query(sql, params)],
    getConnection: async () => ({
      query: async (sql, params = []) => [await query(sql, params)],
      release: () => {},
    }),
    end: async () => sdb.close(),
  }
} else {
  const { default: mysql } = await import('mysql2/promise')

  pool = mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
  })

  query = async (sql, params = []) => {
    const [rows] = await pool.execute(sql, params)
    return rows
  }
  queryOne = async (sql, params = []) => {
    const rows = await query(sql, params)
    return rows[0] || null
  }
}

export { query, queryOne, pool }
