-- NPRMS schema (SQLite variant of schema.sql).
-- SQLite has no ENUM/ENGINE/CHARSET; enums become TEXT, booleans/ints INTEGER.
-- Timestamp-like columns stay TEXT (ISO strings), matching the MySQL build.

PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS activity_log;
DROP TABLE IF EXISTS witnesses;
DROP TABLE IF EXISTS suspects;
DROP TABLE IF EXISTS evidence;
DROP TABLE IF EXISTS investigation_updates;
DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id       TEXT PRIMARY KEY,
  badge_number  TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL,
  phone         TEXT NOT NULL DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'Active',
  last_login    TEXT,
  UNIQUE (email),
  UNIQUE (badge_number)
);

CREATE TABLE cases (
  case_id              TEXT PRIMARY KEY,
  case_number          TEXT NOT NULL,
  title                TEXT NOT NULL,
  description          TEXT NOT NULL,
  category             TEXT NOT NULL,
  priority             TEXT NOT NULL,
  status               TEXT NOT NULL,
  date_reported        TEXT NOT NULL,
  location             TEXT NOT NULL DEFAULT '',
  complainant_name     TEXT NOT NULL DEFAULT '',
  complainant_contact  TEXT NOT NULL DEFAULT '',
  complainant_address  TEXT NOT NULL DEFAULT '',
  registered_by_id     TEXT,
  assigned_officer_id  TEXT,
  assigned_by_id       TEXT,
  resolution_summary   TEXT,
  created_at           TEXT NOT NULL,
  updated_at           TEXT NOT NULL,
  archived_at          TEXT,
  UNIQUE (case_number),
  FOREIGN KEY (registered_by_id)    REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_officer_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_by_id)      REFERENCES users(user_id) ON DELETE SET NULL
);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_officer ON cases(assigned_officer_id);

CREATE TABLE investigation_updates (
  update_id    TEXT PRIMARY KEY,
  case_id      TEXT NOT NULL,
  officer_name TEXT NOT NULL,
  update_type  TEXT NOT NULL,
  content      TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
);
CREATE INDEX idx_updates_case ON investigation_updates(case_id);

CREATE TABLE evidence (
  evidence_id   TEXT PRIMARY KEY,
  case_id       TEXT NOT NULL,
  uploaded_by   TEXT NOT NULL,
  file_name     TEXT NOT NULL,
  file_type     TEXT NOT NULL,
  description   TEXT NOT NULL,
  custody_notes TEXT,
  uploaded_at   TEXT NOT NULL,
  FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
);
CREATE INDEX idx_evidence_case ON evidence(case_id);

CREATE TABLE suspects (
  suspect_id        TEXT PRIMARY KEY,
  case_id           TEXT NOT NULL,
  full_name         TEXT NOT NULL,
  alias             TEXT,
  age               INTEGER NOT NULL DEFAULT 0,
  gender            TEXT NOT NULL DEFAULT 'Unknown',
  address           TEXT NOT NULL DEFAULT 'Unknown',
  identifying_marks TEXT,
  status            TEXT NOT NULL DEFAULT 'At Large',
  FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
);
CREATE INDEX idx_suspects_case ON suspects(case_id);

CREATE TABLE witnesses (
  witness_id           TEXT PRIMARY KEY,
  case_id              TEXT NOT NULL,
  full_name            TEXT NOT NULL,
  contact              TEXT NOT NULL DEFAULT '',
  statement            TEXT NOT NULL,
  relationship_to_case TEXT NOT NULL DEFAULT '',
  FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
);
CREATE INDEX idx_witnesses_case ON witnesses(case_id);

CREATE TABLE activity_log (
  log_id      TEXT PRIMARY KEY,
  user_name   TEXT NOT NULL,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  case_number TEXT,
  timestamp   TEXT NOT NULL
);
CREATE INDEX idx_activity_time ON activity_log(timestamp);

CREATE TABLE notifications (
  notification_id     TEXT PRIMARY KEY,
  message             TEXT NOT NULL,
  type                TEXT NOT NULL,
  related_case_number TEXT,
  is_read             INTEGER NOT NULL DEFAULT 0,
  created_at          TEXT NOT NULL
);
CREATE INDEX idx_notifications_time ON notifications(created_at);
