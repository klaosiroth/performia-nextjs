'use client'

import type { LoginLang } from '@/lib/login-tr'

interface LanguageSwitcherProps {
  lang: LoginLang
  onChange: (lang: LoginLang) => void
}

export default function LanguageSwitcher({ lang, onChange }: LanguageSwitcherProps) {
  const btnBase: React.CSSProperties = {
    padding: '5px 14px',
    borderRadius: '99px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    fontSize: '.71rem',
    fontWeight: 600,
    letterSpacing: '.03em',
    whiteSpace: 'nowrap',
    lineHeight: 1,
    transition: 'color .2s, background .2s, box-shadow .2s',
  }

  const activeStyle: React.CSSProperties = {
    ...btnBase,
    color: '#fff',
    background: 'linear-gradient(128deg, var(--color-navy), #0B7FA3)',
    boxShadow: '0 2px 10px rgba(7,27,99,.22), 0 0 0 1px rgba(89,227,255,.16)',
  }

  const inactiveStyle: React.CSSProperties = {
    ...btnBase,
    color: 'var(--color-text-secondary)',
    background: 'transparent',
  }

  return (
    <div
      aria-label="Language selector"
      className="login-lang-sw"
      style={{
        position: 'absolute',
        top: '22px',
        right: '22px',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(188,214,234,.62)',
        borderRadius: '99px',
        padding: '3px',
        boxShadow: '0 2px 16px rgba(6,24,73,.07), 0 1px 4px rgba(6,24,73,.04)',
      }}
    >
      <button
        type="button"
        aria-pressed={lang === 'th'}
        className="login-lang-btn"
        style={lang === 'th' ? activeStyle : inactiveStyle}
        onClick={() => onChange('th')}
      >
        ไทย
      </button>
      <button
        type="button"
        aria-pressed={lang === 'en'}
        className="login-lang-btn"
        style={lang === 'en' ? activeStyle : inactiveStyle}
        onClick={() => onChange('en')}
      >
        EN
      </button>
    </div>
  )
}
