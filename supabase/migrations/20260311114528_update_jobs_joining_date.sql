-- =============================
-- 1. Update jobs table
-- =============================

alter table placement.jobs
alter column joining_date type text
using joining_date::text;


-- =============================
-- 2. Drop existing RPC
-- =============================

drop function if exists placement.create_job(
    text,
    text,
    text,
    placement.job_type_enum,
    text,
    text,
    numeric,
    timestamptz,
    timestamptz,
    text,
    text,
    uuid,
    placement.approval_status_enum,
    uuid[],
    uuid[],
    text[]
);


-- =============================
-- 3. Recreate RPC with text joining_date
-- =============================

create function placement.create_job(
    p_circular_number text,
    p_company_name text,
    p_role_title text,
    p_job_type placement.job_type_enum,
    p_ctc text,
    p_stipend text,
    p_min_cgpa numeric,
    p_deadline timestamptz,
    p_joining_date text,
    p_description text,
    p_circular_file_path text,
    p_posted_by uuid,
    p_approval_status placement.approval_status_enum,
    p_branches uuid[],
    p_batches uuid[],
    p_locations text[]
)
returns uuid
language plpgsql
as $$
declare
    new_job_id uuid;
begin

    insert into placement.jobs(
        circular_number,
        company_name,
        role_title,
        job_type,
        ctc,
        stipend,
        min_cgpa,
        deadline,
        joining_date,
        description,
        circular_file_path,
        posted_by,
        approval_status
    )
    values (
        p_circular_number,
        p_company_name,
        p_role_title,
        p_job_type,
        p_ctc,
        p_stipend,
        p_min_cgpa,
        p_deadline,
        p_joining_date,
        p_description,
        p_circular_file_path,
        p_posted_by,
        p_approval_status
    )
    returning id into new_job_id;

    -- Eligible branches
    insert into placement.job_eligible_branches(job_id, branch_id)
    select new_job_id, unnest(p_branches);

    -- Eligible batches
    insert into placement.job_eligible_batches(job_id, batch_id)
    select new_job_id, unnest(p_batches);

    -- Locations
    insert into placement.job_locations(job_id, location)
    select new_job_id, unnest(p_locations);

    return new_job_id;

end;
$$;