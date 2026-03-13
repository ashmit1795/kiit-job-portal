create or replace function placement.job_stats()
returns json
language sql
as $$

select json_build_object(

	'total_jobs', (select count(*) from placement.jobs),

	'approved', (
		select count(*) from placement.jobs
		where approval_status='approved'
	),

	'pending', (
		select count(*) from placement.jobs
		where approval_status='pending'
	),

	'rejected', (
		select count(*) from placement.jobs
		where approval_status='rejected'
	)

);

$$;