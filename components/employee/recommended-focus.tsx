'use client'

import Link from 'next/link'
import { Brain, HeartPulse, Users, TrendingUp, LayoutGrid, Landmark, Layers, ArrowRight } from 'lucide-react'
import { et, type EmployeeLang } from '@/lib/employee-tr'
import type { PillarKey } from '@/tokens/pillars'

interface RecommendedFocusProps {
  pillars: PillarKey[]
  lang?: EmployeeLang
}

type PillarCard = {
  Icon: React.ElementType
  iconBg: string; iconColor: string
  chipBg: string; chipColor: string
  chipTH: string; chipEN: string
  nameTH: string; nameEN: string
  descTH: string; descEN: string
  count: number
  href: string
}

const PILLAR_CARDS: Record<PillarKey, PillarCard> = {
  Mind: {
    Icon: Brain, iconBg: 'var(--color-bg-soft)', iconColor: '#1D4ED8',
    chipBg: 'var(--color-bg-soft)', chipColor: '#1D4ED8', chipTH: 'ใจ · Mind', chipEN: 'Mind',
    nameTH: 'ใจที่ฟื้นตัวได้', nameEN: 'Mind Resilience',
    descTH: 'ลองกิจกรรมที่ช่วยจัดการความเครียดและฟื้นพลังใจ',
    descEN: 'Try activities that support stress recovery and emotional balance.',
    count: 4, href: '/marketplace',
  },
  Body: {
    Icon: HeartPulse, iconBg: '#DCFCE7', iconColor: '#15803D',
    chipBg: '#DCFCE7', chipColor: '#15803D', chipTH: 'กาย · Body', chipEN: 'Body',
    nameTH: 'พลังงานชีวิต', nameEN: 'Energy Vitality',
    descTH: 'เลือกกิจกรรมที่ช่วยเพิ่มพลังงาน การนอน และความพร้อมของร่างกาย',
    descEN: 'Choose activities that improve energy, sleep, and physical readiness.',
    count: 6, href: '/marketplace',
  },
  Social: {
    Icon: Users, iconBg: '#FFE4E6', iconColor: '#BE123C',
    chipBg: '#FFE4E6', chipColor: '#BE123C', chipTH: 'สังคม · Social', chipEN: 'Social',
    nameTH: 'ความเชื่อมโยง', nameEN: 'Connection',
    descTH: 'เสริมสร้างความสัมพันธ์และความเป็นอยู่ที่ดีในทีม',
    descEN: 'Build relationships and improve team wellbeing.',
    count: 3, href: '/marketplace',
  },
  Growth: {
    Icon: TrendingUp, iconBg: '#FEF9C3', iconColor: '#92400E',
    chipBg: '#FEF9C3', chipColor: '#92400E', chipTH: 'การเติบโต · Growth', chipEN: 'Growth',
    nameTH: 'แรงส่งแห่งการเติบโต', nameEN: 'Growth Momentum',
    descTH: 'เสริมความชัดเจนด้านเป้าหมาย การเรียนรู้ และการเติบโตในงาน',
    descEN: 'Build clarity, learning, and career readiness.',
    count: 5, href: '/marketplace',
  },
  WorkDesign: {
    Icon: LayoutGrid, iconBg: '#F1F5F9', iconColor: '#334155',
    chipBg: '#F1F5F9', chipColor: '#334155', chipTH: 'การทำงาน · Work', chipEN: 'Work Design',
    nameTH: 'ประสิทธิภาพที่ยั่งยืน', nameEN: 'Sustainable Performance',
    descTH: 'เพิ่มประสิทธิภาพการทำงานและลดความเหนื่อยล้า',
    descEN: 'Improve work effectiveness and reduce fatigue.',
    count: 4, href: '/marketplace',
  },
  Money: {
    Icon: Landmark, iconBg: '#FEF9C3', iconColor: '#92400E',
    chipBg: '#FEF9C3', chipColor: '#92400E', chipTH: 'การเงิน · Money', chipEN: 'Money',
    nameTH: 'ความมั่นคงทางการเงิน', nameEN: 'Financial Wellness',
    descTH: 'สร้างความมั่นใจทางการเงินและลดความกดดันด้านเงิน',
    descEN: 'Build financial confidence and reduce money-related stress.',
    count: 4, href: '/marketplace',
  },
}

export default function RecommendedFocus({ pillars, lang = 'th' }: RecommendedFocusProps) {
  const t    = (k: Parameters<typeof et>[1]) => et(lang, k)
  const show = pillars.slice(0, 3)

  return (
    <section className="fu d3">
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>{t('focus.title')}</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>{t('focus.sub')}</div>
        </div>
        <Link
          href="/marketplace"
          style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-aqua)', textDecoration: 'none', whiteSpace: 'nowrap', marginTop: 3, transition: 'color .15s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#0ab8b5' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-aqua)' }}
        >
          {t('focus.link')}
        </Link>
      </div>

      {/* 3-column pillar card grid */}
      <div className="focus-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {show.map(key => {
          const card = PILLAR_CARDS[key]
          const name = lang === 'th' ? card.nameTH : card.nameEN
          const desc = lang === 'th' ? card.descTH : card.descEN
          const chip = lang === 'th' ? card.chipTH : card.chipEN

          return (
            <div
              key={key}
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 20, padding: 22, transition: 'box-shadow .22s, transform .22s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(6,24,73,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
            >
              {/* Icon + chip */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <card.Icon size={20} style={{ color: card.iconColor }} aria-hidden="true" />
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 6, background: card.chipBg, color: card.chipColor, fontSize: 11, fontWeight: 600, letterSpacing: '0.2px' }}>
                  {chip}
                </span>
              </div>

              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>{name}</div>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 18 }}>{desc}</p>

              {/* Divider */}
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', marginBottom: 14 }} />

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  <Layers size={13} aria-hidden="true" />
                  <span>{card.count} {t('focus.unit')}</span>
                </div>
                <Link
                  href={card.href}
                  style={{ height: 36, borderRadius: 10, padding: '0 14px', fontSize: 12, fontWeight: 600, background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-navy)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontFamily: 'var(--font-sans)', transition: 'background .18s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-soft)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface)' }}
                >
                  <span>{t('focus.cta')}</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
