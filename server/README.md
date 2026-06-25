# NPRMS Backend

A standalone **Node.js + Express + MySQL** REST API for the Nigeria Police
Records Management System, with a **free AI layer** (Groq Llama, with an offline
rule-based fallback so it works with zero configuration).

## Requirements

- Node.js 18+ (uses the built-in `fetch`)
- A database — either **SQLite** (embedded, zero install) or **MySQL 8+**

## Setup

```bash
cd server
npm install
cp .env.example .env        # choose DB_DRIVER (sqlite | mysql); set GROQ_API_KEY optionally
npm run db:reset            # creates the database, applies schema, seeds data
npm run dev                 # starts the API on http://localhost:4000
```

### Choosing a database

The data layer is driver-agnostic — pick one with `DB_DRIVER` in `.env`:

- **`DB_DRIVER=sqlite`** → an embedded file at `server/data/nprms.sqlite`. Nothing
  to install or run; great for local dev and demos.
- **`DB_DRIVER=mysql`** → a real MySQL server using the `DB_*` settings.

Same schema (`db/schema.sql` for MySQL, `db/schema.sqlite.sql` for SQLite), same
seed data, same REST API. `npm run db:reset` targets whichever driver is set.

`npm run db:reset` is shorthand for `db:init` (create database + tables) followed
by `db:seed` (load the demo dataset). Re-run it any time to start clean.

### Health check

```
GET http://localhost:4000/api/health
→ { "status": "ok", "db": "up", "ai": { "provider": "rule-based", "modelConfigured": false } }
```

## Authentication

JWT (Bearer token). `POST /api/auth/login` returns `{ token, user }`; send the
token as `Authorization: Bearer <token>` on every other request.

All seeded accounts share the password **`password123`**:

| Role          | Email                        |
| ------------- | ---------------------------- |
| Administrator | adekunle.okonkwo@nprms.ng    |
| Officer       | ibrahim.musa@nprms.ng        |
| Records       | folake.adeyemi@nprms.ng      |

## API surface

| Method | Path | Notes |
| ------ | ---- | ----- |
| POST   | `/api/auth/login` | email + password → token + user |
| GET    | `/api/auth/me` | current user |
| GET/POST | `/api/users` | list / create (admin) |
| PATCH  | `/api/users/me` | update own profile |
| GET/PATCH/DELETE | `/api/users/:id` | admin-managed |
| GET/POST | `/api/cases` | list / register |
| GET/PATCH/DELETE | `/api/cases/:id` | view / update / delete (delete = admin) |
| GET/POST | `/api/investigation-updates` | case diary entries |
| GET/POST | `/api/evidence` | evidence log |
| GET/POST | `/api/suspects`, PATCH `/api/suspects/:id` | suspects + status |
| GET/POST | `/api/witnesses` | witness statements |
| GET/POST/PATCH/DELETE | `/api/notifications` | + `PATCH /read-all` |
| GET/POST | `/api/activity` | activity log |
| GET    | `/api/ai/status` | which AI engine is active |
| POST   | `/api/ai/categorize` | `{ title, description }` → category + priority |
| POST   | `/api/ai/case-analysis` | `{ case_id }` → summary, risk, next steps |
| POST   | `/api/ai/chat` | `{ question, case_id?, history? }` |

Collection POSTs accept a client-supplied id (`case_id`, `evidence_id`, …) so the
frontend's optimistic UI and the database stay in agreement.

## The AI layer (free for all users)

The server key — not the user — pays for nothing here: Groq's API has a free
tier, and the key lives server-side, so **every user gets AI features at no cost**.

- **With `GROQ_API_KEY` set** → requests go to a free Groq-hosted Llama model
  (`GROQ_MODEL`, default `llama-3.3-70b-versatile`). Get a free key at
  <https://console.groq.com/keys>.
- **Without a key** → a deterministic, offline **rule-based engine** handles
  categorization, case analysis and Q&A. No setup, no internet, no cost.

If a Groq call fails at runtime, the request transparently falls back to the
rule-based engine and the response includes a `warning` field.
