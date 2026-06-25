import express from 'express'
import cors from 'cors'
import { config } from './config.js'
import { pool, dbDriver } from './db.js'
import { aiStatus } from './ai/index.js'
import { authRouter } from './routes/auth.js'
import { usersRouter } from './routes/users.js'
import { casesRouter } from './routes/cases.js'
import { notificationsRouter } from './routes/notifications.js'
import { activityRouter } from './routes/activity.js'
import { aiRouter } from './routes/ai.js'

const app = express()

app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json({ limit: '1mb' }))

// Health / status — also reports which AI engine is active.
app.get('/api/health', async (_req, res) => {
  let db = 'down'
  try {
    await pool.query('SELECT 1')
    db = 'up'
  } catch {
    db = 'down'
  }
  res.json({ status: 'ok', driver: dbDriver, db, ai: aiStatus() })
})

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api', casesRouter) // /cases, /investigation-updates, /evidence, /suspects, /witnesses
app.use('/api/notifications', notificationsRouter)
app.use('/api/activity', activityRouter)
app.use('/api/ai', aiRouter)

// 404 for unknown API routes.
app.use((req, res) => res.status(404).json({ error: `Not found: ${req.method} ${req.path}` }))

// Central error handler.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('API error:', err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(config.port, () => {
  const ai = aiStatus()
  console.log(`\n NPRMS API listening on http://localhost:${config.port}`)
  console.log(`   Database driver: ${dbDriver}`)
  console.log(`   CORS origins: ${config.corsOrigin.join(', ')}`)
  console.log(`   AI engine: ${ai.provider}${ai.modelConfigured ? '' : ' (set GROQ_API_KEY for full LLM)'}\n`)
})
