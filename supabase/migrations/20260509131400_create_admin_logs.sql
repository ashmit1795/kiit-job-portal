create table placement.admin_logs (

	id uuid primary key default gen_random_uuid(),

	admin_id uuid
		references placement.users(id)
		on delete set null,

	action text not null,

	target_type text not null,

	target_id uuid,

	details jsonb,

	created_at timestamp with time zone not null default now()

);

create index idx_admin_logs_admin_id
on placement.admin_logs(admin_id);

create index idx_admin_logs_created_at
on placement.admin_logs(created_at desc);

create index idx_admin_logs_action
on placement.admin_logs(action);
