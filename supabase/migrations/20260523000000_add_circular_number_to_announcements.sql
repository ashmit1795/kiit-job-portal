-- Add optional circular_number column to job_announcements
ALTER TABLE placement.job_announcements
  ADD COLUMN circular_number text null;
