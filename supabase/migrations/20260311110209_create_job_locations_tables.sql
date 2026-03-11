create table placement.job_locations (
    id uuid primary key default gen_random_uuid(),
    job_id uuid not null,
    location text not null,

    constraint fk_job_locations_job
        foreign key (job_id)
        references placement.jobs(id)
        on delete cascade
);

create index idx_job_locations_job_id
on placement.job_locations(job_id);