-- ============================================
-- Academic Structure Refactor
-- ============================================

-- 1️⃣ Create programs table
CREATE TABLE placement.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    level TEXT NOT NULL CHECK (level IN ('UG', 'PG')),
    duration_years INTEGER NOT NULL CHECK (duration_years > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2️⃣ Drop branches table if exists (early stage safe)
DROP TABLE IF EXISTS placement.branches CASCADE;

-- 3️⃣ Recreate branches table with program reference
CREATE TABLE placement.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL
        REFERENCES placement.programs(id)
        ON DELETE RESTRICT,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (program_id, code)
);

-- 4️⃣ Drop foreign key constraints temporarily on users (if needed)
ALTER TABLE placement.users
DROP CONSTRAINT IF EXISTS fk_users_branch;

-- 5️⃣ Add branch foreign key again
ALTER TABLE placement.users
ADD CONSTRAINT fk_users_branch
FOREIGN KEY (branch_id)
REFERENCES placement.branches(id)
ON DELETE RESTRICT;

-- 6️⃣ Index for performance
CREATE INDEX IF NOT EXISTS idx_branches_program_id
ON placement.branches(program_id);