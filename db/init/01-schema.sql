-- Portfolio content schema. Loaded automatically by the MySQL image on first
-- boot (mounted into /docker-entrypoint-initdb.d). Rows are seeded by the API
-- from work-projects.json the first time the tables are empty.

CREATE TABLE IF NOT EXISTS content_meta (
  `key`   VARCHAR(64) PRIMARY KEY,
  `value` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS projects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(64)  NOT NULL UNIQUE,
  name        VARCHAR(128) NOT NULL,
  url         VARCHAR(512),
  tagline     TEXT,
  tagline_l1  TEXT,
  tagline_l2  TEXT,
  tagline_l3  TEXT,
  lesson      TEXT,
  highlight   TEXT,
  year        VARCHAR(16),
  sort_order  INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS project_notable_work (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  project_id  INT NOT NULL,
  label       VARCHAR(255) NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_notable_project FOREIGN KEY (project_id)
    REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS side_quests (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(64)  NOT NULL UNIQUE,
  name        VARCHAR(128) NOT NULL,
  role        VARCHAR(512),
  description TEXT,
  url         VARCHAR(512),
  year        VARCHAR(16),
  sort_order  INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
