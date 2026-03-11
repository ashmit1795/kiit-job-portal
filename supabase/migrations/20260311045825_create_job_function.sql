create or replace function placement.create_job(
    p_circular_number text,
    p_company_name text,
    p_role_title text,
    p_job_type placement.job_type_enum,
    p_ctc text,
    p_min_cgpa numeric,
    p_deadline timestamptz,
    p_description text,
    p_circular_url text,
    p_posted_by uuid,
    p_approval_status placement.approval_status_enum,
    p_branches uuid[],
    p_batches uuid[]
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
        min_cgpa,
        deadline,
        description,
        circular_url,
        posted_by,
        approval_status
    )
    values (
        p_circular_number,
        p_company_name,
        p_role_title,
        p_job_type,
        p_ctc,
        p_min_cgpa,
        p_deadline,
        p_description,
        p_circular_url,
        p_posted_by,
        p_approval_status
    )
    returning id into new_job_id;

    insert into placement.job_eligible_branches(job_id, branch_id)
    select new_job_id, unnest(p_branches);

    insert into placement.job_eligible_batches(job_id, batch_id)
    select new_job_id, unnest(p_batches);

    return new_job_id;

end;
$$;