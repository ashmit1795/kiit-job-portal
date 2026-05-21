-- =========================================
-- Add contact fields to users
-- =========================================

alter table placement.users
add column if not exists personal_email text,
add column if not exists phone_number text,
add column if not exists linkedin_url text,
add column if not exists github_url text,
add column if not exists portfolio_url text;
