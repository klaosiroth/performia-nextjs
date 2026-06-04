'use client'

interface ToastProps {
  message: string
  visible: boolean
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        zIndex: 99,
        transform: visible
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(12px)',
        background: 'var(--color-navy-dark)',
        color: '#fff',
        padding: '9px 18px',
        borderRadius: '9px',
        fontSize: '.78rem',
        opacity: visible ? 1 : 0,
        transition: 'opacity .22s, transform .22s',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        border: '1px solid rgba(89,227,255,.16)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {message}
    </div>
  )
}
