# DATABASE_REPORT.md — Performia

Derived from `lib/supabase/types.ts`, all application queries, component props, and `scripts/seed-demo.mjs`.

---

## ERD (Entity Relationship Diagram)

```
auth.users (Supabase managed)
  │
  │ 1:1
  ▼
organizations ──────────────────────────────────────────────┐
  │                                                          │
  │ 1:N (org_id)                                            │ 1:N (org_id)
  ▼                                                         ▼
profiles ────────────────────────────┐         org_snapshots
  │                                  │
  │ 1:N (user_id)                    │ 1:N (user_id)
  ▼                                  ▼
assessments                        bookings
                                     │
                                     │ N:1 (slot_id)
                                     ▼
                                  activity_slots
                                     │
                                     │ N:1 (activity_id)
                                     ▼
                                  activities
```

---

## Tables

### `organizations`

Tenant records. Each company using Performia has one row.
Profiles and org_snapshots belong to an organization.

| Column     | Type        | Nullable | Default            | Notes                          |
|------------|-------------|----------|--------------------|--------------------------------|
| id         | uuid        | NO       | gen_random_uuid()  | Primary key                    |
| name       | text        | NO       |                    | Company name                   |
| type       | text        | YES      |                    | Industry e.g. "Technology"     |
| region     | text        | YES      |                    | e.g. "Southeast Asia"          |
| size       | text        | YES      |                    | e.g. "200–500"                 |
| created_at | timestamptz | NO       | now()              | Insert timestamp               |
| updated_at | timestamptz | NO       | now()              | Auto-updated via trigger       |

**Indexes:** none beyond PK (small table, typically 1–10 rows per instance).

---

### `profiles`

One row per authenticated user. `id` mirrors `auth.users.id` exactly — never auto-generated here.

| Column         | Type        | Nullable | Default    | Notes                                       |
|----------------|-------------|----------|------------|---------------------------------------------|
| id             | uuid        | NO       |            | PK · FK → auth.users(id) ON DELETE CASCADE  |
| name_th        | text        | YES      |            | Thai display name                           |
| name_en        | text        | YES      |            | English display name                        |
| dept           | text        | YES      |            | Department shown in hero section chip       |
| position       | text        | YES      |            | Job title                                   |
| role           | text        | NO       | 'employee' | CHECK: employee · hr · executive            |
| org_id         | uuid        | YES      |            | FK → organizations(id) ON DELETE SET NULL   |
| credits_annual | int         | NO       | 20         | Yearly credit budget                        |
| credits_used   | int         | NO       | 0          | CHECK ≥ 0. credits_annual − credits_used = remaining balance |
| created_at     | timestamptz | NO       | now()      | Insert timestamp                            |
| updated_at     | timestamptz | NO       | now()      | Auto-updated via trigger                    |

**Indexes:**
- `profiles_role_idx` — (role) — used by proxy.ts HR guard and HR org queries
- `profiles_org_id_idx` — (org_id) — used by HR RLS subqueries

**Source fields:**
- `credits_annual − credits_used` → displayed in HeroSection and CreditSummaryCard
- `name_th / name_en` → resolved by lang in HeroSection display name
- `dept` → rendered as a chip in the hero section
- `role` → drives post-login redirect (`ROLE_PATH`) and proxy.ts HR guard

---

### `assessments`

PERFORM-6™ wellbeing assessment results. One row per attempt (users can retake; the latest completed row is used).

| Column        | Type        | Nullable | Default       | Notes                                                   |
|---------------|-------------|----------|---------------|---------------------------------------------------------|
| id            | uuid        | NO       | gen_random_uuid() | Primary key                                         |
| user_id       | uuid        | NO       |               | FK → profiles(id) ON DELETE CASCADE                     |
| status        | text        | NO       | 'in_progress' | CHECK: in_progress · completed                          |
| answers       | jsonb       | YES      |               | `{ "q_id": score }` Likert 1–5 per question             |
| scores        | jsonb       | YES      |               | `{ "Mind": 80, "Body": 65, … }` — Record\<PillarKey, number\> |
| overall_score | int         | YES      |               | Average of all pillar scores (0–100)                    |
| zone          | text        | YES      |               | CHECK: performing · stable · watch · risk · critical     |
| completed_at  | timestamptz | YES      |               | Set when status → completed                             |
| created_at    | timestamptz | NO       | now()         | Insert timestamp                                        |
| updated_at    | timestamptz | NO       | now()         | Auto-updated via trigger                                |

