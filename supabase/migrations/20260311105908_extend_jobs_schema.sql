-- Add new optional columns to jobs

alter table placement.jobs
add column stipend text null,
add column joining_date timestamptz null;

-- Extend job type enum
alter type placement.job_type_enum
add value if not exists 'webinar';

alter type placement.job_type_enum
add value if not exists 'hackathon';

alter type placement.job_type_enum
add value if not exists 'talk';

alter table placement.jobs
drop constraint jobs_circular_number_key;

alter table placement.jobs
add constraint jobs_circular_role_unique
unique (circular_number, role_title);

create index idx_jobs_deadline_approval
on placement.jobs(deadline, approval_status);