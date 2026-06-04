import type { Database } from "@/lib/supabase/types"

type Activity = Database["public"]["Tables"]["activities"]["Row"]

interface ActivitiesCarouselProps {
  activities: Activity[]
  lang?: "th" | "en"
}

export default function ActivitiesCarousel(_props: ActivitiesCarouselProps) {
  return null
}
