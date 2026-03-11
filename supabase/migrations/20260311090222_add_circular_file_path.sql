-- Add column to store circular file path in storage
ALTER TABLE placement.jobs
ADD COLUMN circular_file_path TEXT;

ALTER TABLE placement.jobs
DROP COLUMN circular_url;

-- Add index for faster lookups if needed
CREATE INDEX IF NOT EXISTS idx_jobs_circular_number
ON placement.jobs (circular_number);