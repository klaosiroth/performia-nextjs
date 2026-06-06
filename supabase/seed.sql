-- ============================================================
-- Performia — Demo Seed Data
-- File: supabase/seed.sql
--
-- Populates:
--   • 1 organization
--   • 3 profiles  (employee / hr / executive)
--   • 1 completed assessment  (employee, with pillar scores)
--   • 15 activities  (all 6 pillars, mixed formats)
--   • 30 activity slots  (next 3 months)
--   • 5 bookings  (employee, 8 credits total)
--   • 2 org_snapshots  (HR dashboard — current + previous quarter)
--
-- Prerequisites:
--   1. Apply 20260606000001_schema.sql
--   2. Apply 20260606000002_rls.sql
--   3. Auth users must exist (run: pnpm seed:demo)
--
-- Safe to run multiple times — all inserts use ON CONFLICT DO NOTHING
-- or ON CONFLICT ... DO UPDATE.
-- ============================================================

do $$
declare
  -- Auth user IDs resolved by email
  v_emp_id  uuid;
  v_hr_id   uuid;
  v_exec_id uuid;

  -- Org
  v_org_id  uuid;

  -- Assessment
  v_assessment_id uuid;

  -- Activity IDs
  a_mind_1     uuid;
  a_mind_2     uuid;
  a_mind_3     uuid;
  a_body_1     uuid;
  a_body_2     uuid;
  a_body_3     uuid;
  a_money_1    uuid;
  a_money_2    uuid;
  a_social_1   uuid;
  a_social_2   uuid;
  a_growth_1   uuid;
  a_growth_2   uuid;
  a_work_1     uuid;
  a_work_2     uuid;
  a_work_3     uuid;

  -- Slot IDs (for bookings)
  s_yoga_1     uuid;
  s_mindful_1  uuid;
  s_finance_1  uuid;
  s_ergo_1     uuid;
  s_comm_1     uuid;

