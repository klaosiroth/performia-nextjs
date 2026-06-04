import type { Database } from "@/lib/supabase/types"

type Booking = Database["public"]["Tables"]["bookings"]["Row"]

interface BookingsSectionProps {
  bookings: Booking[]
  lang?: "th" | "en"
}

export default function BookingsSection(_props: BookingsSectionProps) {
  return null
}
