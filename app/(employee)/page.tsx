import { createClient } from '@/lib/supabase/server'
import EmployeeHomeContent from '@/components/employee/employee-home-content'
import type { Database } from '@/lib/supabase/types'

type Profile    = Database['public']['Tables']['profiles']['Row']
type Assessment = Database['public']['Tables']['assessments']['Row']

export default async function EmployeeHomePage() {
  let profile:          Profile    | null = null
  let latestAssessment: Assessment | null = null
  let fetchError = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const [profileRes, assessmentRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('assessments')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])

      if (profileRes.error) {
        fetchError = true
      } else {
        profile = profileRes.data
      }

      // Assessment absence is expected for new users — not a fetch error
      if (!assessmentRes.error) {
        latestAssessment = assessmentRes.data
      }
    }
  } catch {
    fetchError = true
  }

  return (
    <EmployeeHomeContent
      profile={profile}
      latestAssessment={latestAssessment}
      fetchError={fetchError}
    />
  )
}
