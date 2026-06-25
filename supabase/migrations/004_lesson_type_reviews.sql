-- Add lesson_type ('new' | 'review') and reviews_lesson_ids for spaced repetition.
-- Existing lessons get the default 'new' type and empty reviews array.
alter table lessons add column if not exists lesson_type text not null default 'new'
  check (lesson_type in ('new', 'review'));
alter table lessons add column if not exists reviews_lesson_ids uuid[] not null default '{}';
