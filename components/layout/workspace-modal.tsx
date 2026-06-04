'use client'

import { useEffect } from 'react'
import type { Role } from '@/lib/supabase/types'
import { tr, type LoginLang } from '@/lib/login-tr'

const WORKSPACES: Array<{
  role: Role
  titleKey: Parameters<typeof tr>[1]
  descKey: Parameters<typeof tr>[1]
}> = [
  { role: 'employee', titleKey: 'ws.employee.title', descKey: 'ws.employee.desc' },
  { role: 'hr',       titleKey: 'ws.hr.title',       descKey: 'ws.hr.desc' },
  { role: 'executive',titleKey: 'ws.exec.title',     descKey: 'ws.exec.desc' },
]

interface WorkspaceModalProps {
  open: boolean
  roles: Role[]
  lang: LoginLang
  onSelect: (role: Role) => void
  onClose: () => void
}

export default function WorkspaceModal({ open, roles, lang, onSelect, onClose }: WorkspaceModalProps) {
  const t = (k: Parameters<typeof tr>[1]) => tr(lang, k)
  const visible = WORKSPACES.filter(w => roles.includes(w.role))

  useEffect(() => {
    if (!open) return
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [open, onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ws-title"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(3,18,68,.42)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'opacity .25s',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,.97)',
          borderRadius: '1.5rem',
          padding: '1.75rem',
          maxWidth: 420,
          width: '90%',
          boxShadow: 'var(--shadow-modal)',
          transform: open ? 'translateY(0)' : 'translateY(16px)',
          transition: 'transform .3s cubic-bezier(.34,1.2,.64,1)',
        }}
      >
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'linear-gradient(135deg,rgba(16,213,210,.16),rgba(89,227,255,.1))', border:'1px solid rgba(16,213,210,.24)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="7.5" r="2.5" fill="var(--color-aqua)" opacity=".8"/>
              <path d="M7.5 16.5c0-2.485 2.015-4 4.5-4s4.5 1.515 4.5 4" stroke="var(--color-aqua)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h3 id="ws-title" style={{ fontWeight:600, fontSize:'.98rem', color:'var(--color-text-primary)' }}>{t('ws.title')}</h3>
            <p style={{ fontSize:'.72rem', color:'var(--color-text-secondary)', marginTop:1 }}>{t('ws.subtitle')}</p>
          </div>
        </div>

        <hr style={{ borderColor:'#E0EDF6', margin:'14px 0' }}/>

        {/* Role buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {visible.map(({ role, titleKey, descKey }) => (
            <button
              key={role}
              type="button"
              onClick={() => onSelect(role)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 11,
                border: '1.5px solid #D0E3F0',
                background: 'rgba(232,243,251,.4)',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'border-color .2s, background .2s, box-shadow .2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(16,213,210,.5)'
                el.style.background = 'rgba(16,213,210,.04)'
                el.style.boxShadow = '0 4px 16px rgba(16,213,210,.08)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.borderColor = '#D0E3F0'
                el.style.background = 'rgba(232,243,251,.4)'
                el.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontWeight:600, fontSize:'.85rem', color:'var(--color-text-primary)' }}>{t(titleKey)}</div>
              <div style={{ fontSize:'.72rem', color:'var(--color-text-secondary)', marginTop:2 }}>{t(descKey)}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
