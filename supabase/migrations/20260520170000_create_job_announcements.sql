create table placement.job_announcements (
    id uuid primary key default gen_random_uuid(),

    subject text not null,

    description text not null,

    job_id uuid null,

    circular_file_path text null,

    announcement_type text not null default 'general',

    is_pinned boolean not null default false,

    created_by uuid not null,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    constraint fk_job_announcements_job
        foreign key (job_id)
        references placement.jobs(id)
        on delete cascade,

    constraint fk_job_announcements_creator
        foreign key (created_by)
        references placement.users(id)
        on delete restrict
);

create index idx_job_announcements_job_id
on placement.job_announcements(job_id);

create index idx_job_announcements_created_at
on placement.job_announcements(created_at);

create index idx_job_announcements_pinned
on placement.job_announcements(is_pinned);

create trigger trigger_job_announcements_updated_at
before update on placement.job_announcements
for each row
execute function placement.set_updated_at();
