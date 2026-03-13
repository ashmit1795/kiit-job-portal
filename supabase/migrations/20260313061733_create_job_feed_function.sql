
create or replace function placement.get_job_feed(
    p_branch_id uuid,
    p_batch_id uuid,
    p_cgpa numeric
)
returns setof placement.jobs
language sql
as $$

select j.*
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

order by j.created_at desc;

$$;