alter table placement.users
alter column roll_number drop not null;

alter table placement.users
add constraint users_roll_required_for_students_and_volunteers
check (
    role not in ('student', 'volunteer')
    or roll_number is not null
);