alter table placement.jobs
	alter column posted_by drop not null;

alter table placement.jobs
	drop constraint if exists fk_jobs_posted_by;

alter table placement.jobs
	add constraint fk_jobs_posted_by
		foreign key (posted_by)
		references placement.users(id)
		on delete set null;
