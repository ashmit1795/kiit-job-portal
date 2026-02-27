-- ============================================
-- Create branches table
-- ============================================

CREATE TABLE placement.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Create batches table
-- ============================================

CREATE TABLE placement.batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Add foreign keys to users
-- ============================================

ALTER TABLE placement.users
ADD CONSTRAINT fk_users_branch
FOREIGN KEY (branch_id)
REFERENCES placement.branches(id)
ON DELETE RESTRICT;

ALTER TABLE placement.users
ADD CONSTRAINT fk_users_batch
FOREIGN KEY (batch_id)
REFERENCES placement.batches(id)
ON DELETE RESTRICT;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_branch_id
ON placement.users(branch_id);

CREATE INDEX IF NOT EXISTS idx_users_batch_id
ON placement.users(batch_id);