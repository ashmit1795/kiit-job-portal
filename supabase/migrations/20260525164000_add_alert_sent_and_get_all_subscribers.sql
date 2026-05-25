-- Add alert_sent column specifically to job_announcements table to track toggle state
ALTER TABLE placement.job_announcements ADD COLUMN IF NOT EXISTS alert_sent BOOLEAN NOT NULL DEFAULT FALSE;

-- Create helper to get all opted-in active subscribers for global/unlinked announcements
CREATE OR REPLACE FUNCTION placement.get_all_subscribers()
RETURNS TABLE (
  user_id uuid,
  email   text,
  full_name text,
  avatar_url text
)
LANGUAGE sql STABLE AS $$
  SELECT u.id, u.email, u.full_name, u.avatar_url
  FROM placement.users u
  INNER JOIN placement.job_alert_subscriptions s ON s.user_id = u.id
  WHERE s.email_alerts = true
    AND u.profile_completed = true
    AND u.role IN ('student', 'volunteer');
$$;
