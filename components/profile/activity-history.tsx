import type { Database } from "@/lib/supabase/types"

type Activity = Database["public"]["Tables"]["activities"]["Row"]

interface ActivityHistoryProps {
  activities: Activity[]
  lang?: "th" | "en"
}

export default function ActivityHistory(_props: ActivityHistoryProps) {
  return null
}
