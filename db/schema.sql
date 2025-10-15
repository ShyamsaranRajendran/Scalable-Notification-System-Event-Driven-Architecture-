-- Notifications DB schema

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  recipient VARCHAR(255) NOT NULL,
  channel VARCHAR(50) NOT NULL,
  subject VARCHAR(255),
  body TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Audit table for delivery attempts
CREATE TABLE IF NOT EXISTS notification_attempts (
  id SERIAL PRIMARY KEY,
  notification_id INT REFERENCES notifications(id) ON DELETE CASCADE,
  provider VARCHAR(100),
  success BOOLEAN,
  response TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
