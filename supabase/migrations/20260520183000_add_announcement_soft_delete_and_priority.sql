-- Adds is_active (soft-delete) and announcement_priority for announcements
ALTER TABLE IF EXISTS placement.job_announcements
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS announcement_priority integer DEFAULT 0;

-- Index for is_active and priority
CREATE INDEX IF NOT EXISTS idx_job_announcements_is_active ON placement.job_announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_job_announcements_priority ON placement.job_announcements(announcement_priority);
