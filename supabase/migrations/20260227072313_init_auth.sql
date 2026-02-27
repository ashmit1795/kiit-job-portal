-- ============================================
-- 20260227072313_init_auth.sql
-- Initialize placement schema and users table
-- ============================================

-- 1️⃣ Create schema
CREATE SCHEMA IF NOT EXISTS placement;

-- 2️⃣ Create ENUM type for roles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'user_role'
    ) THEN
        CREATE TYPE placement.user_role AS ENUM (
            'student',
            'volunteer',
            'admin'
        );
    END IF;
END$$;

-- 3️⃣ Create users table
CREATE TABLE IF NOT EXISTS placement.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    supabase_auth_id UUID UNIQUE NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    email TEXT UNIQUE NOT NULL,

    roll_number TEXT UNIQUE NOT NULL,

    cgpa NUMERIC(3,2) CHECK (cgpa >= 0 AND cgpa <= 10),

    role placement.user_role NOT NULL DEFAULT 'student',

    profile_completed BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4️⃣ Index for faster lookup by role
CREATE INDEX IF NOT EXISTS idx_users_role
ON placement.users(role);

-- 5️⃣ Index for faster lookup by supabase_auth_id
CREATE INDEX IF NOT EXISTS idx_users_supabase_auth_id
ON placement.users(supabase_auth_id);

-- 6️⃣ Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION placement.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7️⃣ Attach trigger
DROP TRIGGER IF EXISTS trigger_set_updated_at ON placement.users;

CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON placement.users
FOR EACH ROW
EXECUTE FUNCTION placement.set_updated_at();