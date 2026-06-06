-- ============================================================
-- Performia — RLS Migration 2 of 2
-- File: 20260606000002_rls.sql
--
-- Enables Row Level Security on all 7 tables and
-- creates 14 minimum-viable policies.
--
-- Prerequisites: 20260606000001_schema.sql must be applied first.
-- auth_user_role() and auth_user_org_id() must exist.
-- ============================================================

-- ── Enable RLS ────────────────────────────────────────────────

alter table public.organizations  enable row level security;
alter table public.profiles        enable row level security;
alter table public.assessments     enable row level security;
alter table public.activities      enable row level security;
alter table public.activity_slots  enable row level security;
alter table public.bookings        enable row level security;
alter table public.org_snapshots   enable row level security;

-- ── organizations ─────────────────────────────────────────────

-- Any authenticated user can read the org they belong to.
create policy "organizations_select_own"
  on public.organizations for select
  to authenticated
  using (id = public.auth_user_org_id());

-- HR and executive can update their org's metadata.
create policy "organizations_update_hr"
  on public.organizations for update
  to authenticated
  using  (id = public.auth_user_org_id()
          and public.auth_user_role() in ('hr', 'executive'))
  with check (id = public.auth_user_org_id()
              and public.auth_user_role() in ('hr', 'executive'));

-- ── profiles ──────────────────────────────────────────────────

-- Every user reads their own profile.
-- proxy.ts relies on this for session validation on every request.
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- Users update only their own profile.
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using  (id = auth.uid())
  with check (id = auth.uid());

-- HR and executive can read all profiles within their org.
create policy "profiles_select_org_hr"
  on public.profiles for select
  to authenticated
  using (
    org_id is not null
    and org_id = public.auth_user_org_id()
    and public.auth_user_role() in ('hr', 'executive')
  );

-- ── assessments ───────────────────────────────────────────────

-- Each user manages all their own assessment rows.
create policy "assessments_all_own"
  on public.assessments for all
  to authenticated
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

-- HR and executive can read assessments of users in their org.
create policy "assessments_select_org_hr"
  on public.assessments for select
  to authenticated
  using (
    public.auth_user_role() in ('hr', 'executive')
    and user_id in (
      select id from public.profiles
      where org_id = public.auth_user_org_id()
    )
  );

-- ── activities ────────────────────────────────────────────────

-- All authenticated users browse the active activity catalogue.
create policy "activities_select_active"
  on public.activities for select
  to authenticated
  using (is_active = true);

-- ── activity_slots ────────────────────────────────────────────

-- All authenticated users can read slots (needed for availability).
create policy "activity_slots_select_all"
  on public.activity_slots for select
  to authenticated
  using (true);

-- ── bookings ──────────────────────────────────────────────────

-- Each user manages their own bookings.
create policy "bookings_all_own"
  on public.bookings for all
  to authenticated
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

-- HR and executive can read bookings of users in their org.
create policy "bookings_select_org_hr"
  on public.bookings for select
  to authenticated
  using (
    public.auth_user_role() in ('hr', 'executive')
    and user_id in (
      select id from public.profiles
      where org_id = public.auth_user_org_id()
    )
  );

-- ── org_snapshots ─────────────────────────────────────────────

-- HR and executive read snapshots for their own org only.
create policy "org_snapshots_select_hr"
  on public.org_snapshots for select
  to authenticated
  using (
    org_id = public.auth_user_org_id()
    and public.auth_user_role() in ('hr', 'executive')
  );
