'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ClipboardList } from 'lucide-react'
import HeroSection       from '@/components/employee/hero-section'
import CreditSummaryCard from '@/components/employee/credit-summary-card'
import WellbeingSnapshot, { type PillarStatus } from '@/components/employee/wellbeing-snapshot'
import RecommendedFocus  from '@/components/employee/recommended-focus'
import QuickActions       from '@/components/employee/quick-actions'
import ActivitiesCarousel from '@/components/employee/activities-carousel'
import BookingsSection    from '@/components/employee/bookings-section'
import type { BookingWithDetails } from '@/components/employee/bookings-section'
import type { EmployeeLang } from '@/lib/employee-tr'
import { PILLAR_KEYS, type PillarKey, type ZoneKey } from '@/tokens/pillars'
import type { Database } from '@/lib/supabase/types'

type Profile    = Database['public']['Tables']['profiles']['Row']
type Assessment = Database['public']['Tables']['assessments']['Row']
type Activity   = Database['public']['Tables']['activities']['Row']

interface Props {
  profile:          Profile             | null
  latestAssessment: Assessment          | null
  activities:       Activity[]
  bookings:         BookingWithDetails[]
  fetchError:       boolean
}

function scoreToZone(score: number): ZoneKey {
  if (score >= 75) return 'performing'
  if (score >= 55) return 'stable'
  if (score >= 40) return 'watch'
  if (score >= 25) return 'risk'
  return 'critical'
}

function derivePillars(scores: Record<PillarKey, number>): PillarStatus[] {
  return PILLAR_KEYS.map(pillar => {
    const raw   = typeof scores[pillar] === 'number' ? scores[pillar] : 0
    const score = Math.round(raw)
    return { pillar, score, zone: scoreToZone(score) }
  })
}

function deriveFocus(pillars: PillarStatus[]): PillarKey[] {
  const needsFocus = pillars
    .filter(p => p.zone !== 'performing')
    .sort((a, b) => a.score - b.score)
  if (needsFocus.length > 0) return needsFocus.slice(0, 3).map(p => p.pillar)
  // All performing — surface the 3 lowest as growth areas
  return [...pillars].sort((a, b) => a.score - b.score).slice(0, 3).map(p => p.pillar)
}

export default function EmployeeHomeContent({ profile, latestAssessment, activities, bookings, fetchError }: Props) {
  const [lang] = useState<EmployeeLang>(() => {
    if (typeof window === 'undefined') return 'th'
    try {
      const saved = localStorage.getItem('performia_lang')
      if (saved === 'en' || saved === 'th') return saved
    } catch { /* ignore */ }
    return 'th'
  })

  // ── Error state: Supabase query failed ──────────────────────────────────
  if (fetchError) {
    return (
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: 32 }}>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 24, padding: '56px 32px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="1.6"/>
              <line x1="12" y1="7" x2="12" y2="13" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="12" cy="16.5" r="1" fill="#EF4444"/>
            </svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
            {lang === 'th' ? 'ไม่สามารถโหลดข้อมูลได้' : 'Unable to load your data'}
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
            {lang === 'th'
              ? 'เกิดข้อผิดพลาดขณะดึงข้อมูลของคุณ กรุณาลองใหม่อีกครั้ง'
              : 'Something went wrong while loading your profile. Please try again.'}
          </p>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 44, padding: '0 28px', borderRadius: 14, background: 'var(--color-navy)', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-sans)', transition: 'background .18s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-navy-dark)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-navy)' }}
          >
            {lang === 'th' ? 'ลองใหม่' : 'Try again'}
          </Link>
        </div>
      </div>
    )
  }

  // ── No-profile state: account exists in auth but profile row is missing ─
  if (!profile) {
    return (
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: 32 }}>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 24, padding: '56px 32px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--color-bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" stroke="var(--color-navy)" strokeWidth="1.6"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--color-navy)" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
            {lang === 'th' ? 'ยังไม่ได้ตั้งค่าบัญชีผู้ใช้' : 'Account not yet configured'}
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: 360, margin: '0 auto 24px' }}>
            {lang === 'th'
              ? 'ข้อมูลโปรไฟล์ของคุณยังไม่ถูกสร้าง กรุณาติดต่อผู้ดูแลระบบ HR'
              : 'Your profile record has not been created yet. Please contact your HR administrator.'}
          </p>
        </div>
      </div>
    )
  }

  // ── Derive pillars and focus from assessment ──────────────────────────────
  const scores        = latestAssessment?.scores ?? null
  const pillars       = scores ? derivePillars(scores) : []
  const focus         = pillars.length > 0 ? deriveFocus(pillars) : []
  const hasAssessment = pillars.length > 0

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero */}
      <HeroSection profile={profile} latestAssessment={latestAssessment} lang={lang} />

      {/* Credit + Snapshot row */}
      <div className="dash-credit-row fu d1" style={{ display: 'grid', gridTemplateColumns: '288px 1fr', gap: 24 }}>
        <CreditSummaryCard annual={profile.credits_annual} used={profile.credits_used} lang={lang} />
        {hasAssessment
          ? <WellbeingSnapshot pillars={pillars} lang={lang} />
          : <NoAssessmentCard lang={lang} />
        }
      </div>

      {/* Recommended focus */}
      {hasAssessment
        ? <RecommendedFocus pillars={focus} lang={lang} />
        : <NoFocusBanner lang={lang} />
      }

      {/* Activities carousel */}
      <ActivitiesCarousel activities={activities} lang={lang} />

      {/* Upcoming bookings */}
      <BookingsSection bookings={bookings} lang={lang} />

      {/* Quick actions — always visible */}
      <QuickActions lang={lang} />
    </div>
  )
}

