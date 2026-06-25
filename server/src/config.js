import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const config = {
  port: Number(process.env.PORT) || 4000,
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  db: {
    // 'mysql' (default, production) or 'sqlite' (zero-install embedded file).
    driver: (process.env.DB_DRIVER || 'mysql').toLowerCase(),
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nprms',
    sqliteFile: process.env.SQLITE_FILE || path.join(__dirname, '..', 'data', 'nprms.sqlite'),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-insecure-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  ai: {
    groqApiKey: process.env.GROQ_API_KEY || '',
    groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  },
}
