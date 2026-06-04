'use client'

import { useState, useCallback } from 'react'
import type { EmployeeLang } from '@/lib/employee-tr'
import Sidebar from './sidebar'
import Topbar from './topbar'

interface Profile {
  name_th: string | null
  name_en: string | null
  dept: string | null
}

interface EmployeeShellProps {
  profile: Profile | null
  children: React.ReactNode
}

export default function EmployeeShell({ profile, children }: EmployeeShellProps) {
  const [lang, setLang] = useState<EmployeeLang>(() => {
    if (typeof window === 'undefined') return 'th'
    try {
      const saved = localStorage.getItem('performia_lang')
      if (saved === 'en' || saved === 'th') return saved
    } catch { /* ignore */ }
    return 'th'
  })

  const handleLangChange = useCallback((l: EmployeeLang) => {
    setLang(l)
    try { localStorage.setItem('performia_lang', l) } catch { /* ignore */ }
  }, [])

  const user = profile
    ? {
        name:     lang === 'th' ? (profile.name_th ?? profile.name_en ?? '—') : (profile.name_en ?? profile.name_th ?? '—'),
        dept:     profile.dept ?? '',
        initials: ((lang === 'th' ? profile.name_th : profile.name_en) ?? profile.name_th ?? profile.name_en ?? '?').charAt(0).toUpperCase(),
      }
    : null

  return (
    <div className="emp-shell">
      <Sidebar lang={lang} user={user} />
      <div className="emp-main">
        <Topbar lang={lang} onLangChange={handleLangChange} user={user} />
        <main className="emp-content">{children}</main>
      </div>
    </div>
  )
}
