# NPRMS — Nigeria Police Records Management System

A full-stack, role-based case management platform for police stations.

- **Frontend** — Next.js 16 + React 19, Tailwind v4, shadcn/ui (this repo root)
- **Backend** — Node.js + Express + MySQL REST API (`server/`)
- **AI layer** — free for every user: a Groq-hosted Llama model when a key is
  configured, otherwise a built-in offline rule-based engine (zero setup)

Three roles — **Administrator**, **Investigating Officer**, **Records Officer** —
each with tailored dashboards, case workflows, search, notifications and settings.

## Architecture

```
Browser ──► Next.js app (lib/*-context.tsx)  ──fetch──►  Express API (server/)  ──►  MySQL
                         │                                        │
                    lib/api.ts (JWT)                         AI layer (Groq │ rule-based)
```

The React contexts keep an optimistic local copy of the data and sync every
change to the API in the background, so the UI stays instant while MySQL is the
source of truth. Collection writes carry client-generated ids so optimistic
state and the database never disagree.

## Quick start

You need **Node.js 18+**. The backend runs on **MySQL** (production) or an
embedded **SQLite** file (zero install — nothing to set up).

### Fastest path (SQLite, no database to install)

```bash
# terminal 1 — backend
cd server
npm install
cp .env.example .env        # then set DB_DRIVER=sqlite  (and optionally GROQ_API_KEY)
npm run db:reset            # creates server/data/nprms.sqlite + seeds demo data
npm run dev                 # → http://localhost:4000  (logs: driver: sqlite)

# terminal 2 — frontend, from the repo root
npm install
npm run dev                 # → http://localhost:3000
```

Or start **both at once** from the repo root: `npm run dev:all`.

`.env.local` already points the app at `http://localhost:4000/api`. Open
<http://localhost:3000> and sign in.

### Production path (MySQL)

Set `DB_DRIVER=mysql` and the `DB_*` credentials in `server/.env`, ensure MySQL
is running, then `npm run db:reset` and `npm run dev` as above. Same schema, same
API — only the storage engine changes.

### Demo accounts (password `password123`)

| Role          | Email                     |
| ------------- | ------------------------- |
| Administrator | adekunle.okonkwo@nprms.ng |
| Officer       | ibrahim.musa@nprms.ng     |
| Records       | folake.adeyemi@nprms.ng   |

## The AI layer (free for all users)

The AI features cost your users nothing — the model key lives on the server and
Groq's API has a free tier.

| AI feature | Where | Endpoint |
| ---------- | ----- | -------- |
| Auto-categorize a new report (category + priority + title) | Records ▸ Register Case ▸ *AI Auto-fill* | `POST /api/ai/categorize` |
| Case analysis — summary, risk level, key gaps, next steps | Any case detail ▸ *AI Investigation Assistant* | `POST /api/ai/case-analysis` |
| Ask questions about a case | Same panel ▸ *Ask about this case* | `POST /api/ai/chat` |

**To enable the real LLM:** get a free key at <https://console.groq.com/keys>
and set `GROQ_API_KEY` in `server/.env`. **Without a key**, the same features run
on a deterministic offline rule-based engine — no internet, no cost, no signup.

See [`server/README.md`](server/README.md) for the full API reference.

## Notes

- Timestamps are stored as ISO strings to match exactly what the UI sends/expects.
- `npm run db:reset` is safe to re-run; it clears and re-seeds the tables.
- Originally bootstrapped with [v0](https://v0.app); see `SYSTEM_OVERVIEW.md` for
  the role/permission and data-model deep dive.
