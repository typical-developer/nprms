# NPRMS System Overview

**Nigeria Police Records Management System** — A full-stack web application for managing criminal case records, investigation workflows, and officer coordination across a police station.

---

## Table of Contents

1. [System Purpose](#1-system-purpose)
2. [Architecture Overview](#2-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [User Roles](#4-user-roles)
5. [Frontend](#5-frontend)
6. [Backend API](#6-backend-api)
7. [Database Layer](#7-database-layer)
8. [AI Layer](#8-ai-layer)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [State Management](#10-state-management)
11. [PDF Generation](#11-pdf-generation)
12. [Configuration & Environment](#12-configuration--environment)
13. [Running the Project](#13-running-the-project)
14. [Key Architectural Decisions](#14-key-architectural-decisions)

---

## 1. System Purpose

NPRMS digitizes police station operations:

- **Case registration** — Records officers file incoming complaints with structured incident data
- **Case investigation** — Investigating officers log updates, add evidence, manage suspects and witnesses
- **Case oversight** — Station administrators view all cases, generate reports, manage staff
- **AI assistance** — LLM-powered categorization, case analysis, investigation reports, and conversational Q&A

---

## 2. Architecture Overview

```
+---------------------------------------------+
|               Browser (Next.js)              |
|  +----------+ +----------+ +-------------+  |
|  |  Admin   | | Officer  | |   Records   |  |
|  |  Portal  | |  Portal  | |   Portal    |  |
|  +----+-----+ +----+-----+ +------+------+  |
|       +------------+--------------+         |
|              React Contexts                  |
|     (CaseContext, AuthContext, UserContext)   |
+------------------+---------------------------+
                   | HTTP + JWT (port 3000)
                   v
+---------------------------------------------+
|              Express API (port 4000)         |
|  /api/auth  /api/cases  /api/users           |
|  /api/notifications  /api/ai  /api/activity  |
|                                              |
|  +-------------+     +--------------------+  |
|  |  AI Layer   |     |  Database Layer    |  |
|  |  Groq LLM   |     |  SQLite (dev)      |  |
|  |  + Fallback |     |  MySQL (prod)      |  |
|  +-------------+     +--------------------+  |
+---------------------------------------------+
```

The frontend and backend live in the same repo. The frontend talks to the backend exclusively via REST over HTTP. No server-side rendering is used for data — all fetches happen client-side.

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 16 (App Router) |
| UI components | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| PDF generation | jsPDF + jspdf-autotable |
| Backend framework | Express (ESM) |
| Database (dev) | SQLite via better-sqlite3 |
| Database (prod) | MySQL via mysql2 |
| Authentication | JWT (jsonwebtoken + bcryptjs) |
| AI / LLM | Groq API (llama-3.3-70b-versatile) |
| AI fallback | Rule-based engine (built-in, offline) |
| Language | TypeScript (frontend), JavaScript ESM (backend) |

---

## 4. User Roles

Three roles exist, each with a separate UI portal and different backend permissions.

| Role | Label | Access |
|---|---|---|
| `administrator` | Station Commander | All cases, all users, reports, admin briefings, full CRUD |
| `officer` | Investigating Officer | Own assigned cases, add updates/evidence/suspects/witnesses |
| `records` | Records Officer | Register new cases, view all cases, archive |

Role is stored in the JWT and enforced server-side via the `requireRole()` middleware.

---

## 5. Frontend

### App Structure

The Next.js App Router is organized into three role-specific sub-apps:

```
app/
+-- login/page.tsx               # Email/password login
+-- layout.tsx                   # Root: wraps all context providers
+-- admin/                       # Administrator portal
|   +-- layout.tsx               # Admin shell with sidebar
|   +-- dashboard/page.tsx       # Stats, charts, overdue cases, AI insights
|   +-- cases/page.tsx           # All cases list
|   +-- cases/[caseId]/page.tsx  # Full case detail
|   +-- reports/page.tsx         # PDF reports dashboard
|   +-- users/page.tsx           # User management
|   +-- search|notifications|profile|settings|help
+-- officer/                     # Officer portal
|   +-- dashboard/page.tsx       # My stats, assigned cases
|   +-- cases/[caseId]/page.tsx  # Case detail with update/evidence/suspect tools
|   +-- search|notifications|profile|settings|help
+-- records/                     # Records officer portal
    +-- register/page.tsx        # Case registration form (with AI auto-fill)
    +-- cases/[caseId]/page.tsx  # Case viewer
    +-- archive/page.tsx         # Archived cases
    +-- search|notifications|profile|settings|help
```

### Key Shared Components

**`components/nprms/shared/case-detail.tsx`**
The core case view/edit UI, rendered for all three roles. Contains tabbed sections:
- Case metadata (title, status, priority, category, location, complainant)
- Investigation updates (log of officer notes and progress)
- Evidence (file list with type, custody notes, uploaded-by)
- Suspects (full suspect profiles with status: At Large / In Custody / Cleared)
- Witnesses (statements and relationship to case)
- Resolution summary (when case is closed)
- AI Case Assistant panel (analysis, Q&A chat, report PDF download)

**`components/nprms/shared/ai-case-assistant.tsx`**
Floating AI panel embedded in case detail:
- Shows case risk level, key gaps, next steps (from `/api/ai/case-analysis`)
- Multi-turn chat against the case context (from `/api/ai/chat`)
- Downloads AI-generated investigation report as a PDF (from `/api/ai/report`)
- Indicates which AI engine is active (Groq or rule-based fallback)

**`components/nprms/records/case-registration-form.tsx`**
New case intake form. When the officer types a title and description, it calls `/api/ai/categorize` and pre-fills the category, priority, and suggested title.

**`components/nprms/admin/reports-dashboard.tsx`**
Generates a PDF report (via jsPDF) with case statistics, status distribution, and category breakdown.

**`components/nprms/admin/ai-insights.tsx`**
Calls `/api/ai/insights` to display a station-wide AI briefing: active trends, priorities, and officer recommendations.

### UI Library

`components/ui/` contains 60+ shadcn/ui components (buttons, tables, dialogs, forms, charts, etc.) providing the full design system.

---

## 6. Backend API

The Express server (`server/`) runs on port 4000. All routes are prefixed `/api/`. Every route except login requires a valid JWT Bearer token.

### Auth Routes

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Validate credentials, return `{ token, user }` |
| `GET` | `/api/auth/me` | Return current user from token |

### Case Routes

All case routes require `requireAuth`. Delete is admin-only.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/cases` | All cases (user IDs expanded to full objects) |
| `GET` | `/api/cases/:id` | Single case |
| `POST` | `/api/cases` | Create case (accepts client-supplied ID) |
| `PATCH` | `/api/cases/:id` | Update case fields |
| `DELETE` | `/api/cases/:id` | Delete case (cascades all related records) |
| `GET` | `/api/investigation-updates` | All updates, desc by date |
| `POST` | `/api/investigation-updates` | Add update (touches `cases.updated_at`) |
| `GET` | `/api/evidence` | All evidence |
| `POST` | `/api/evidence` | Add evidence item |
| `GET` | `/api/suspects` | All suspects |
| `POST` | `/api/suspects` | Add suspect |
| `PATCH` | `/api/suspects/:id` | Update suspect status |
| `GET` | `/api/witnesses` | All witnesses |
| `POST` | `/api/witnesses` | Add witness |

### User Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/users` | All users (password hash stripped) |
| `POST` | `/api/users` | Create user (admin only, bcrypt hash generated) |
| `PATCH` | `/api/users/:id` | Update any user (admin only) |
| `PATCH` | `/api/users/me` | Update own profile |
| `DELETE` | `/api/users/:id` | Delete user (admin only) |

### Notification Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/notifications` | All notifications, desc |
| `POST` | `/api/notifications` | Create notification |
| `PATCH` | `/api/notifications/:id` | Mark as read |
| `PATCH` | `/api/notifications/read-all` | Mark all as read |
| `DELETE` | `/api/notifications/:id` | Delete single |
| `DELETE` | `/api/notifications` | Clear all |

### Activity Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/activity` | Last 100 log entries |
| `POST` | `/api/activity` | Log an action |

### AI Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/ai/status` | Which engine is active |
| `POST` | `/api/ai/categorize` | Classify incident from title + description |
| `POST` | `/api/ai/case-analysis` | Full analysis of a case |
| `POST` | `/api/ai/chat` | Conversational Q&A about a case |
| `GET` | `/api/ai/insights` | Station-wide briefing (admin only) |
| `POST` | `/api/ai/report` | Generate full investigation report text |

All AI case routes load the complete case bundle (case + updates + evidence + suspects + witnesses) before calling the AI function.

### Health

`GET /api/health` — Returns `{ status: 'ok', db: 'up'|'error', ai: { provider, modelConfigured } }`.

---

## 7. Database Layer

### Dual Driver Support

`server/src/db.js` is a driver-agnostic abstraction. The active driver is selected by `DB_DRIVER` in `server/.env`:

```
DB_DRIVER=sqlite   -> better-sqlite3, file at server/data/nprms.sqlite
DB_DRIVER=mysql    -> mysql2/promise pool
```

Both expose the same interface: `query(sql, params)` and `queryOne(sql, params)`.

### Schema

Eight tables, identical in structure across both drivers (SQLite uses `TEXT` where MySQL uses `ENUM`):

| Table | Purpose |
|---|---|
| `users` | Police staff accounts (badge, name, email, bcrypt hash, role) |
| `cases` | Criminal cases (metadata, complainant info, assignment, status) |
| `investigation_updates` | Officer notes and progress entries per case |
| `evidence` | Evidence items per case (file type, description, custody notes) |
| `suspects` | Suspect profiles per case (name, alias, age, address, status) |
| `witnesses` | Witness statements per case |
| `activity_log` | Audit trail of all user actions |
| `notifications` | System notification messages |

All foreign keys cascade-delete from `cases` downward. Timestamps are stored as ISO 8601 strings (`VARCHAR`) to prevent MySQL timezone reformatting.

### Case Categories

`Homicide`, `Robbery`, `Assault`, `Theft`, `Fraud`, `Missing Person`, `Domestic Violence`, `Drug Offense`, `Cybercrime`, `Vandalism`, `Kidnapping`, `Sexual Offense`, `Other`

### Case Statuses

`Open`, `Under Investigation`, `Pending Review`, `Closed`, `Archived`, `Reopened`

### Database Scripts

```bash
cd server
npm run db:init    # Create tables if not exist
npm run db:seed    # Insert demo data
npm run db:reset   # Wipe and reseed
```

Demo accounts all use password `password123`. Example admin: `adekunle.okonkwo@nprms.ng`.

---

## 8. AI Layer

### Architecture

```
server/src/ai/
+-- index.js      # Orchestrator -- routes to Groq or fallback
+-- groq.js       # Groq API client (OpenAI-compatible HTTP)
+-- fallback.js   # Rule-based offline engine
```

All AI functions are called through `index.js`. If `GROQ_API_KEY` is set and the Groq API call succeeds, Groq is used. If the key is missing or the call fails, the fallback runs silently without surfacing an error to the user.

### Groq Client (`groq.js`)

- Posts to Groq's `/v1/chat/completions` (OpenAI-compatible)
- JSON mode (`response_format.type = 'json_object'`) for structured outputs
- Fallback JSON extraction: if parsing fails, extracts the first `{...}` block from the response
- Default model: `llama-3.3-70b-versatile` (configurable via `GROQ_MODEL`)

### Rule-Based Fallback (`fallback.js`)

A deterministic engine requiring zero configuration:

- **Categorization** — Keyword matching maps incident title/description to a category and priority (weapons, minors, and large monetary amounts elevate priority)
- **Case analysis** — Counts suspects/evidence/witnesses; detects stale or incomplete investigations; suggests category-specific next steps
- **Insights** — Derives trends and priorities from aggregate case statistics
- **Chat** — Regex pattern matching returns the relevant analysis section for the question asked
- **Report** — Builds a fully structured investigation report from raw case data, section by section, no invention

### AI Functions Summary

| Function | Groq Approach | Fallback Approach |
|---|---|---|
| `aiCategorize(title, desc)` | JSON-mode classification prompt | Keyword map with priority rules |
| `aiAnalyzeCase(case, related)` | Structured analysis prompt | Count-based gap detection |
| `aiChat(question, history, case, related)` | Conversational with history | Regex Q&A patterns |
| `aiInsights(stats)` | Station briefing prompt | Threshold-based recommendations |
| `aiCaseReport(case, related)` | Long-form report prompt | Section-by-section template |

---

## 9. Authentication & Authorization

### Login Flow

1. `POST /api/auth/login` validates email and bcrypt password
2. Returns a signed JWT containing `{ user_id, role, email }`
3. Frontend stores token in `localStorage` under `nprms-token`
4. On every app mount, `AuthContext` validates the stored token via `GET /api/auth/me`
5. Token expires after 7 days (`JWT_EXPIRES_IN`)

### Server Middleware

**`requireAuth`** — Validates Bearer token on every protected route. Attaches decoded user to `req.user`. Returns `401` if token is missing or invalid.

**`requireRole(...roles)`** — Guards admin-only routes. Returns `403` if the user role is not in the allowed list.

### Password Handling

Passwords are never returned to clients. The `publicUser()` serializer in `server/src/util.js` strips `password_hash` from every user object before it leaves the API. Bcrypt salt rounds default to 10.

---

## 10. State Management

Five React Contexts act as a client-side cache synchronized with the backend:

| Context | State | Key Methods |
|---|---|---|
| `AuthContext` | Current user, auth status | `login()`, `logout()`, `updateUser()` |
| `CaseContext` | Cases, updates, evidence, suspects, witnesses | Full CRUD per entity, `refresh()` |
| `UserContext` | All users | `addUser()`, `updateUser()`, `deleteUser()`, `refresh()` |
| `NotificationContext` | Notifications | `addNotification()`, `markAsRead()`, `markAllAsRead()`, `refresh()` |
| `SettingsContext` | User preferences | Theme and layout prefs |

### Optimistic Updates

All mutation methods follow this pattern:
1. Immediately update local context state — UI updates instantly
2. Fire `POST`/`PATCH`/`DELETE` to the API in the background
3. On success: local state is already consistent
4. On failure: log error, call `refresh()` to re-sync from server

This keeps all 30+ pages responsive without per-page loading state management.

### Client-Supplied IDs

`POST` requests include a client-generated ID (`genId(prefix)` from `server/src/util.js`). The frontend generates IDs optimistically before the server responds so the state reference is stable. The backend accepts and stores the supplied ID.

### API Client (`lib/api.ts`)

Thin wrapper around `fetch`:
- Reads `NEXT_PUBLIC_API_URL` from env
- Injects `Authorization: Bearer <token>` from localStorage on every request
- Exports `api.get<T>()`, `api.post<T>()`, `api.patch<T>()`, `api.del<T>()`
- Throws typed `ApiError` with HTTP status code

---

## 11. PDF Generation

### Admin Reports (`components/nprms/admin/reports-dashboard.tsx`)

Generated client-side via jsPDF + jspdf-autotable:
- Station name header and generation timestamp
- Case status distribution table
- Category breakdown table
- Filename: `nprms-report-{timestamp}.pdf`

### Investigation Report (`components/nprms/shared/ai-case-assistant.tsx`)

Generated after fetching report text from `/api/ai/report`:
- Case number header, generation timestamp, AI engine source
- Full report body (plain text, multi-line wrapped with y-coordinate tracking)
- Filename: `investigation-report-{caseNumber}.pdf`

---

## 12. Configuration & Environment

### Frontend (`/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Backend (`/server/.env`)

```env
PORT=4000
CORS_ORIGIN=http://localhost:3000

# Database
DB_DRIVER=sqlite                    # sqlite or mysql
SQLITE_FILE=./data/nprms.sqlite
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=nprms

# Auth
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# AI (optional -- system works fully without this key)
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
```

---

## 13. Running the Project

### Quick Start (SQLite, no database install required)

```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Seed the database
cd server && npm run db:reset && cd ..

# Start both services
npm run dev:all
```

- Frontend: http://localhost:3000
- API: http://localhost:4000

### Separate Terminals

```bash
# Terminal 1 -- API
cd server && npm run dev

# Terminal 2 -- Frontend
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

### Enable Groq AI

Add `GROQ_API_KEY=gsk_...` to `server/.env` and restart the server. The system detects it automatically. Remove it to revert to the rule-based fallback.

### Switch to MySQL

```env
DB_DRIVER=mysql
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=nprms
```

Then: `cd server && npm run db:reset`

---

## 14. Key Architectural Decisions

### ISO 8601 Timestamps as VARCHAR
Timestamps are stored as ISO 8601 strings rather than MySQL `DATETIME` or `TIMESTAMP` types. This prevents MySQL from silently reformatting values or applying timezone offsets, ensuring round-trip fidelity.

### SQLite for Local Dev
`DB_DRIVER=sqlite` runs with `better-sqlite3` — no database server required. The schema is structurally identical to MySQL (`TEXT` instead of `ENUM`). Contributors can run the full system immediately.

### Five Contexts with Identical Hook Signatures
The migration from mock-data to a real API was designed to leave all 30+ pages untouched. Each context kept its original method signatures while adding optimistic updates and background sync internally. Pages never needed to be aware of the network.

### Client-Supplied IDs
The optimistic update pattern requires a stable ID for a new record immediately — before the server acknowledges the POST. Allowing the client to supply the ID keeps UI state and DB state in agreement without a second sync round-trip.

### Groq with Deterministic Fallback
Requiring an API key for AI features would block local development and demo deployments. The rule-based fallback makes every AI feature work offline and configuration-free. Groq is a purely additive upgrade.

### Monorepo with Parallel Dev Script
Frontend and backend share the repo root. `npm run dev:all` (`scripts/dev-all.mjs`) spawns both processes with color-coded output. This eliminates multi-repo coordination overhead for a single-station deployment target.
