create table placement.job_reminders (

    id uuid primary key default gen_random_uuid(),
    job_id uuid not null,
    user_id uuid not null,
    remind_at timestamp with time zone not null,
    created_at timestamp with time zone default now(),

    constraint fk_reminder_job
        foreign key (job_id)
        references placement.jobs(id)
        on delete cascade,

    constraint fk_reminder_user
        foreign key (user_id)
        references placement.users(id)
        on delete cascade,

    constraint unique_user_job_reminder
        unique (job_id, user_id)

);