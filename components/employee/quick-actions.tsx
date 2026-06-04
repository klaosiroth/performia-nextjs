'use client'

import Link from 'next/link'
import { UserCircle, Wallet, LayoutGrid, ClipboardList, CircleHelp } from 'lucide-react'
import { et, type EmployeeLang } from '@/lib/employee-tr'

interface QuickActionsProps {
  lang?: EmployeeLang
}

const ACTIONS = [
  { Icon: UserCircle,   iconBg: 'var(--color-bg-soft)', iconColor: 'var(--color-navy)', labelKey: 'quick.profile' as const, href: '/profile' },
  { Icon: Wallet,       iconBg: '#CCFBF1', iconColor: '#0F766E',           labelKey: 'quick.credits'    as const, href: '#'           },
  { Icon: LayoutGrid,   iconBg: '#FEF9C3', iconColor: '#92400E',           labelKey: 'quick.activities' as const, href: '/marketplace'},
  { Icon: ClipboardList,iconBg: '#F3E8FF', iconColor: '#6D28D9',           labelKey: 'quick.assessment' as const, href: '/assessment' },
  { Icon: CircleHelp,   iconBg: '#F1F5F9', iconColor: '#334155',           labelKey: 'quick.help'       as const, href: '#'           },
] as const

export default function QuickActions({ lang = 'th' }: QuickActionsProps) {
  const t = (k: Parameters<typeof et>[1]) => et(lang, k)

  return (
    <section className="fu d6" style={{ paddingBottom: 8 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>{t('quick.title')}</div>
      </div>
      <div className="quick-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        {ACTIONS.map(({ Icon, iconBg, iconColor, labelKey, href }) => (
          <Link
            key={labelKey}
            href={href}
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 18, padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'background .18s, box-shadow .18s, transform .18s', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-soft)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(6,24,73,0.07)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} style={{ color: iconColor }} aria-hidden="true" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'center' }}>{t(labelKey)}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
