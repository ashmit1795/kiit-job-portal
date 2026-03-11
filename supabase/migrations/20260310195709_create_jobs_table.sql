create table placement.jobs (

    id uuid primary key default gen_random_uuid(),

    company_name text not null,

    role_title text not null,

    job_type placement.job_type_enum not null,

    ctc text,

    min_cgpa numeric(3,2),

    deadline timestamp with time zone not null,

    description text,

    circular_url text not null,

    posted_by uuid not null,

    approval_status placement.approval_status_enum default 'pending',

    is_active boolean default true,

    created_at timestamp with time zone default now(),

    updated_at timestamp with time zone default now(),

    constraint fk_jobs_posted_by
        foreign key (posted_by)
        references placement.users(id)
        on delete restrict,

    constraint jobs_cgpa_check
        check (
        min_cgpa is null
        or (min_cgpa >= 0 and min_cgpa <= 10)
        )

);

-- Indexes
create index idx_jobs_deadline
on placement.jobs(deadline);

create index idx_jobs_status
on placement.jobs(approval_status);

create index idx_jobs_active
on placement.jobs(is_active);

create index idx_jobs_created_at
on placement.jobs(created_at);

-- updated_at trigger
create trigger trigger_jobs_updated_at
before update on placement.jobs
for each row
execute function placement.set_updated_at();