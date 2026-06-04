'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { et, type EmployeeLang } from '@/lib/employee-tr'

interface CreditSummaryCardProps {
  annual: number
  used: number
  lang?: EmployeeLang
}

const CIRC = 2 * Math.PI * 38  // 238.76

export default function CreditSummaryCard({ annual, used, lang = 'th' }: CreditSummaryCardProps) {
  const t        = (k: Parameters<typeof et>[1]) => et(lang, k)
  const remaining = annual - used
  const offset    = annual > 0 ? CIRC * (used / annual) : 0
  const year      = new Date().getFullYear()

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 24, boxShadow: 'var(--shadow-card)', padding: 24, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>{t('credit.title')}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{t('credit.fy')} {year}</div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 6, background: '#CCFBF1', color: '#0F766E', fontSize: 11, fontWeight: 600, letterSpacing: '0.2px' }}>
          {t('credit.chip')}
        </span>
      </div>

      {/* Ring + breakdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18 }}>
        {/* Donut ring */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
            <circle cx="48" cy="48" r="38" fill="none" stroke="var(--color-border)" strokeWidth="9" />
            <circle
              cx="48" cy="48" r="38" fill="none"
              stroke="var(--color-aqua)" strokeWidth="9" strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              transform="rotate(-90 48 48)"
              style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.1 }}>{remaining}</span>
            <span style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>/ {annual}</span>
          </div>
        </div>

        {/* Breakdown rows */}
        <div style={{ flex: 1 }}>
          {([
            { labelKey: 'credit.rem'  as const, value: remaining },
            { labelKey: 'credit.used' as const, value: used      },
            { labelKey: 'credit.total'as const, value: annual    },
          ] as const).map(({ labelKey, value }, i, arr) => (
            <div key={labelKey} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{t(labelKey)}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Micro-copy */}
      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 16, flex: 1 }}>
        {t('credit.micro')}
      </p>

      {/* CTA */}
      <Link
        href="/marketplace"
        style={{ width: '100%', height: 44, borderRadius: 14, background: 'var(--color-navy)', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', fontFamily: 'var(--font-sans)', transition: 'background .18s' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-navy-dark)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-navy)' }}
      >
        <ArrowRight size={15} aria-hidden="true" />
        <span>{t('credit.cta')}</span>
      </Link>
    </div>
  )
}
