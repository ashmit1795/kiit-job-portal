-- Drop old function first (matching parameters exactly)
drop function if exists placement.create_job(
    text,
    text,
    text,
    placement.job_type_enum,
    text,
    text,
    numeric,
    timestamptz,
    text,
    text,
    text,
    text,
    text,
    uuid,
    placement.approval_status_enum,
    uuid[],
    uuid[],
    text[]
);

-- Recreate with p_created_at parameter
create or replace function placement.create_job(
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
    p_apply_link_1 text,
    p_apply_link_2 text,
    p_circular_file_path text,
    p_posted_by uuid,
    p_approval_status placement.approval_status_enum,
    p_branches uuid[],
    p_batches uuid[],
    p_locations text[],
    p_created_at timestamptz default null
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
        apply_link_1,
        apply_link_2,
        circular_file_path,
        posted_by,
        approval_status,
        created_at
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
        p_apply_link_1,
        p_apply_link_2,
        p_circular_file_path,
        p_posted_by,
        p_approval_status,
        coalesce(p_created_at, now())
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