**Indexes:**
- `assessments_user_id_idx` — (user_id)
- `assessments_status_idx` — (status)
- `assessments_completed_at_idx` — (completed_at DESC NULLS LAST) — page.tsx orders by this to find the latest

**Zone thresholds (from `employee-home-content.tsx`):**

| Score   | Zone       |
|---------|------------|
| ≥ 75    | performing |
| ≥ 55    | stable     |
| ≥ 40    | watch      |
| ≥ 25    | risk       |
| < 25    | critical   |

**Query pattern (page.tsx):**
```sql
SELECT * FROM assessments
WHERE user_id = $1 AND status = 'completed'
ORDER BY completed_at DESC
LIMIT 1;
```

---

### `activities`

Wellness activity catalogue. Content is managed by HR/admins. Employees browse via the Marketplace.

| Column      | Type        | Nullable | Default | Notes                                               |
|-------------|-------------|----------|---------|-----------------------------------------------------|
| id          | uuid        | NO       | gen_random_uuid() | Primary key                               |
| title_th    | text        | NO       |         | Thai title shown in all activity cards              |
| title_en    | text        | NO       |         | English title                                       |
| desc_th     | text        | YES      |         | Thai description (Marketplace detail)               |
| desc_en     | text        | YES      |         | English description                                 |
| pillar      | text        | NO       |         | CHECK: Mind · Body · Money · Social · Growth · WorkDesign |
| credits     | int         | NO       | 1       | CHECK > 0. Cost deducted from credits_used on booking |
| duration    | int         | NO       | 60      | CHECK > 0. Minutes                                  |
| format      | text        | NO       |         | CHECK: online · inPerson · hybrid                   |
| group_tag   | text        | YES      |         | CHECK: A · B. A/B segment for Marketplace display   |
| cover_image | text        | YES      |         | Storage URL for card thumbnail                      |
| is_active   | boolean     | NO       | true    | Soft-delete / hide from catalogue                   |
| created_at  | timestamptz | NO       | now()   | Insert timestamp                                    |
| updated_at  | timestamptz | NO       | now()   | Auto-updated via trigger                            |

**Indexes:**
- `activities_pillar_idx` — (pillar) — Marketplace pillar filter
- `activities_is_active_idx` — (is_active) — RLS policy and default filter
- `activities_group_tag_idx` — (group_tag) — A/B segment filter

---

### `activity_slots`

Scheduled sessions for each activity. One activity can have many slots across different dates.

| Column       | Type        | Nullable | Default | Notes                                               |
|--------------|-------------|----------|---------|-----------------------------------------------------|
| id           | uuid        | NO       | gen_random_uuid() | Primary key                               |
| activity_id  | uuid        | NO       |         | FK → activities(id) ON DELETE CASCADE               |
| starts_at    | timestamptz | NO       |         | Session datetime (local timezone at presentation)   |
| seats_total  | int         | NO       |         | CHECK > 0. Maximum participants                     |
| seats_booked | int         | NO       | 0       | CHECK ≥ 0. Incremented on booking confirmation      |
| created_at   | timestamptz | NO       | now()   | Insert timestamp                                    |
| updated_at   | timestamptz | NO       | now()   | Auto-updated via trigger                            |

**Constraint:** `seats_not_exceeded` — CHECK (seats_booked ≤ seats_total)

**Indexes:**
- `activity_slots_activity_id_idx` — (activity_id)
- `activity_slots_starts_at_idx` — (starts_at) — upcoming slot queries

---

### `bookings`

Employee activity bookings. Cancellation does not automatically refund credits — that logic lives in application Route Handlers.

| Column        | Type        | Nullable | Default     | Notes                                               |
|---------------|-------------|----------|-------------|-----------------------------------------------------|
| id            | uuid        | NO       | gen_random_uuid() | Primary key                               |
| user_id       | uuid        | NO       |             | FK → profiles(id) ON DELETE CASCADE                 |
| slot_id       | uuid        | NO       |             | FK → activity_slots(id) ON DELETE RESTRICT          |
| status        | text        | NO       | 'confirmed' | CHECK: confirmed · cancelled                        |
| credits_spent | int         | NO       | 0           | CHECK ≥ 0. Snapshot of activity.credits at booking time |
| created_at    | timestamptz | NO       | now()       | Insert timestamp                                    |
| updated_at    | timestamptz | NO       | now()       | Auto-updated via trigger                            |

