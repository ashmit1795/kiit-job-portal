-- Job type enum
create type placement.job_type_enum as enum (
    'internship',
    'placement',
    'internship_fulltime'
);

-- Job approval workflow enum
create type placement.approval_status_enum as enum (
    'pending',
    'approved',
    'rejected'
);