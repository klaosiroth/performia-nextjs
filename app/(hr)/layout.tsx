import HRSidebar from "@/components/layout/hr-sidebar"
import Topbar from "@/components/layout/topbar"

export default function HRLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <HRSidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