// ── Empty state: assessment not yet taken ─────────────────────────────────

function NoAssessmentCard({ lang }: { lang: EmployeeLang }) {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 24, boxShadow: 'var(--shadow-card)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: 15, background: 'var(--color-bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ClipboardList size={24} style={{ color: 'var(--color-navy)' }} aria-hidden="true" />
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
          {lang === 'th' ? 'ยังไม่มีข้อมูลสุขภาวะ' : 'No wellbeing data yet'}
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: 300 }}>
          {lang === 'th'
            ? 'ทำแบบประเมิน PERFORM-6™ เพื่อดูภาพรวม 6 มิติของคุณ'
            : 'Complete your PERFORM-6™ assessment to see your 6-pillar wellbeing snapshot.'}
        </p>
      </div>
      <Link
        href="/assessment"
        style={{ height: 44, borderRadius: 14, padding: '0 24px', background: 'var(--color-navy)', color: '#fff', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center', textDecoration: 'none', fontFamily: 'var(--font-sans)', transition: 'background .18s' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-navy-dark)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-navy)' }}
      >
        {lang === 'th' ? 'เริ่มแบบประเมิน' : 'Start assessment'}
      </Link>
    </div>
  )
}

function NoFocusBanner({ lang }: { lang: EmployeeLang }) {
  return (
    <section style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 20, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <ClipboardList size={20} style={{ color: 'var(--color-navy)' }} aria-hidden="true" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>
          {lang === 'th' ? 'ยังไม่มีเป้าหมายการพัฒนา' : 'No focus areas yet'}
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          {lang === 'th'
            ? 'ผลแบบประเมินจะช่วยระบุด้านที่ควรให้ความสำคัญเดือนนี้'
            : 'Your assessment results will identify which pillars to focus on this month.'}
        </p>
      </div>
      <Link
        href="/assessment"
        style={{ height: 40, borderRadius: 12, padding: '0 20px', background: 'var(--color-bg-soft)', color: 'var(--color-navy)', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', textDecoration: 'none', fontFamily: 'var(--font-sans)', border: '1px solid var(--color-border)', transition: 'background .18s', flexShrink: 0 }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-border)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-bg-soft)' }}
      >
        {lang === 'th' ? 'เริ่มประเมิน' : 'Take assessment'}
      </Link>
    </section>
  )
}
