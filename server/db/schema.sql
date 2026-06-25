-- NPRMS database schema (MySQL 8+)
-- Timestamp-like columns are stored as VARCHAR so the exact ISO strings the
-- frontend sends/expects are preserved byte-for-byte (no timezone reformatting).
-- ISO 8601 strings also sort correctly under plain lexical ORDER BY.

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS activity_log;
DROP TABLE IF EXISTS witnesses;
DROP TABLE IF EXISTS suspects;
DROP TABLE IF EXISTS evidence;
DROP TABLE IF EXISTS investigation_updates;
DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  user_id       VARCHAR(64)  NOT NULL,
  badge_number  VARCHAR(32)  NOT NULL,
  full_name     VARCHAR(160) NOT NULL,
  email         VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('administrator','officer','records') NOT NULL,
  phone         VARCHAR(40)  NOT NULL DEFAULT '',
  status        ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  last_login    VARCHAR(40)  NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_badge (badge_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE cases (
  case_id              VARCHAR(64)  NOT NULL,
  case_number          VARCHAR(64)  NOT NULL,
  title                VARCHAR(255) NOT NULL,
  description          TEXT         NOT NULL,
  category             ENUM('Theft','Assault','Fraud','Armed Robbery','Missing Person','Homicide','Cybercrime') NOT NULL,
  priority             ENUM('Low','Medium','High','Critical') NOT NULL,
  status               ENUM('Registered','Assigned','Under Investigation','Resolved','Closed','Archived','Reopened') NOT NULL,
  date_reported        VARCHAR(40)  NOT NULL,
  location             VARCHAR(255) NOT NULL DEFAULT '',
  complainant_name     VARCHAR(160) NOT NULL DEFAULT '',
  complainant_contact  VARCHAR(80)  NOT NULL DEFAULT '',
  complainant_address  VARCHAR(255) NOT NULL DEFAULT '',
  registered_by_id     VARCHAR(64)  NULL,
  assigned_officer_id  VARCHAR(64)  NULL,
  assigned_by_id       VARCHAR(64)  NULL,
  resolution_summary   TEXT         NULL,
  created_at           VARCHAR(40)  NOT NULL,
  updated_at           VARCHAR(40)  NOT NULL,
  archived_at          VARCHAR(40)  NULL,
  PRIMARY KEY (case_id),
  UNIQUE KEY uq_cases_number (case_number),
  KEY idx_cases_status (status),
  KEY idx_cases_officer (assigned_officer_id),
  CONSTRAINT fk_cases_registered_by FOREIGN KEY (registered_by_id) REFERENCES users(user_id) ON DELETE SET NULL,
  CONSTRAINT fk_cases_officer       FOREIGN KEY (assigned_officer_id) REFERENCES users(user_id) ON DELETE SET NULL,
  CONSTRAINT fk_cases_assigned_by   FOREIGN KEY (assigned_by_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE investigation_updates (
  update_id    VARCHAR(64)  NOT NULL,
  case_id      VARCHAR(64)  NOT NULL,
  officer_name VARCHAR(160) NOT NULL,
  update_type  ENUM('Note','Progress Update','Status Change') NOT NULL,
  content      TEXT         NOT NULL,
  created_at   VARCHAR(40)  NOT NULL,
  PRIMARY KEY (update_id),
  KEY idx_updates_case (case_id),
  CONSTRAINT fk_updates_case FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE evidence (
  evidence_id  VARCHAR(64)  NOT NULL,
  case_id      VARCHAR(64)  NOT NULL,
  uploaded_by  VARCHAR(160) NOT NULL,
  file_name    VARCHAR(255) NOT NULL,
  file_type    ENUM('Image','Video','Document','Audio') NOT NULL,
  description  TEXT         NOT NULL,
  custody_notes TEXT        NULL,
  uploaded_at  VARCHAR(40)  NOT NULL,
  PRIMARY KEY (evidence_id),
  KEY idx_evidence_case (case_id),
  CONSTRAINT fk_evidence_case FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE suspects (
  suspect_id        VARCHAR(64)  NOT NULL,
  case_id           VARCHAR(64)  NOT NULL,
  full_name         VARCHAR(160) NOT NULL,
  alias             VARCHAR(160) NULL,
  age               INT          NOT NULL DEFAULT 0,
  gender            VARCHAR(40)  NOT NULL DEFAULT 'Unknown',
  address           VARCHAR(255) NOT NULL DEFAULT 'Unknown',
  identifying_marks TEXT         NULL,
  status            ENUM('At Large','In Custody','Cleared') NOT NULL DEFAULT 'At Large',
  PRIMARY KEY (suspect_id),
  KEY idx_suspects_case (case_id),
  CONSTRAINT fk_suspects_case FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE witnesses (
  witness_id           VARCHAR(64)  NOT NULL,
  case_id              VARCHAR(64)  NOT NULL,
  full_name            VARCHAR(160) NOT NULL,
  contact              VARCHAR(80)  NOT NULL DEFAULT '',
  statement            TEXT         NOT NULL,
  relationship_to_case VARCHAR(160) NOT NULL DEFAULT '',
  PRIMARY KEY (witness_id),
  KEY idx_witnesses_case (case_id),
  CONSTRAINT fk_witnesses_case FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE activity_log (
  log_id      VARCHAR(64)  NOT NULL,
  user_name   VARCHAR(160) NOT NULL,
  action_type VARCHAR(120) NOT NULL,
  description VARCHAR(255) NOT NULL DEFAULT '',
  case_number VARCHAR(64)  NULL,
  timestamp   VARCHAR(40)  NOT NULL,
  PRIMARY KEY (log_id),
  KEY idx_activity_time (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE notifications (
  notification_id     VARCHAR(64) NOT NULL,
  message             VARCHAR(255) NOT NULL,
  type                ENUM('Case Assigned','Status Update','Evidence Added','System') NOT NULL,
  related_case_number VARCHAR(64) NULL,
  is_read             TINYINT(1)  NOT NULL DEFAULT 0,
  created_at          VARCHAR(40) NOT NULL,
  PRIMARY KEY (notification_id),
  KEY idx_notifications_time (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
