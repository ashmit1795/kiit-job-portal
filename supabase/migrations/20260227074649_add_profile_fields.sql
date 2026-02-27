-- Add branch_id and batch_id columns

ALTER TABLE placement.users
ADD COLUMN branch_id UUID,
ADD COLUMN batch_id UUID;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_users_branch_id
ON placement.users(branch_id);

CREATE INDEX IF NOT EXISTS idx_users_batch_id
ON placement.users(batch_id);