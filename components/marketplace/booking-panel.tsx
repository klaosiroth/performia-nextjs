"use client"

import type { Database } from "@/lib/supabase/types"

type Activity = Database["public"]["Tables"]["activities"]["Row"]
type Slot = Database["public"]["Tables"]["activity_slots"]["Row"]

interface BookingPanelProps {
  activity: Activity
  slots: Slot[]
  creditsRemaining: number
  lang?: "th" | "en"
}

export default function BookingPanel(_props: BookingPanelProps) {
  return null
}