**Indexes:**
- `bookings_user_id_idx` — (user_id)
- `bookings_slot_id_idx` — (slot_id)
- `bookings_status_idx` — (status)

**ON DELETE RESTRICT on slot_id** — prevents deleting a slot that has bookings; use cancellation instead.

---

### `org_snapshots`

Periodic aggregate snapshots computed from employee assessment and booking data. One row per `(org_id, period)`.

| Column          | Type        | Nullable | Default | Notes                                                    |
|-----------------|-------------|----------|---------|----------------------------------------------------------|
| id              | uuid        | NO       | gen_random_uuid() | Primary key                                    |
| org_id          | uuid        | NO       |         | FK → organizations(id) ON DELETE CASCADE                 |
| period          | text        | NO       |         | Format: `YYYY-Qn` e.g. `2026-Q2`                        |
| pillar_scores   | jsonb       | YES      |         | `{ "Mind": 68, "Body": 62, … }` org-wide averages       |
| overall_score   | int         | YES      |         | Org-wide average overall score (0–100)                   |
| engagement_rate | numeric(5,2)| YES      |         | % of employees with at least one booking this period     |
| budget_util     | numeric(5,2)| YES      |         | % of total credit budget consumed                        |
| active_users    | int         | YES      |         | Count of employees with ≥1 activity this period          |
| dept_breakdown  | jsonb       | YES      |         | `{ "Marketing": 75, "Engineering": 68, … }` dept scores  |
| risk_metrics    | jsonb       | YES      |         | `{ "burnout_risk": 18, "attrition_risk": 8, … }`        |
| created_at      | timestamptz | NO       | now()   | Insert timestamp                                         |
| updated_at      | timestamptz | NO       | now()   | Auto-updated via trigger                                 |

**Unique constraint:** `(org_id, period)` — one snapshot per org per period.

**Indexes:**
- `org_snapshots_org_id_idx` — (org_id)
- `org_snapshots_period_idx` — (period DESC) — latest-period query

---

## Relationships Summary

| From            | To               | Type  | FK Column   | On Delete    |
|-----------------|------------------|-------|-------------|--------------|
| profiles        | auth.users       | N:1   | id          | CASCADE      |
| profiles        | organizations    | N:1   | org_id      | SET NULL     |
| assessments     | profiles         | N:1   | user_id     | CASCADE      |
| bookings        | profiles         | N:1   | user_id     | CASCADE      |
| bookings        | activity_slots   | N:1   | slot_id     | RESTRICT     |
| activity_slots  | activities       | N:1   | activity_id | CASCADE      |
| org_snapshots   | organizations    | N:1   | org_id      | CASCADE      |

---

## Indexes Summary

| Index                            | Table            | Columns              | Purpose                                |
|----------------------------------|------------------|----------------------|----------------------------------------|
| profiles_role_idx                | profiles         | (role)               | HR guard, role-filtered HR queries     |
| profiles_org_id_idx              | profiles         | (org_id)             | RLS org-scope subqueries               |
| assessments_user_id_idx          | assessments      | (user_id)            | User's own assessment lookup           |
| assessments_status_idx           | assessments      | (status)             | Filter completed assessments           |
| assessments_completed_at_idx     | assessments      | (completed_at DESC)  | Latest-first ordering in page.tsx      |
| activities_pillar_idx            | activities       | (pillar)             | Marketplace pillar filter              |
| activities_is_active_idx         | activities       | (is_active)          | RLS active-only policy                 |
| activities_group_tag_idx         | activities       | (group_tag)          | A/B marketplace segment                |
| activity_slots_activity_id_idx   | activity_slots   | (activity_id)        | Slots per activity                     |
| activity_slots_starts_at_idx     | activity_slots   | (starts_at)          | Upcoming slot queries                  |
| bookings_user_id_idx             | bookings         | (user_id)            | Employee's booking list                |
| bookings_slot_id_idx             | bookings         | (slot_id)            | Slot occupancy check                   |
| bookings_status_idx              | bookings         | (status)             | Confirmed-only filter                  |
| org_snapshots_org_id_idx         | org_snapshots    | (org_id)             | HR dashboard per-org lookup            |
| org_snapshots_period_idx         | org_snapshots    | (period DESC)        | Latest-period snapshot                 |

