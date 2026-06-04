import EmployeeShell from '@/components/layout/employee-shell'

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  let profile: { name_th: string | null; name_en: string | null; dept: string | null } | null = null

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('name_th, name_en, dept')
        .eq('id', user.id)
        .single()
      profile = data
    }
  } catch {
    // Supabase not configured in this environment — shell renders with null profile
  }

  return <EmployeeShell profile={profile}>{children}</EmployeeShell>
}
