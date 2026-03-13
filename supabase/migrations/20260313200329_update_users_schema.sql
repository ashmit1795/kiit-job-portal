-- =========================================
-- 1. Add cached auth metadata columns
-- =========================================

alter table placement.users
add column if not exists full_name text,
add column if not exists avatar_url text;


-- =========================================
-- 2. Add indexes (optional but helpful)
-- =========================================

create index if not exists idx_users_full_name
on placement.users(full_name);