---

## Row Level Security

RLS is enabled on all 7 tables. Policies use two `SECURITY DEFINER` helper functions to prevent infinite recursion when policies on `profiles` need to reference other columns in `profiles`:

- `public.auth_user_role()` — returns `profiles.role` for `auth.uid()`
- `public.auth_user_org_id()` — returns `profiles.org_id` for `auth.uid()`

These functions bypass RLS internally (security definer) so the policy subquery never triggers the policies it is being evaluated by.

### Policy Table

| Table           | Policy Name                | Operation | Who Can                                              |
|-----------------|----------------------------|-----------|------------------------------------------------------|
| organizations   | organizations_select_own   | SELECT    | Any authenticated user reads their own org           |
| organizations   | organizations_update_hr    | UPDATE    | HR / executive update their org's metadata           |
| profiles        | profiles_select_own        | SELECT    | Each user reads their own profile row                |
| profiles        | profiles_update_own        | UPDATE    | Each user updates their own profile row              |
| profiles        | profiles_select_org_hr     | SELECT    | HR / executive read all profiles in same org         |
| assessments     | assessments_all_own        | ALL       | Each user manages all their own assessment rows      |
| assessments     | assessments_select_org_hr  | SELECT    | HR / executive read assessments of users in their org|
| activities      | activities_select_active   | SELECT    | All authenticated users browse active catalogue      |
| activity_slots  | activity_slots_select_all  | SELECT    | All authenticated users read all slots               |
| bookings        | bookings_all_own           | ALL       | Each user manages their own bookings                 |
| bookings        | bookings_select_org_hr     | SELECT    | HR / executive read bookings of users in their org   |
| org_snapshots   | org_snapshots_select_hr    | SELECT    | HR / executive read snapshots for their own org      |

### Role Access Matrix

| Table          | employee               | hr / executive                          |
|----------------|------------------------|-----------------------------------------|
| organizations  | Own org (read)         | Own org (read + update)                 |
| profiles       | Own row (read + update)| Own row + all org rows (read)           |
| assessments    | Own rows (all)         | Own rows + all org rows (read)          |
| activities     | Active rows (read)     | Active rows (read)                      |
| activity_slots | All rows (read)        | All rows (read)                         |
| bookings       | Own rows (all)         | Own rows + all org rows (read)          |
| org_snapshots  | No access              | Own org rows (read)                     |

---

## Auto-Provisioning

The trigger `on_auth_user_created` fires `AFTER INSERT ON auth.users` and inserts a minimal profile row (`role = 'employee'`) for every new signup. The seed file uses `ON CONFLICT (id) DO NOTHING`, making both paths safe to run together.

---

## Application Steps to Apply

```
Step 1 — Apply schema:
  Supabase Dashboard → SQL Editor → paste 20260606000001_schema.sql → Run

Step 2 — Apply RLS:
  Supabase Dashboard → SQL Editor → paste 20260606000002_rls.sql → Run

Step 3 — Create auth users:
  pnpm seed:demo

Step 4 — Apply seed data:
  Supabase Dashboard → SQL Editor → paste supabase/seed.sql → Run
```

After Step 4, the employee dashboard (login: `employee@demo.com` / `Demo1234!`) will display:
- Hero section with name, dept chip, credits remaining (12 of 20)
- Wellbeing Snapshot: Mind 72, Body 55, Money 60, Social 78, Growth 65, WorkDesign 80
- Recommended Focus: Body and Money (lowest scores, in 'watch' zone)
- 5 upcoming bookings (Yoga, Mindfulness, Finance, Ergonomics, Communication)
- Activity Marketplace: 15 activities across all 6 pillars

The HR dashboard (login: `hr@demo.com` / `Demo1234!`) will display:
- KPI cards: overall score 71, engagement 68.5%, budget util 42.3%, 156 active users
- Pillar grid: WorkDesign 80 → Social 75 → Growth 73 → Money 70 → Mind 68 → Body 62
- Quarter-over-quarter improvement in all metrics (vs 2026-Q1 baseline)
