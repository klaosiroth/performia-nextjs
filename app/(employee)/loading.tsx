// Shown by Next.js while the async page.tsx fetches Supabase data
export default function EmployeeHomeLoading() {
  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero */}
      <div className="skeleton" style={{ background: 'var(--color-bg-soft)', borderRadius: 24, height: 244 }} />

      {/* Credit + snapshot row */}
      <div className="dash-credit-row" style={{ display: 'grid', gridTemplateColumns: '288px 1fr', gap: 24 }}>
        <div className="skeleton" style={{ background: 'var(--color-bg-soft)', borderRadius: 24, height: 300 }} />
        <div className="skeleton" style={{ background: 'var(--color-bg-soft)', borderRadius: 24, height: 300 }} />
      </div>

      {/* Recommended focus */}
      <div className="focus-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {[1, 2, 3].map(n => (
          <div key={n} className="skeleton" style={{ background: 'var(--color-bg-soft)', borderRadius: 20, height: 220 }} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="quick-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <div key={n} className="skeleton" style={{ background: 'var(--color-bg-soft)', borderRadius: 18, height: 100 }} />
        ))}
      </div>
    </div>
  )
}
