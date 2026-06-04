'use client'

import { useEffect, useRef, useState } from 'react'

interface RedirectBannerProps {
  message: string
  visible: boolean
}

export default function RedirectBanner({ message, visible }: RedirectBannerProps) {
  const [progActive, setProgActive] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    // Always schedule through setTimeout so setState is never called synchronously
    timerRef.current = setTimeout(() => setProgActive(visible), visible ? 50 : 0)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [visible])

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        padding: '13px',
        textAlign: 'center',
        background: 'linear-gradient(90deg, var(--color-navy-dark), #0C3585)',
        color: '#fff',
        fontFamily: 'var(--font-sans)',
        fontSize: '.82rem',
        fontWeight: 500,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform .4s cubic-bezier(.34,1.4,.64,1)',
        overflow: 'hidden',
      }}
    >
      <span>{message}</span>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2.5px',
          width: progActive ? '100%' : '0%',
          background: 'linear-gradient(90deg, var(--color-aqua), var(--color-cyan-accent))',
          transition: progActive ? 'width 2.1s linear' : 'none',
        }}
      />
    </div>
  )
}
