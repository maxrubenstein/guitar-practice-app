-- Guitar Practice App — initial schema
-- Single-user app; RLS is intentionally disabled. No auth, no user table.

create extension if not exists "pgcrypto";

-- ───────────────────────────── lessons ──────────────────────────────────────
create table if not exists lessons (
  id               uuid primary key default gen_random_uuid(),
  week             int not null,
  day_order        int not null,
  title            text not null,
  focus            text not null,
  instructions     text not null,
  default_bpm      int not null,
  target_bpm       int not null,
  suggested_minutes int not null,
  created_at       timestamptz not null default now()
);

-- ───────────────────────────── lesson_tabs ──────────────────────────────────
create table if not exists lesson_tabs (
  id           uuid primary key default gen_random_uuid(),
  lesson_id    uuid not null references lessons(id) on delete cascade,
  label        text not null,
  tuning       text not null default 'EADGBE',
  notes        jsonb not null default '[]',
  order_index  int not null default 0
);

-- ───────────────────────────── progress ─────────────────────────────────────
create table if not exists progress (
  id           uuid primary key default gen_random_uuid(),
  lesson_id    uuid not null unique references lessons(id) on delete cascade,
  status       text not null default 'not_started'
               check (status in ('not_started', 'in_progress', 'mastered')),
  best_bpm     int,
  notes        text,
  mastered_at  timestamptz,
  updated_at   timestamptz not null default now()
);

-- ───────────────────────────── practice_sessions ────────────────────────────
create table if not exists practice_sessions (
  id               uuid primary key default gen_random_uuid(),
  lesson_id        uuid not null references lessons(id) on delete cascade,
  duration_seconds int not null,
  bpm_practiced    int,
  practiced_at     timestamptz not null default now()
);

-- Indexes for common query patterns
create index if not exists idx_lessons_week_order   on lessons(week, day_order);
create index if not exists idx_lesson_tabs_lesson   on lesson_tabs(lesson_id, order_index);
create index if not exists idx_progress_lesson      on progress(lesson_id);
create index if not exists idx_sessions_practiced   on practice_sessions(practiced_at);
create index if not exists idx_sessions_lesson      on practice_sessions(lesson_id);
