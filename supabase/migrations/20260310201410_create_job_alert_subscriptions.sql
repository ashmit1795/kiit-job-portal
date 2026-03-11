create table placement.job_alert_subscriptions (
    user_id uuid primary key,
    email_alerts boolean default true,
    telegram_alerts boolean default false,
    created_at timestamp with time zone default now(),
    constraint fk_alert_user
        foreign key (user_id)
        references placement.users(id)
        on delete cascade
);