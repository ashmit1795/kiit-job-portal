create table placement.job_eligible_batches (

    job_id uuid not null,
    batch_id uuid not null,

    primary key (job_id, batch_id),

    constraint fk_job_batch_job
        foreign key (job_id)
        references placement.jobs(id)
        on delete cascade,

    constraint fk_job_batch_batch
        foreign key (batch_id)
        references placement.batches(id)
        on delete restrict
);