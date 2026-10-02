-- Aggregated daily counters. Only counts are kept: no IPs, no device IDs.
CREATE TABLE IF NOT EXISTS counts (
  day   TEXT NOT NULL,           -- YYYY-MM-DD (UTC)
  name  TEXT NOT NULL,           -- pageview | visitor | start-normal | finish-normal | start-challenge | finish-challenge
  lang  TEXT NOT NULL,           -- zh | de
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, name, lang)
);

-- Salted one-way hashes used only to count unique visitors per day.
-- The salt changes daily and rows older than yesterday are deleted by the cron job.
CREATE TABLE IF NOT EXISTS visitors (
  day  TEXT NOT NULL,
  hash TEXT NOT NULL,
  PRIMARY KEY (day, hash)
);
