import type { Database } from "@/lib/supabase/types"

type Activity = Database["public"]["Tables"]["activities"]["Row"]

interface ActivityCardProps {
  activity: Activity
  seatsLeft?: number
  lang?: "th" | "en"
}

export default function ActivityCard(_props: ActivityCardProps) {
  return null
}
