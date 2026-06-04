'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import BrandPanel from '@/components/auth/brand-panel'
import LoginCard from '@/components/auth/login-card'
import RedirectBanner from '@/components/auth/redirect-banner'
import LanguageSwitcher from '@/components/layout/language-switcher'
import WorkspaceModal from '@/components/layout/workspace-modal'
import Toast from '@/components/ui/toast'
import type { Role } from '@/lib/supabase/types'
import type { LoginLang } from '@/lib/login-tr'
import { tr } from '@/lib/login-tr'

const ROLE_PATH: Record<Role, string> = { employee: '/', hr: '/hr', executive: '/hr' }
const ROLE_LABEL_KEY: Record<Role, Parameters<typeof tr>[1]> = {
  employee: 'ws.employee.title',
  hr: 'ws.hr.title',
  executive: 'ws.exec.title',
}

export default function LoginPage() {
  const router = useRouter()

  const [lang, setLang] = useState<LoginLang>(() => {
    if (typeof window === 'undefined') return 'th'
    try {
      const saved = localStorage.getItem('performia_lang')
      if (saved === 'en' || saved === 'th') return saved
    } catch { /* ignore */ }
    return 'th'
  })
  const [toast, setToast] = useState({ message: '', visible: false })
  const [banner, setBanner] = useState({ message: '', visible: false })
  const [modal, setModal] = useState<{ open: boolean; roles: Role[] }>({ open: false, roles: [] })

  const handleLangChange = useCallback((l: LoginLang) => {
    setLang(l)
    try { localStorage.setItem('performia_lang', l) } catch { /* ignore */ }
  }, [])

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true })
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3200)
  }, [])

  const showBanner = useCallback((message: string) => {
    setBanner({ message, visible: true })
    setTimeout(() => setBanner({ message: '', visible: false }), 2700)
  }, [])

  const handleModal = useCallback((roles: Role[]) => {
    setModal({ open: true, roles })
  }, [])

  const handleWorkspaceSelect = useCallback((role: Role) => {
    setModal(prev => ({ ...prev, open: false }))
    const label = tr(lang, ROLE_LABEL_KEY[role])
    showBanner(`${tr(lang, 'redirect.to')} ${label}…`)
    setTimeout(() => router.push(ROLE_PATH[role]), 2700)
  }, [lang, showBanner, router])

  const handleNavigate = useCallback((path: string) => {
    router.push(path)
  }, [router])

  return (
    <>
      <RedirectBanner message={banner.message} visible={banner.visible} />

      <WorkspaceModal
        open={modal.open}
        roles={modal.roles}
        lang={lang}
        onSelect={handleWorkspaceSelect}
        onClose={() => setModal(prev => ({ ...prev, open: false }))}
      />

      <Toast message={toast.message} visible={toast.visible} />

      <div style={{ display: 'flex', height: '100dvh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
        <LanguageSwitcher lang={lang} onChange={handleLangChange} />
        <BrandPanel lang={lang} />
        <LoginCard
          lang={lang}
          onToast={showToast}
          onModal={handleModal}
          onBanner={showBanner}
          onNavigate={handleNavigate}
        />
      </div>
    </>
  )
}
