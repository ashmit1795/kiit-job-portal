ALTER TABLE placement.users
ADD COLUMN tenth_percentage NUMERIC(5,2),
ADD COLUMN twelfth_percentage NUMERIC(5,2),
ADD COLUMN resume_url TEXT;

ALTER TABLE placement.users
ADD CONSTRAINT users_tenth_check
CHECK (tenth_percentage >= 0 AND tenth_percentage <= 100);

ALTER TABLE placement.users
ADD CONSTRAINT users_twelfth_check
CHECK (twelfth_percentage >= 0 AND twelfth_percentage <= 100);