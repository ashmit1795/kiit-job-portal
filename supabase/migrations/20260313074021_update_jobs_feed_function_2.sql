drop function if exists placement.get_job_feed(uuid, uuid, numeric);

create or replace function placement.get_job_feed(
    p_branch_id uuid,
    p_batch_id uuid,
    p_cgpa numeric
)
returns table (
    id uuid,
    circular_number text,
    company_name text,
    role_title text,
    job_type placement.job_type_enum,
    ctc text,
    stipend text,
    min_cgpa numeric,
    deadline timestamptz,
    description text,
    circular_file_path text,
    approval_status placement.approval_status_enum,
    is_active boolean,
    created_at timestamptz,
    posted_by uuid,
    joining_date text,
    locations jsonb,
    eligible_branches jsonb,
    eligible_batches jsonb
)
language sql
as $$

select
    j.id,
    j.circular_number,
    j.company_name,
    j.role_title,
    j.job_type,
    j.ctc,
    j.stipend,
    j.min_cgpa,
    j.deadline,
    j.description,
    j.circular_file_path,
    j.approval_status,
    j.is_active,
    j.created_at,
    j.posted_by,
    j.joining_date,

    -- locations
    (
        select jsonb_agg(
            jsonb_build_object(
                'location', l.location
            )
        )
        from placement.job_locations l
        where l.job_id = j.id
    ) as locations,

    -- branches
    (
        select jsonb_agg(
            jsonb_build_object(
                'branch',
                jsonb_build_object(
                    'id', br.id,
                    'code', br.code,
                    'name', br.name,
                    'program',
                    jsonb_build_object(
                        'name', p.name,
                        'level', p.level
                    )
                )
            )
        )
        from placement.job_eligible_branches jeb
        join placement.branches br on br.id = jeb.branch_id
        join placement.programs p on p.id = br.program_id
        where jeb.job_id = j.id
    ) as eligible_branches,

    -- batches
    (
        select jsonb_agg(
            jsonb_build_object(
                'batch',
                jsonb_build_object(
                    'id', b.id,
                    'year', b.year
                )
            )
        )
        from placement.job_eligible_batches jebt
        join placement.batches b on b.id = jebt.batch_id
        where jebt.job_id = j.id
    ) as eligible_batches

from placement.jobs j

where
    j.approval_status = 'approved'
    and j.is_active = true
    and j.deadline >= now()

    and exists (
        select 1
        from placement.job_eligible_branches jeb
        where jeb.job_id = j.id
        and jeb.branch_id = p_branch_id
    )

    and exists (
        select 1
        from placement.job_eligible_batches jebt
        where jebt.job_id = j.id
        and jebt.batch_id = p_batch_id
    )

    and (
        j.min_cgpa is null
        or p_cgpa >= j.min_cgpa
    )

order by j.created_at desc;

$$;