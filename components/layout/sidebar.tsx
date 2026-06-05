'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, ClipboardList, UserCircle, LayoutGrid,
  Wallet, CalendarCheck, MessageSquare, CircleHelp, ChevronRight,
} from 'lucide-react'
import { et, type EmployeeLang } from '@/lib/employee-tr'
import Logo from '@/components/ui/logo'

interface SidebarUser {
  name: string
  dept: string
  initials: string
}

interface SidebarProps {
  lang: EmployeeLang
  user: SidebarUser | null
}

const NAV_PRIMARY = [
  { href: '/',            exact: true,  Icon: Home,          labelKey: 'nav.home'       },
  { href: '/assessment',  exact: false, Icon: ClipboardList, labelKey: 'nav.assessment' },
  { href: '/profile',     exact: false, Icon: UserCircle,    labelKey: 'nav.profile'    },
  { href: '/marketplace', exact: false, Icon: LayoutGrid,    labelKey: 'nav.activities' },
  { href: '#',            exact: false, Icon: Wallet,        labelKey: 'nav.credits'    },
  { href: '#',            exact: false, Icon: CalendarCheck, labelKey: 'nav.bookings'   },
] as const

const NAV_SECONDARY = [
  { href: '#', exact: false, Icon: MessageSquare, labelKey: 'nav.feedback' },
  { href: '#', exact: false, Icon: CircleHelp,    labelKey: 'nav.help'     },
] as const

export default function Sidebar({ lang, user }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) => {
    if (href === '#') return false
    return exact ? pathname === href : pathname.startsWith(href)
  }

  const t = (k: Parameters<typeof et>[1]) => et(lang, k)

  return (
    <aside className="emp-sidebar">
      {/* Logo */}
      <div style={{ padding: '22px 20px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.95"/>
            <path d="M7.5 12.5l3 3 6-6" stroke="#071B63" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="sidebar-label"><Logo variant="light" width={110} height={30} /></span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div className="sidebar-section" style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-secondary)', letterSpacing: '1px', textTransform: 'uppercase', padding: '8px 14px 6px' }}>
          {t('nav.section')}
        </div>

        {NAV_PRIMARY.map(({ href, exact, Icon, labelKey }) => {
          const active = isActive(href, exact)
          return (
            <NavItem key={labelKey} href={href} active={active}>
              <Icon size={20} style={{ flexShrink: 0, color: active ? 'var(--color-aqua)' : 'currentColor' }} aria-hidden="true" />
              <span className="sidebar-label">{t(labelKey as Parameters<typeof et>[1])}</span>
            </NavItem>
          )
        })}

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '8px 0' }} />

        {NAV_SECONDARY.map(({ href, exact, Icon, labelKey }) => {
          const active = isActive(href, exact)
          return (
            <NavItem key={labelKey} href={href} active={active}>
              <Icon size={20} style={{ flexShrink: 0, color: active ? 'var(--color-aqua)' : 'currentColor' }} aria-hidden="true" />
              <span className="sidebar-label">{t(labelKey as Parameters<typeof et>[1])}</span>
            </NavItem>
          )
        })}
      </nav>

      {/* User widget */}
      <SidebarUserWidget user={user} />
    </aside>
  )
}

function NavItem({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  const base: React.CSSProperties = {
    height: 44, borderRadius: 14, padding: '0 14px',
    display: 'flex', alignItems: 'center', gap: 10,
    fontSize: 14, fontWeight: 500,
    color: active ? 'var(--color-navy)' : 'var(--color-text-secondary)',
    cursor: 'pointer', textDecoration: 'none',
    transition: 'background .16s, color .16s',
    background: active ? 'var(--color-bg-soft)' : 'transparent',
    borderLeft: active ? '3px solid var(--color-aqua)' : '3px solid transparent',
    paddingLeft: active ? 11 : 14,
  }

  const onHoverIn  = (e: React.MouseEvent<HTMLElement>) => {
    if (active) return
    e.currentTarget.style.background = 'var(--color-muted)'
    e.currentTarget.style.color      = 'var(--color-navy)'
  }
  const onHoverOut = (e: React.MouseEvent<HTMLElement>) => {
    if (active) return
    e.currentTarget.style.background = 'transparent'
    e.currentTarget.style.color      = 'var(--color-text-secondary)'
  }

  if (href === '#') {
    return (
      <span role="menuitem" className="emp-nav-item" style={base} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}>
        {children}
      </span>
    )
  }

  return (
    <Link href={href} className="emp-nav-item" style={base} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}>
      {children}
    </Link>
  )
}

function SidebarUserWidget({ user }: { user: SidebarUser | null }) {
  const initials = user?.initials ?? '?'
  const name     = user?.name     ?? '—'
  const dept     = user?.dept     ?? ''

  return (
    <div className="emp-user-widget" style={{ margin: '8px 12px 16px', padding: 14, borderRadius: 16, border: '1px solid var(--color-border)', background: 'var(--color-bg-page)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
        {initials}
      </div>
      <div className="sidebar-footer-text" style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
        {dept && <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dept}</div>}
      </div>
      <ChevronRight size={14} className="emp-user-chevron" style={{ color: 'var(--color-border)', flexShrink: 0 }} aria-hidden="true" />
    </div>
  )
}
