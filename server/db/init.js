// Creates the database/schema for whichever driver is configured.
//   DB_DRIVER=mysql  → CREATE DATABASE + apply schema.sql
//   DB_DRIVER=sqlite → create the .sqlite file + apply schema.sqlite.sql
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from '../src/config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function initSqlite() {
  const { default: Database } = await import('better-sqlite3')
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sqlite.sql'), 'utf8')
  fs.mkdirSync(path.dirname(config.db.sqliteFile), { recursive: true })

  console.log(`Initializing SQLite database at ${config.db.sqliteFile} …`)
  const db = new Database(config.db.sqliteFile)
  db.pragma('foreign_keys = OFF')
  db.exec(schema)
  db.close()
  console.log('✓ SQLite schema applied. Tables are ready.')
}

async function initMysql() {
  const { default: mysql } = await import('mysql2/promise')
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')

  const conn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true,
  })

  console.log(`Creating database \`${config.db.database}\` if it does not exist…`)
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  )
  await conn.query(`USE \`${config.db.database}\``)
  console.log('Applying schema…')
  await conn.query(schema)
  await conn.end()
  console.log('✓ Schema applied. Tables are ready.')
}

async function main() {
  if (config.db.driver === 'sqlite') await initSqlite()
  else await initMysql()
}

main().catch((err) => {
  console.error('✗ DB init failed:', err.message)
  process.exit(1)
})
