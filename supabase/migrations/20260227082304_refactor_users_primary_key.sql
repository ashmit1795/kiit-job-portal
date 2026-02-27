-- ============================================
-- Refactor users table to use auth.users.id as PK
-- ============================================

-- Drop existing table (safe because early stage)
DROP TABLE IF EXISTS placement.users CASCADE;

-- Recreate users table
CREATE TABLE placement.users (
    id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    email TEXT UNIQUE NOT NULL,

    roll_number TEXT UNIQUE NOT NULL,

    cgpa NUMERIC(3,2)
        CHECK (cgpa >= 0 AND cgpa <= 10),

    role placement.user_role NOT NULL DEFAULT 'student',

    profile_completed BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for role queries
CREATE INDEX IF NOT EXISTS idx_users_role
ON placement.users(role);

-- Trigger to auto update updated_at
CREATE OR REPLACE FUNCTION placement.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at ON placement.users;

CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON placement.users
FOR EACH ROW
EXECUTE FUNCTION placement.set_updated_at();