'use client'

import Link from 'next/link'
import { Brain, HeartPulse, Users, TrendingUp, LayoutDashboard, Landmark, BarChart2 } from 'lucide-react'
import { et, type EmployeeLang } from '@/lib/employee-tr'
import type { PillarKey, ZoneKey } from '@/tokens/pillars'

interface PillarStatus {
  pillar: PillarKey
  score: number
  zone: ZoneKey
}

interface WellbeingSnapshotProps {
  pillars: PillarStatus[]
  lang?: EmployeeLang
}

type ChipStyle = { bg: string; color: string }

const ZONE_CHIP: Record<ZoneKey, ChipStyle> = {
  performing: { bg: '#DCFCE7', color: '#15803D' },
  stable:     { bg: '#EEF8FF', color: '#1D4ED8' },
  watch:      { bg: '#FEF9C3', color: '#92400E' },
  risk:       { bg: '#FFE4E6', color: '#BE123C' },
  critical:   { bg: '#F3E8FF', color: '#6D28D9' },
}

type PillarMeta = { Icon: React.ElementType; iconBg: string; iconColor: string; labelTH: string; labelEN: string; valueTH: Record<ZoneKey, string>; valueEN: Record<ZoneKey, string> }

const PILLAR_META: Record<PillarKey, PillarMeta> = {
  Mind:       { Icon: Brain,          iconBg: '#EEF8FF', iconColor: '#1D4ED8', labelTH: 'ใจ',        labelEN: 'Mind',       valueTH: { performing:'ดี', stable:'มั่นคง', watch:'กำลังพัฒนา', risk:'ต้องดูแล', critical:'เร่งด่วน' }, valueEN: { performing:'Good', stable:'Stable', watch:'Improving', risk:'At Risk', critical:'Critical' } },
  Body:       { Icon: HeartPulse,     iconBg: '#DCFCE7', iconColor: '#15803D', labelTH: 'กาย',       labelEN: 'Body',       valueTH: { performing:'ดี', stable:'มั่นคง', watch:'กำลังพัฒนา', risk:'ต้องดูแล', critical:'เร่งด่วน' }, valueEN: { performing:'Good', stable:'Stable', watch:'Improving', risk:'At Risk', critical:'Critical' } },
  Social:     { Icon: Users,          iconBg: '#EEF8FF', iconColor: '#1D4ED8', labelTH: 'สังคม',     labelEN: 'Social',     valueTH: { performing:'ดี', stable:'แข็งแรง', watch:'กำลังพัฒนา', risk:'ต้องดูแล', critical:'เร่งด่วน' }, valueEN: { performing:'Good', stable:'Strong', watch:'Improving', risk:'At Risk', critical:'Critical' } },
  Growth:     { Icon: TrendingUp,     iconBg: '#FEF9C3', iconColor: '#92400E', labelTH: 'การเติบโต', labelEN: 'Growth',     valueTH: { performing:'ดี', stable:'สมดุล',  watch:'กำลังพัฒนา', risk:'ต้องดูแล', critical:'เร่งด่วน' }, valueEN: { performing:'Good', stable:'Balanced', watch:'Improving', risk:'At Risk', critical:'Critical' } },
  WorkDesign: { Icon: LayoutDashboard,iconBg: '#DCFCE7', iconColor: '#15803D', labelTH: 'การทำงาน', labelEN: 'Work Design', valueTH: { performing:'ดี', stable:'สมดุล',  watch:'กำลังพัฒนา', risk:'ต้องดูแล', critical:'เร่งด่วน' }, valueEN: { performing:'Good', stable:'Balanced', watch:'Improving', risk:'At Risk', critical:'Critical' } },
  Money:      { Icon: Landmark,       iconBg: '#EEF8FF', iconColor: '#1D4ED8', labelTH: 'การเงิน',  labelEN: 'Money',      valueTH: { performing:'ดี', stable:'มั่นคง', watch:'กำลังพัฒนา', risk:'ต้องดูแล', critical:'เร่งด่วน' }, valueEN: { performing:'Good', stable:'Stable', watch:'Improving', risk:'At Risk', critical:'Critical' } },
}

// Display order matching performia-employee-home.html
const ORDER: PillarKey[] = ['Mind', 'Body', 'Social', 'Growth', 'WorkDesign', 'Money']

export default function WellbeingSnapshot({ pillars, lang = 'th' }: WellbeingSnapshotProps) {
  const t = (k: Parameters<typeof et>[1]) => et(lang, k)
  const byKey = Object.fromEntries(pillars.map(p => [p.pillar, p])) as Partial<Record<PillarKey, PillarStatus>>

  return (
    <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 24, boxShadow: 'var(--shadow-card)', padding: 24 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>{t('snap.title')}</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>{t('snap.sub')}</div>
        </div>
        <Link
          href="/profile"
          style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-aqua)', textDecoration: 'none', whiteSpace: 'nowrap', marginTop: 3, transition: 'color .15s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#0ab8b5' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-aqua)' }}
        >
          {t('snap.link')}
        </Link>
      </div>

      {/* 6-column pillar grid */}
      <div className="snap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 18 }}>
        {ORDER.map(key => {
          const meta   = PILLAR_META[key]
          const status = byKey[key]
          const zone   = status?.zone ?? 'stable'
          const chip   = ZONE_CHIP[zone]
          const label  = lang === 'th' ? meta.labelTH : meta.labelEN
          const value  = lang === 'th' ? meta.valueTH[zone] : meta.valueEN[zone]

          return (
            <div
              key={key}
              style={{ background: 'var(--color-bg-page)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '14px 8px', textAlign: 'center', transition: 'background .18s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-soft)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-bg-page)' }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: meta.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <meta.Icon size={16} style={{ color: meta.iconColor }} aria-hidden="true" />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 5 }}>{label}</div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 6, background: chip.bg, color: chip.color, fontSize: 10, fontWeight: 600, letterSpacing: '0.2px' }}>
                {value}
              </span>
            </div>
          )
        })}
      </div>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', marginBottom: 16 }} />

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{t('snap.footer')}</p>
        <Link
          href="/profile"
          style={{ height: 36, borderRadius: 10, padding: '0 14px', fontSize: 13, fontWeight: 600, background: '#fff', border: '1px solid var(--color-border)', color: 'var(--color-navy)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontFamily: 'var(--font-sans)', transition: 'background .18s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-soft)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
        >
          <BarChart2 size={14} aria-hidden="true" />
          <span>{t('snap.cta')}</span>
        </Link>
      </div>
    </div>
  )
}
