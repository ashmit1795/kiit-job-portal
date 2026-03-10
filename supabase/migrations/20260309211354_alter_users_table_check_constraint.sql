ALTER TABLE placement.users
DROP CONSTRAINT users_profile_completion_check;

ALTER TABLE placement.users
ADD CONSTRAINT users_profile_completion_check
CHECK (
    profile_completed = false
    OR role = 'admin'
    OR (
        branch_id IS NOT NULL
        AND batch_id IS NOT NULL
        AND cgpa IS NOT NULL
        AND tenth_percentage IS NOT NULL
        AND twelfth_percentage IS NOT NULL
    )
);