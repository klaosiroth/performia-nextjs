-- ============================================================
-- Performia — Schema Migration 1 of 2
-- File: 20260606000001_schema.sql
--
-- Creates all 7 application tables with:
--   UUID primary keys, foreign keys, indexes,
--   created_at / updated_at timestamps, all CHECK constraints,
--   security-definer helper functions, and triggers.
--
-- Apply via: Supabase Dashboard → SQL Editor → Run All
-- Run 20260606000002_rls.sql immediately after this file.
-- ============================================================

-- ── Helper: auto-update updated_at on every row change ───────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── 1. organizations ──────────────────────────────────────────
-- Tenant/company records. Profiles belong to one org.

create table public.organizations (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  type       text,                           -- e.g. 'Technology', 'FMCG'
  region     text,                           -- e.g. 'Southeast Asia'
  size       text,                           -- e.g. '200-500'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger organizations_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

-- ── 2. profiles ───────────────────────────────────────────────
-- One row per auth user. id mirrors auth.users.id exactly.

create table public.profiles (
  id             uuid        primary key
                             references auth.users (id) on delete cascade,
  name_th        text,
  name_en        text,
  dept           text,
  position       text,
  role           text        not null default 'employee'
                             check (role in ('employee', 'hr', 'executive')),
  org_id         uuid        references public.organizations (id) on delete set null,
  credits_annual int         not null default 20,
  credits_used   int         not null default 0 check (credits_used >= 0),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index profiles_role_idx   on public.profiles (role);
create index profiles_org_id_idx on public.profiles (org_id);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ── Security-definer helpers ──────────────────────────────────
-- Positioned after profiles so the parser can resolve the table.
-- SECURITY DEFINER bypasses RLS inside policy subqueries,
-- preventing infinite recursion when policies self-join profiles.

create or replace function public.auth_user_role()
returns text
language sql stable security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.auth_user_org_id()
returns uuid
language sql stable security definer
set search_path = public
as $$
  select org_id from public.profiles where id = auth.uid()
$$;

-- ── Auto-provision profile on every new auth signup ──────────
-- Fires on INSERT into auth.users.
-- The seed script (supabase/seed.sql) handles demo accounts via
-- UPSERT, so ON CONFLICT DO NOTHING keeps both paths safe.

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'employee')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── 3. assessments ────────────────────────────────────────────
-- PERFORM-6™ assessment results. One row per attempt.
-- scores  → { "Mind": 80, "Body": 65, ... }
-- answers → { "q1": 4, "q2": 3, ... }

create table public.assessments (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null
                            references public.profiles (id) on delete cascade,
  status        text        not null default 'in_progress'
                            check (status in ('in_progress', 'completed')),
  answers       jsonb,
  scores        jsonb,
  overall_score int,
  zone          text        check (zone in ('performing', 'stable', 'watch', 'risk', 'critical')),
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index assessments_user_id_idx      on public.assessments (user_id);
create index assessments_status_idx       on public.assessments (status);
create index assessments_completed_at_idx on public.assessments (completed_at desc nulls last);

create trigger assessments_updated_at
  before update on public.assessments
  for each row execute function public.set_updated_at();

-- ── 4. activities ─────────────────────────────────────────────
-- Wellness activity catalogue. Content managed by HR/admin.

create table public.activities (
  id          uuid        primary key default gen_random_uuid(),
  title_th    text        not null,
  title_en    text        not null,
  desc_th     text,
  desc_en     text,
  pillar      text        not null
              check (pillar in ('Mind', 'Body', 'Money', 'Social', 'Growth', 'WorkDesign')),
  credits     int         not null default 1 check (credits > 0),
  duration    int         not null default 60 check (duration > 0),  -- minutes
  format      text        not null
              check (format in ('online', 'inPerson', 'hybrid')),
  group_tag   text        check (group_tag in ('A', 'B')),
  cover_image text,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index activities_pillar_idx    on public.activities (pillar);
create index activities_is_active_idx on public.activities (is_active);
create index activities_group_tag_idx on public.activities (group_tag);

create trigger activities_updated_at
  before update on public.activities
  for each row execute function public.set_updated_at();

-- ── 5. activity_slots ─────────────────────────────────────────
-- Scheduled sessions for each activity.
-- seats_booked is incremented by the booking flow; the constraint
-- ensures it never exceeds seats_total.

create table public.activity_slots (
  id           uuid        primary key default gen_random_uuid(),
  activity_id  uuid        not null
               references public.activities (id) on delete cascade,
  starts_at    timestamptz not null,
  seats_total  int         not null check (seats_total > 0),
  seats_booked int         not null default 0 check (seats_booked >= 0),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint seats_not_exceeded check (seats_booked <= seats_total)
);

create index activity_slots_activity_id_idx on public.activity_slots (activity_id);
create index activity_slots_starts_at_idx   on public.activity_slots (starts_at);

create trigger activity_slots_updated_at
  before update on public.activity_slots
  for each row execute function public.set_updated_at();

-- ── 6. bookings ───────────────────────────────────────────────
-- Employee activity bookings. Cancellation does not refund
-- credits_spent — that logic lives in the application layer.

create table public.bookings (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null
                            references public.profiles (id) on delete cascade,
  slot_id       uuid        not null
                            references public.activity_slots (id) on delete restrict,
  status        text        not null default 'confirmed'
                            check (status in ('confirmed', 'cancelled')),
  credits_spent int         not null default 0 check (credits_spent >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index bookings_user_id_idx on public.bookings (user_id);
create index bookings_slot_id_idx on public.bookings (slot_id);
create index bookings_status_idx  on public.bookings (status);

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ── 7. org_snapshots ──────────────────────────────────────────
-- Periodic aggregate snapshots used by the HR dashboard.
-- One row per (org_id, period). period format: 'YYYY-Qn'.
-- pillar_scores  → { "Mind": 68, "Body": 62, ... }
-- dept_breakdown → { "Marketing": 75, "Engineering": 68, ... }
-- risk_metrics   → { "burnout_risk": 18, "attrition_risk": 8, ... }

create table public.org_snapshots (
  id              uuid        primary key default gen_random_uuid(),
  org_id          uuid        not null
                              references public.organizations (id) on delete cascade,
  period          text        not null,
  pillar_scores   jsonb,
  overall_score   int,
  engagement_rate numeric(5,2),
  budget_util     numeric(5,2),
  active_users    int,
  dept_breakdown  jsonb,
  risk_metrics    jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (org_id, period)
);

create index org_snapshots_org_id_idx on public.org_snapshots (org_id);
create index org_snapshots_period_idx on public.org_snapshots (period desc);

create trigger org_snapshots_updated_at
  before update on public.org_snapshots
  for each row execute function public.set_updated_at();
