'use client'

import { usePathname } from 'next/navigation'
import { Search, Bell } from 'lucide-react'
import { et, monthYear, type EmployeeLang } from '@/lib/employee-tr'

interface TopbarUser {
  initials: string
}

interface TopbarProps {
  lang: EmployeeLang
  onLangChange: (l: EmployeeLang) => void
  user: TopbarUser | null
}

function getPageTitle(pathname: string, lang: EmployeeLang): string {
  const t = (k: Parameters<typeof et>[1]) => et(lang, k)
  if (pathname.startsWith('/marketplace')) return t('page.marketplace')
  if (pathname.startsWith('/profile'))     return t('page.profile')
  if (pathname.startsWith('/assessment'))  return t('page.assessment')
  return t('page.home')
}

export default function Topbar({ lang, onLangChange, user }: TopbarProps) {
  const pathname = usePathname()
  const t = (k: Parameters<typeof et>[1]) => et(lang, k)

  const pageTitle = getPageTitle(pathname, lang)
  const pageSub   = monthYear(lang)
  const initials  = user?.initials ?? '?'

  return (
    <header className="emp-topbar">
      {/* Page identity */}
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>{pageTitle}</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 1 }}>{pageSub}</div>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <SearchBox placeholder={t('search.ph')} />
        <LangSwitcher lang={lang} onChange={onLangChange} />
        <NotificationButton />
        <Avatar initials={initials} />
      </div>
    </header>
  )
}

function SearchBox({ placeholder }: { placeholder: string }) {
  return (
    <div
      className="emp-search"
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-bg-page)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '0 14px', height: 40, minWidth: 200 }}
    >
      <Search size={14} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} aria-hidden="true" />
      <span style={{ fontSize: 13, color: '#B0BFCF' }}>{placeholder}</span>
    </div>
  )
}

function LangSwitcher({ lang, onChange }: { lang: EmployeeLang; onChange: (l: EmployeeLang) => void }) {
  const btnBase: React.CSSProperties = {
    height: 28, borderRadius: 9, padding: '0 12px',
    fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
    transition: 'background .15s, color .15s',
    fontFamily: 'var(--font-sans)',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid var(--color-border)', borderRadius: 12, padding: 3, gap: 2, height: 36, flexShrink: 0 }}>
      <button
        type="button"
        aria-pressed={lang === 'th'}
        style={{ ...btnBase, background: lang === 'th' ? 'var(--color-navy)' : 'transparent', color: lang === 'th' ? '#fff' : 'var(--color-text-secondary)' }}
        onClick={() => onChange('th')}
      >
        ไทย
      </button>
      <button
        type="button"
        aria-pressed={lang === 'en'}
        style={{ ...btnBase, background: lang === 'en' ? 'var(--color-navy)' : 'transparent', color: lang === 'en' ? '#fff' : 'var(--color-text-secondary)' }}
        onClick={() => onChange('en')}
      >
        EN
      </button>
    </div>
  )
}

function NotificationButton() {
  return (
    <button
      type="button"
      aria-label="Notifications"
      style={{ position: 'relative', width: 40, height: 40, borderRadius: 12, border: '1px solid var(--color-border)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
    >
      <Bell size={16} style={{ color: 'var(--color-text-secondary)' }} aria-hidden="true" />
      <span
        className="pulse-dot"
        style={{ position: 'absolute', top: 9, right: 9, width: 7, height: 7, background: 'var(--color-aqua)', borderRadius: '50%', border: '1.5px solid #fff' }}
        aria-hidden="true"
      />
    </button>
  )
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div
      style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
      aria-label="User menu"
      role="button"
      tabIndex={0}
    >
      {initials}
    </div>
  )
}
