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
    AND u.batch_id = ANY(p_batch_ids)
    -- This handles specific branches AND automatically expands 'ALL' branches
    AND u.branch_id IN (
        SELECT id FROM placement.branches
        WHERE id = ANY(p_branch_ids)
           OR program_id IN (
               SELECT program_id 
               FROM placement.branches 
               WHERE id = ANY(p_branch_ids) AND code = 'ALL'
           )
    )
$$;
