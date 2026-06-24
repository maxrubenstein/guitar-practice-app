-- Single-user app: RLS intentionally disabled on all tables.
-- There is no auth, no user table, and no multi-tenant data. This is a
-- private personal app — disabling RLS is the correct choice, not an oversight.
alter table lessons           disable row level security;
alter table lesson_tabs       disable row level security;
alter table progress          disable row level security;
alter table practice_sessions disable row level security;
