import { createClient } from '@/lib/supabase/server'
import EmployeeHomeContent from '@/components/employee/employee-home-content'
import type { BookingWithDetails } from '@/components/employee/bookings-section'
import type { Database } from '@/lib/supabase/types'

type Profile    = Database['public']['Tables']['profiles']['Row']
type Assessment = Database['public']['Tables']['assessments']['Row']
type Activity   = Database['public']['Tables']['activities']['Row']

export default async function EmployeeHomePage() {
  let profile:          Profile             | null = null
  let latestAssessment: Assessment          | null = null
  let activities:       Activity[]                 = []
  let bookings:         BookingWithDetails[]        = []
  let fetchError = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const [profileRes, assessmentRes, activitiesRes, bookingsRes] = await Promise.all([
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
        supabase
          .from('activities')
          .select('*')
          .eq('is_active', true)
          .limit(6),
        supabase
          .from('bookings')
          .select('*, activity_slots(*, activities(*))')
          .eq('user_id', user.id)
          .eq('status', 'confirmed')
          .limit(10),
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

      if (!activitiesRes.error) {
        activities = activitiesRes.data ?? []
      }

      if (!bookingsRes.error) {
        const now = new Date().toISOString()
        bookings = ((bookingsRes.data ?? []) as unknown as BookingWithDetails[])
          .filter(b => b.activity_slots != null && b.activity_slots.starts_at > now)
          .sort((a, b) =>
            (a.activity_slots?.starts_at ?? '') < (b.activity_slots?.starts_at ?? '') ? -1 : 1
          )
          .slice(0, 4)
      }
    }
  } catch {
    fetchError = true
  }

  return (
    <EmployeeHomeContent
      profile={profile}
      latestAssessment={latestAssessment}
      activities={activities}
      bookings={bookings}
      fetchError={fetchError}
    />
  )
}
