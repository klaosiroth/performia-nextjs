import HRSidebar from '@/components/layout/hr-sidebar'

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <HRSidebar />
      <main style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
    </div>
  )
}
