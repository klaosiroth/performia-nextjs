'use client'

import Link from 'next/link'
import { Compass, UserCircle, Wallet, CalendarCheck } from 'lucide-react'
import { et, monthYear, type EmployeeLang } from '@/lib/employee-tr'
import type { Database } from '@/lib/supabase/types'
import type { PillarKey } from '@/tokens/pillars'

type Profile    = Database['public']['Tables']['profiles']['Row']
type Assessment = Database['public']['Tables']['assessments']['Row']

interface HeroSectionProps {
  profile: Profile
  latestAssessment: Assessment | null
  lang?: EmployeeLang
}

// Display order matches HTML (s1→s6): Mind, Body, Social, Growth, WorkDesign, Money
const PILLAR_STRIP: Array<{ key: PillarKey; trKey: Parameters<typeof et>[1] }> = [
  { key: 'Mind',       trKey: 'pillar.mind'   },
  { key: 'Body',       trKey: 'pillar.body'   },
  { key: 'Social',     trKey: 'pillar.social' },
  { key: 'Growth',     trKey: 'pillar.growth' },
  { key: 'WorkDesign', trKey: 'pillar.work'   },
  { key: 'Money',      trKey: 'pillar.money'  },
]

function pillarZone(score: number | undefined, lang: EmployeeLang): { label: string; color: string } {
  if (score === undefined) return { label: '—', color: 'rgba(255,255,255,0.4)' }
  if (score >= 75) return { label: lang === 'th' ? 'ดี'            : 'Good',         color: '#10D5D2' }
  if (score >= 62) return { label: lang === 'th' ? 'แข็งแรง'      : 'Strong',        color: '#59E3FF' }
  if (score >= 50) return { label: lang === 'th' ? 'สมดุล'        : 'Balanced',      color: '#10D5D2' }
  if (score >= 35) return { label: lang === 'th' ? 'กำลังพัฒนา'   : 'Improving',     color: 'rgba(255,255,255,0.8)' }
  return               { label: lang === 'th' ? 'ต้องพัฒนา'    : 'Needs Focus',   color: 'rgba(255,255,255,0.6)' }
}

export default function HeroSection({ profile, latestAssessment, lang = 'th' }: HeroSectionProps) {
  const t = (k: Parameters<typeof et>[1]) => et(lang, k)

  const displayName   = lang === 'th' ? (profile.name_th ?? profile.name_en ?? '—') : (profile.name_en ?? profile.name_th ?? '—')
  const creditsLeft   = profile.credits_annual - profile.credits_used
  const scores        = latestAssessment?.scores ?? null

  return (
    <section
      className="hero-section fu"
      style={{
        background: 'var(--color-navy)',
        borderRadius: 24,
        padding: '36px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top-right aqua orb (::before) */}
      <div aria-hidden="true" style={{ position: 'absolute', top: -100, right: -60, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,213,210,0.14) 0%, transparent 65%)', pointerEvents: 'none' }} />
      {/* Bottom-center cyan orb (::after) */}
      <div aria-hidden="true" style={{ position: 'absolute', bottom: -80, left: '30%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(89,227,255,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* ── Main row ── */}
      <div className="hero-main-row" style={{ position: 'relative', zIndex: 2, display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Left */}
        <div style={{ flex: 1 }}>
          {/* Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(16,213,210,0.18)', border: '1px solid rgba(16,213,210,0.3)', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600, color: '#10D5D2' }}>
              {monthYear(lang)}
            </span>
            {profile.dept && (
              <span style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 6, padding: '3px 10px', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
                {profile.dept}
              </span>
            )}
          </div>

          {/* Greeting */}
          <h1 style={{ fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 8 }}>
            {t('hero.greeting')}{displayName}
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', marginBottom: 28 }}>
            {t('hero.sub')}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <CtaButton href="/marketplace" variant="primary-white">
              <Compass size={16} aria-hidden="true" />
              <span>{t('hero.cta1')}</span>
            </CtaButton>
            <CtaButton href="/profile" variant="glass">
              <UserCircle size={16} aria-hidden="true" />
              <span>{t('hero.cta2')}</span>
            </CtaButton>
          </div>
        </div>

        {/* Right — stat pills */}
        <div className="hero-stats" style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          <StatPill icon={<Wallet size={13} style={{ color: '#10D5D2' }} aria-hidden="true" />} label={t('hero.credits.lbl')}>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
              {creditsLeft}
              <span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>
                {' '}/ {profile.credits_annual}
              </span>
            </span>
          </StatPill>
          <StatPill icon={<CalendarCheck size={13} style={{ color: '#10D5D2' }} aria-hidden="true" />} label={t('hero.bookings.lbl')}>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
              0
              <span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>
                {' '}{t('hero.bookings.unit')}
              </span>
            </span>
          </StatPill>
        </div>
      </div>

      {/* ── PERFORM-6 strip ── */}
      <div
        className="hero-pillar-strip"
        style={{ position: 'relative', zIndex: 2, marginTop: 28, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.10)', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}
      >
        {PILLAR_STRIP.map(({ key, trKey }, i) => {
          const score  = scores?.[key]
          const { label, color } = pillarZone(score, lang)
          return (
            <div
              key={key}
              style={{ textAlign: 'center', padding: '0 8px', borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)' }}
            >
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{t(trKey)}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color }}>{label}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function StatPill({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div
      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 16, padding: '16px 20px', minWidth: 170, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', transition: 'background .2s, transform .2s' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        {icon}
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{label}</span>
      </div>
      {children}
    </div>
  )
}

function CtaButton({ href, variant, children }: { href: string; variant: 'primary-white' | 'glass'; children: React.ReactNode }) {
  const base: React.CSSProperties = {
    height: 44, borderRadius: 14, padding: '0 20px',
    fontSize: 14, fontWeight: 600,
    border: 'none', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 8,
    transition: 'background .18s, transform .18s',
    textDecoration: 'none', fontFamily: 'var(--font-sans)',
  }
  const styles: Record<typeof variant, React.CSSProperties> = {
    'primary-white': { ...base, background: '#fff',                           color: 'var(--color-navy)', border: 'none' },
    'glass':         { ...base, background: 'rgba(255,255,255,0.10)',         color: '#fff',              border: '1px solid rgba(255,255,255,0.20)' },
  }
  const hoverBg: Record<typeof variant, string> = {
    'primary-white': 'rgba(245,248,255,1)',
    'glass':         'rgba(255,255,255,0.18)',
  }

  return (
    <Link
      href={href}
      style={styles[variant]}
      onMouseEnter={e => { e.currentTarget.style.background = hoverBg[variant]; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.background = styles[variant].background as string; e.currentTarget.style.transform = 'none' }}
    >
      {children}
    </Link>
  )
}
