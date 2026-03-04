-- Remove NOT NULL from academic fields
ALTER TABLE placement.users
ALTER COLUMN tenth_percentage DROP NOT NULL;

ALTER TABLE placement.users
ALTER COLUMN twelfth_percentage DROP NOT NULL;