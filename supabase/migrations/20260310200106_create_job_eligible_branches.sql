create table placement.job_eligible_branches (

    job_id uuid not null,
    branch_id uuid not null,

    primary key (job_id, branch_id),

    constraint fk_job_branch_job
        foreign key (job_id)
        references placement.jobs(id)
        on delete cascade,

    constraint fk_job_branch_branch
        foreign key (branch_id)
        references placement.branches(id)
        on delete restrict
);