begin
  -- ── Resolve auth users ──────────────────────────────────────
  select id into v_emp_id  from auth.users where email = 'employee@demo.com';
  select id into v_hr_id   from auth.users where email = 'hr@demo.com';
  select id into v_exec_id from auth.users where email = 'executive@demo.com';

  if v_emp_id is null or v_hr_id is null or v_exec_id is null then
    raise exception
      'Demo auth users not found. Run `pnpm seed:demo` first, then re-apply this file.';
  end if;

  -- ── 1. Organization ─────────────────────────────────────────
  insert into public.organizations (id, name, type, region, size)
  values (
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Acme Thailand Co., Ltd.',
    'Technology',
    'Southeast Asia',
    '200–500'
  )
  on conflict (id) do update
    set name   = excluded.name,
        type   = excluded.type,
        region = excluded.region,
        size   = excluded.size;

  v_org_id := 'aaaaaaaa-0000-0000-0000-000000000001';

  -- ── 2. Profiles ─────────────────────────────────────────────
  insert into public.profiles
    (id, name_th, name_en, dept, position, role, org_id, credits_annual, credits_used)
  values
    (v_emp_id,
     'สมชาย ใจดี', 'Somchai Jaidee',
     'Marketing', 'Marketing Manager',
     'employee', v_org_id, 20, 8),
    (v_hr_id,
     'สุดา รักงาน', 'Suda Rakngarn',
     'Human Resources', 'HR Manager',
     'hr', v_org_id, 0, 0),
    (v_exec_id,
     'วิชัย นำทาง', 'Wichai Namthang',
     'Executive', 'Chief Executive Officer',
     'executive', v_org_id, 0, 0)
  on conflict (id) do update
    set name_th        = excluded.name_th,
        name_en        = excluded.name_en,
        dept           = excluded.dept,
        position       = excluded.position,
        role           = excluded.role,
        org_id         = excluded.org_id,
        credits_annual = excluded.credits_annual,
        credits_used   = excluded.credits_used;

  -- ── 3. Assessment (employee) ─────────────────────────────────
  -- Overall 68 → zone 'stable'
  -- Body (55) and Money (60) are the focus pillars.
  -- Scores mirror what the WellbeingSnapshot and RecommendedFocus
  -- components expect: Record<PillarKey, number>.
  v_assessment_id := gen_random_uuid();

  insert into public.assessments
    (id, user_id, status, answers, scores, overall_score, zone, completed_at)
  values (
    v_assessment_id,
    v_emp_id,
    'completed',
    -- 36 question answers (6 per pillar, Likert 1-5)
    '{
      "Mind_1": 4, "Mind_2": 3, "Mind_3": 4, "Mind_4": 3, "Mind_5": 4, "Mind_6": 4,
      "Body_1": 3, "Body_2": 2, "Body_3": 3, "Body_4": 2, "Body_5": 3, "Body_6": 3,
      "Money_1": 3, "Money_2": 3, "Money_3": 2, "Money_4": 3, "Money_5": 3, "Money_6": 4,
      "Social_1": 4, "Social_2": 4, "Social_3": 4, "Social_4": 3, "Social_5": 4, "Social_6": 4,
      "Growth_1": 3, "Growth_2": 4, "Growth_3": 3, "Growth_4": 3, "Growth_5": 4, "Growth_6": 3,
      "WorkDesign_1": 4, "WorkDesign_2": 4, "WorkDesign_3": 4, "WorkDesign_4": 4, "WorkDesign_5": 4, "WorkDesign_6": 5
    }'::jsonb,
    -- Pillar scores 0-100
    '{
      "Mind": 72,
      "Body": 55,
      "Money": 60,
      "Social": 78,
      "Growth": 65,
      "WorkDesign": 80
    }'::jsonb,
    68,
    'stable',
    now() - interval '14 days'
  )
  on conflict do nothing;

  -- ── 4. Activities (15 total, 2–3 per pillar) ─────────────────

  -- Mind
  a_mind_1  := gen_random_uuid();
  a_mind_2  := gen_random_uuid();
  a_mind_3  := gen_random_uuid();
  -- Body
  a_body_1  := gen_random_uuid();
  a_body_2  := gen_random_uuid();
  a_body_3  := gen_random_uuid();
  -- Money
  a_money_1 := gen_random_uuid();
  a_money_2 := gen_random_uuid();
  -- Social
  a_social_1 := gen_random_uuid();
  a_social_2 := gen_random_uuid();
  -- Growth
  a_growth_1 := gen_random_uuid();
  a_growth_2 := gen_random_uuid();
  -- WorkDesign
  a_work_1  := gen_random_uuid();
  a_work_2  := gen_random_uuid();
  a_work_3  := gen_random_uuid();

  insert into public.activities
    (id, title_th, title_en, desc_th, desc_en,
     pillar, credits, duration, format, group_tag, is_active)
  values

  -- ── Mind ────────────────────────────────────────────────────
  (a_mind_1,
   'สมาธิสำหรับมืออาชีพ',
   'Mindfulness for Professionals',
   'เทคนิคสมาธิเพื่อลดความเครียดในชีวิตการทำงาน เรียนรู้การหายใจและการตระหนักรู้ในปัจจุบัน',
   'Practical mindfulness techniques to reduce work-related stress. Learn breathwork and present-moment awareness.',
   'Mind', 2, 60, 'online', 'A', true),

  (a_mind_2,
   'จัดการความเครียดด้วย CBT',
   'Stress Management with CBT',
   'ใช้หลัก Cognitive Behavioral Therapy ในการปรับวิธีคิดและพฤติกรรมเพื่อรับมือกับความเครียด',
   'Apply Cognitive Behavioral Therapy principles to reframe thinking patterns and build stress resilience.',
   'Mind', 3, 90, 'inPerson', null, true),

  (a_mind_3,
   'Sound Bath & ผ่อนคลาย',
   'Sound Bath & Deep Relaxation',
   'บำบัดด้วยเสียงชามทิเบตและดนตรีผ่อนคลาย เหมาะสำหรับพนักงานที่มีความเครียดสูง',
   'Therapeutic session using Tibetan singing bowls and resonant soundscapes for deep mental reset.',
   'Mind', 2, 60, 'inPerson', 'B', true),

  -- ── Body ────────────────────────────────────────────────────
  (a_body_1,
   'โยคะสำนักงานสำหรับผู้เริ่มต้น',
   'Office Yoga for Beginners',
   'ท่าโยคะง่ายๆ ที่ทำได้ในสำนักงาน เน้นการยืดกล้ามเนื้อและลดปวดหลังจากการนั่งทำงาน',
   'Simple chair and desk yoga poses targeting neck, back, and shoulder tension from long sitting hours.',
   'Body', 1, 45, 'online', null, true),

  (a_body_2,
   'ชมรมวิ่งเพื่อสุขภาพ',
   'Wellness Running Club',
   'กิจกรรมวิ่งกลุ่มทุกเดือน สร้างความสัมพันธ์ระหว่างทีมไปพร้อมกับดูแลสุขภาพ',
   'Monthly group run — build team bonds while boosting cardiovascular health and endurance.',
   'Body', 2, 90, 'inPerson', null, true),

  (a_body_3,
   'โภชนาการสำหรับคนทำงาน',
   'Nutrition for Desk Workers',
   'เรียนรู้วิธีเลือกอาหารที่เหมาะสมสำหรับพนักงานที่นั่งทำงานนาน เพิ่มพลังงานและลดไขมัน',
   'Evidence-based nutrition guidance for sedentary work — meal planning, energy management, and avoiding the afternoon crash.',
   'Body', 2, 60, 'online', null, true),

  -- ── Money ───────────────────────────────────────────────────
  (a_money_1,
   'พื้นฐานการเงินส่วนตัว',
   'Personal Finance Fundamentals',
   'ทำความเข้าใจการวางแผนการเงิน งบประมาณ และการออมอย่างมีประสิทธิภาพ',
   'Build a strong financial foundation — budgeting, emergency funds, debt management, and saving goals.',
   'Money', 2, 90, 'online', null, true),

  (a_money_2,
   'วางแผนเกษียณสำหรับมนุษย์เงินเดือน',
   'Retirement Planning Workshop',
   'เตรียมความพร้อมสำหรับอนาคต ทำความเข้าใจกองทุนสำรองเลี้ยงชีพและการลงทุนระยะยาว',
   'Plan for a secure retirement — provident funds, long-term investment strategies, and tax-advantaged accounts.',
   'Money', 3, 120, 'inPerson', null, true),

  -- ── Social ──────────────────────────────────────────────────
  (a_social_1,
   'ทักษะการสื่อสารอย่างมีประสิทธิภาพ',
   'Effective Communication Skills',
   'พัฒนาทักษะการฟังเชิงรุก การพูดในที่สาธารณะ และการสื่อสารข้ามวัฒนธรรม',
   'Develop active listening, assertive communication, and cross-functional collaboration skills.',
   'Social', 2, 60, 'hybrid', null, true),

  (a_social_2,
   'Team Building: Escape Room Challenge',
   'Team Building: Escape Room Challenge',
   'กิจกรรมแก้ปริศนาร่วมกันเพื่อสร้างความไว้วางใจและความสัมพันธ์ในทีม',
   'Problem-solving escape room designed to strengthen trust, communication, and team cohesion.',
   'Social', 3, 120, 'inPerson', null, true),

  -- ── Growth ──────────────────────────────────────────────────
  (a_growth_1,
   'Design Thinking เพื่อนวัตกรรม',
   'Design Thinking for Innovation',
   'กระบวนการคิดเชิงออกแบบเพื่อแก้ปัญหาอย่างสร้างสรรค์และพัฒนานวัตกรรมในองค์กร',
   'Apply human-centered design to solve real workplace problems — from empathy mapping to rapid prototyping.',
   'Growth', 3, 90, 'online', null, true),

  (a_growth_2,
   'ภาวะผู้นำสมัยใหม่',
   'Modern Leadership Essentials',
   'พัฒนาทักษะผู้นำ เรียนรู้การจูงใจทีม การตัดสินใจ และการบริหารการเปลี่ยนแปลง',
   'Build modern leadership competencies — motivating teams, inclusive leadership, and managing through change.',
   'Growth', 3, 120, 'hybrid', null, true),

  -- ── WorkDesign ──────────────────────────────────────────────
  (a_work_1,
   'Ergonomics เพื่อสุขภาพที่ทำงาน',
   'Workplace Ergonomics Essentials',
   'ออกแบบพื้นที่ทำงานที่ถูกหลักการยศาสตร์ ลดความเสี่ยงการบาดเจ็บจากการนั่งทำงาน',
   'Practical ergonomics for home and office — posture, monitor height, keyboard placement, and break routines.',
   'WorkDesign', 1, 45, 'online', null, true),

  (a_work_2,
   'Deep Work: สมาธิในงาน',
   'Deep Work & Focus Techniques',
   'เพิ่มผลผลิตด้วยเทคนิค Deep Work ของ Cal Newport: Time-blocking, Pomodoro, และการจัดการสิ่งรบกวน',
   'Implement Cal Newport''s Deep Work framework — time-blocking, single-tasking, and distraction elimination.',
   'WorkDesign', 2, 60, 'online', null, true),

  (a_work_3,
   'ออกแบบวันทำงานที่ดี',
   'Redesign Your Workday',
   'วิเคราะห์และปรับโครงสร้างวันทำงานให้มีประสิทธิภาพสูงสุด พร้อมเครื่องมือจัดการพลังงานส่วนตัว',
   'Audit and redesign your daily schedule for peak performance — energy management, batching, and recovery.',
   'WorkDesign', 2, 90, 'hybrid', null, true);

  -- ── 5. Activity Slots (2 per activity, spread across 3 months) ─

  -- Slot IDs for bookings (generated deterministically for reference)
  s_yoga_1    := gen_random_uuid();
  s_mindful_1 := gen_random_uuid();
  s_finance_1 := gen_random_uuid();
  s_ergo_1    := gen_random_uuid();
  s_comm_1    := gen_random_uuid();

  insert into public.activity_slots
    (id, activity_id, starts_at, seats_total, seats_booked)
  values

  -- Mind 1 — Mindfulness for Professionals
  (s_mindful_1,
   a_mind_1, now() + interval '3 days',    25, 18),
  (gen_random_uuid(),
   a_mind_1, now() + interval '33 days',   25, 7),

  -- Mind 2 — Stress Management CBT
  (gen_random_uuid(),
   a_mind_2, now() + interval '10 days',   20, 12),
  (gen_random_uuid(),
   a_mind_2, now() + interval '40 days',   20, 5),

  -- Mind 3 — Sound Bath
  (gen_random_uuid(),
   a_mind_3, now() + interval '17 days',   15, 10),
  (gen_random_uuid(),
   a_mind_3, now() + interval '47 days',   15, 3),

  -- Body 1 — Office Yoga
  (s_yoga_1,
   a_body_1, now() + interval '5 days',    30, 22),
  (gen_random_uuid(),
   a_body_1, now() + interval '35 days',   30, 14),

  -- Body 2 — Running Club
  (gen_random_uuid(),
   a_body_2, now() + interval '12 days',   40, 28),
  (gen_random_uuid(),
   a_body_2, now() + interval '42 days',   40, 19),

  -- Body 3 — Nutrition
  (gen_random_uuid(),
   a_body_3, now() + interval '7 days',    50, 31),
  (gen_random_uuid(),
   a_body_3, now() + interval '37 days',   50, 16),

  -- Money 1 — Personal Finance
  (s_finance_1,
   a_money_1, now() + interval '8 days',   40, 25),
  (gen_random_uuid(),
   a_money_1, now() + interval '38 days',  40, 11),

  -- Money 2 — Retirement Planning
  (gen_random_uuid(),
   a_money_2, now() + interval '21 days',  25, 18),
  (gen_random_uuid(),
   a_money_2, now() + interval '51 days',  25, 6),

  -- Social 1 — Communication Skills
  (s_comm_1,
   a_social_1, now() + interval '14 days', 35, 20),
  (gen_random_uuid(),
   a_social_1, now() + interval '44 days', 35, 8),

  -- Social 2 — Team Building
  (gen_random_uuid(),
   a_social_2, now() + interval '25 days', 20, 15),
  (gen_random_uuid(),
   a_social_2, now() + interval '55 days', 20, 4),

  -- Growth 1 — Design Thinking
  (gen_random_uuid(),
   a_growth_1, now() + interval '6 days',  30, 17),
  (gen_random_uuid(),
   a_growth_1, now() + interval '36 days', 30, 9),

  -- Growth 2 — Leadership
  (gen_random_uuid(),
   a_growth_2, now() + interval '20 days', 25, 14),
  (gen_random_uuid(),
   a_growth_2, now() + interval '50 days', 25, 7),

  -- WorkDesign 1 — Ergonomics
  (s_ergo_1,
   a_work_1, now() + interval '2 days',    60, 33),
  (gen_random_uuid(),
   a_work_1, now() + interval '32 days',   60, 21),

  -- WorkDesign 2 — Deep Work
  (gen_random_uuid(),
   a_work_2, now() + interval '9 days',    50, 29),
  (gen_random_uuid(),
   a_work_2, now() + interval '39 days',   50, 17),

  -- WorkDesign 3 — Redesign Workday
  (gen_random_uuid(),
   a_work_3, now() + interval '16 days',   30, 11),
  (gen_random_uuid(),
   a_work_3, now() + interval '46 days',   30, 5);

  -- ── 6. Bookings (employee, 5 bookings, 8 credits total) ─────
  -- Matches credits_used = 8 set on the employee profile above.

  insert into public.bookings
    (id, user_id, slot_id, status, credits_spent)
  values
  -- Office Yoga (1 credit) — confirmed
  (gen_random_uuid(),
   v_emp_id, s_yoga_1, 'confirmed', 1),

  -- Mindfulness for Professionals (2 credits) — confirmed
  (gen_random_uuid(),
   v_emp_id, s_mindful_1, 'confirmed', 2),

  -- Personal Finance Fundamentals (2 credits) — confirmed
  (gen_random_uuid(),
   v_emp_id, s_finance_1, 'confirmed', 2),

  -- Workplace Ergonomics (1 credit) — confirmed
  (gen_random_uuid(),
   v_emp_id, s_ergo_1, 'confirmed', 1),

  -- Effective Communication (2 credits) — confirmed
  (gen_random_uuid(),
   v_emp_id, s_comm_1, 'confirmed', 2)

  on conflict do nothing;

  -- ── 7. Org Snapshots (HR dashboard — 2 periods) ─────────────

  insert into public.org_snapshots
    (org_id, period, pillar_scores, overall_score,
     engagement_rate, budget_util, active_users,
     dept_breakdown, risk_metrics)
  values

  -- Current quarter (2026-Q2) — used by HR dashboard KPI cards
  (v_org_id, '2026-Q2',
   '{"Mind":68,"Body":62,"Money":70,"Social":75,"Growth":73,"WorkDesign":80}'::jsonb,
   71,
   68.50,
   42.30,
   156,
   '{"Marketing":75,"Engineering":68,"Sales":72,"HR":85,"Operations":65,"Finance":70}'::jsonb,
   '{"burnout_risk":18,"disengagement_risk":12,"attrition_risk":8,"low_performer_risk":6}'::jsonb),

  -- Previous quarter (2026-Q1) — for trend lines in HR charts
  (v_org_id, '2026-Q1',
   '{"Mind":64,"Body":58,"Money":66,"Social":71,"Growth":68,"WorkDesign":75}'::jsonb,
   67,
   61.20,
   38.70,
   142,
   '{"Marketing":70,"Engineering":63,"Sales":68,"HR":80,"Operations":60,"Finance":65}'::jsonb,
   '{"burnout_risk":23,"disengagement_risk":16,"attrition_risk":11,"low_performer_risk":9}'::jsonb)

  on conflict (org_id, period) do update
    set pillar_scores    = excluded.pillar_scores,
        overall_score    = excluded.overall_score,
        engagement_rate  = excluded.engagement_rate,
        budget_util      = excluded.budget_util,
        active_users     = excluded.active_users,
        dept_breakdown   = excluded.dept_breakdown,
        risk_metrics     = excluded.risk_metrics;

  raise notice 'Seed complete: org=%, emp=%, hr=%, exec=%',
    v_org_id, v_emp_id, v_hr_id, v_exec_id;
end;
$$;
