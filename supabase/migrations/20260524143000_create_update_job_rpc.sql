-- ============================================
-- Create update_job RPC function
-- ============================================

create or replace function placement.update_job(
    p_job_id uuid,
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
    p_approval_status placement.approval_status_enum,
    p_branches uuid[],
    p_batches uuid[],
    p_locations text[],
    p_created_at timestamptz default null
)
returns void
language plpgsql
as $$
begin
    -- Update jobs table
    update placement.jobs
    set
        circular_number = p_circular_number,
        company_name = p_company_name,
        role_title = p_role_title,
        job_type = p_job_type,
        ctc = p_ctc,
        stipend = p_stipend,
        min_cgpa = p_min_cgpa,
        deadline = p_deadline,
        joining_date = p_joining_date,
        description = p_description,
        apply_link_1 = p_apply_link_1,
        apply_link_2 = p_apply_link_2,
        circular_file_path = p_circular_file_path,
        approval_status = p_approval_status,
        created_at = coalesce(p_created_at, created_at),
        updated_at = now()
    where id = p_job_id;

    -- Update eligible branches
    delete from placement.job_eligible_branches where job_id = p_job_id;
    insert into placement.job_eligible_branches(job_id, branch_id)
    select p_job_id, unnest(p_branches);

    -- Update eligible batches
    delete from placement.job_eligible_batches where job_id = p_job_id;
    insert into placement.job_eligible_batches(job_id, batch_id)
    select p_job_id, unnest(p_batches);

    -- Update locations
    delete from placement.job_locations where job_id = p_job_id;
    insert into placement.job_locations(job_id, location)
    select p_job_id, unnest(p_locations);

end;
$$;
