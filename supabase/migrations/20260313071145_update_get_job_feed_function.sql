-- =============================================
-- Drop existing get_job_feed function
-- =============================================

drop function if exists placement.get_job_feed(
    uuid,
    uuid,
    numeric
);

-- =============================================
-- Recreate get_job_feed with duplicate-safe logic
-- =============================================

create or replace function placement.get_job_feed(
    p_branch_id uuid,
    p_batch_id uuid,
    p_cgpa numeric
)
returns setof placement.jobs
language sql
as $$

select distinct on (j.id) j.*
from placement.jobs j

join placement.job_eligible_branches jeb
    on jeb.job_id = j.id

join placement.job_eligible_batches jebt
    on jebt.job_id = j.id

where
    j.approval_status = 'approved'
    and j.is_active = true
    and j.deadline >= now()

    and jeb.branch_id = p_branch_id
    and jebt.batch_id = p_batch_id

    and (
        j.min_cgpa is null
        or p_cgpa >= j.min_cgpa
    )

order by
    j.id,
    j.created_at desc;

$$;