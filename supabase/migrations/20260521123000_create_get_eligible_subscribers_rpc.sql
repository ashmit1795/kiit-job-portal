-- RPC: Get email-subscribed users eligible for a specific job
create or replace function placement.get_eligible_subscribers(
  p_branch_ids uuid[],
  p_batch_ids uuid[]
)
returns table (
  user_id uuid,
  email text,
  full_name text,
  avatar_url text
)
language sql stable as $$
  select u.id, u.email, u.full_name, u.avatar_url
  from placement.users u
  inner join placement.job_alert_subscriptions s on s.user_id = u.id
  where s.email_alerts = true
    and u.profile_completed = true
    and u.role in ('student', 'volunteer')
    and u.branch_id = any(p_branch_ids)
    and u.batch_id = any(p_batch_ids)
$$;
