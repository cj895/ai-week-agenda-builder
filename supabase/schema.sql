-- AI Week Agenda Builder Schema
-- Run this in Supabase SQL Editor (SQL Editor → New Query → paste → Run)

-- Events table (one per city)
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  dates JSONB NOT NULL DEFAULT '[]',
  days JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table (many per event)
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  title TEXT DEFAULT '',
  track_id TEXT NOT NULL,
  session_type TEXT NOT NULL,
  location TEXT NOT NULL,
  topic_tags JSONB DEFAULT '[]',
  audience_tags JSONB DEFAULT '[]',
  speakers JSONB DEFAULT '[]',
  sponsor TEXT DEFAULT '',
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'publish',
  locked BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_sessions_event ON sessions(event_id);
CREATE INDEX idx_sessions_date ON sessions(event_id, date);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER sessions_updated BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- For now: allow all operations with the anon key (your team uses the link)
-- You can tighten this later with Supabase Auth
CREATE POLICY "Allow all on events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sessions" ON sessions FOR ALL USING (true) WITH CHECK (true);
