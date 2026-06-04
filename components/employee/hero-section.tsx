import type { Database } from "@/lib/supabase/types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type Assessment = Database["public"]["Tables"]["assessments"]["Row"]

interface HeroSectionProps {
  profile: Profile
  latestAssessment: Assessment | null
  lang?: "th" | "en"
}

export default function HeroSection(_props: HeroSectionProps) {
  return null
}
