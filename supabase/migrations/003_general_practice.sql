-- Allow practice sessions that aren't tied to a specific lesson (free practice).
-- Also add a notes field for logging what you worked on.
alter table practice_sessions alter column lesson_id drop not null;
alter table practice_sessions add column if not exists notes text;
