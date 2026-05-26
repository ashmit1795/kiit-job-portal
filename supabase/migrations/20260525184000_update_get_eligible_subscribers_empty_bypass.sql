-- Drop existing function first
DROP FUNCTION IF EXISTS placement.get_eligible_subscribers(uuid[], uuid[]);

-- Recreate with robust fallback when branch or batch array is empty (skip filter logic)
CREATE OR REPLACE FUNCTION placement.get_eligible_subscribers(
  p_branch_ids uuid[],
  p_batch_ids  uuid[]
)
RETURNS TABLE (
  user_id uuid,
  email   text,
  full_name text,
  avatar_url text
)
LANGUAGE sql STABLE AS $$
  SELECT u.id, u.email, u.full_name, u.avatar_url
  FROM placement.users u
  INNER JOIN placement.job_alert_subscriptions s ON s.user_id = u.id
  WHERE s.email_alerts = true
    AND u.profile_completed = true
    AND u.role IN ('student', 'volunteer')
    
    -- Filter by batch if p_batch_ids is not empty
    AND (
        cardinality(p_batch_ids) = 0 OR p_batch_ids IS NULL
        OR u.batch_id = ANY(p_batch_ids)
    )
    
    -- Filter by branch if p_branch_ids is not empty (handles specific branches + 'ALL' WILD CARDS)
    AND (
        cardinality(p_branch_ids) = 0 OR p_branch_ids IS NULL
        OR u.branch_id IN (
            SELECT id FROM placement.branches
            WHERE id = ANY(p_branch_ids)
               OR program_id IN (
                   SELECT program_id 
                   FROM placement.branches 
                   WHERE id = ANY(p_branch_ids) AND code = 'ALL'
               )
        )
    )
$$;
