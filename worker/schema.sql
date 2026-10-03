CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  form_type TEXT NOT NULL CHECK (form_type IN ('contact', 'entry')),
  created_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
  values_json TEXT NOT NULL,
  attachment_key TEXT,
  attachment_name TEXT,
  attachment_type TEXT,
  attachment_size INTEGER
);

CREATE INDEX IF NOT EXISTS submissions_created_at ON submissions (created_at DESC);
