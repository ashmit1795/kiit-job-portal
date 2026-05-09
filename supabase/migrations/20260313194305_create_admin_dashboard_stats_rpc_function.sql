-- =========================================
-- 1. Drop existing function (safe redeploy)
-- =========================================

drop function if exists placement.admin_dashboard_stats();


-- =========================================
-- 2. Create admin dashboard stats RPC
-- =========================================

create function placement.admin_dashboard_stats()
returns json
language sql
stable
as $$

select json_build_object(

    -- =============================
    -- USER STATS
    -- =============================

    'users', json_build_object(

        'total',
        (select count(*) from placement.users),

        'students',
        (select count(*) from placement.users where role = 'student'),

        'volunteers',
        (select count(*) from placement.users where role = 'volunteer'),

        'admins',
        (select count(*) from placement.users where role = 'admin'),

        'profile_completed',
        (select count(*) from placement.users where profile_completed = true),

        'profile_incomplete',
        (select count(*) from placement.users where profile_completed = false)
    ),


    -- =============================
    -- JOB STATS
    -- =============================

    'jobs', json_build_object(

        'total',
        (select count(*) from placement.jobs),

        'approved',
        (select count(*) from placement.jobs
        where approval_status = 'approved'),

        'pending',
        (select count(*) from placement.jobs
        where approval_status = 'pending'),

        'rejected',
        (select count(*) from placement.jobs
        where approval_status = 'rejected'),

        'active',
        (select count(*) from placement.jobs
        where is_active = true),

        'expired',
        (select count(*) from placement.jobs
        where deadline < now())
    )

);

$$;