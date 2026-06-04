"use client"

import type { ActivityGroup } from "@/lib/supabase/types"
import type { PillarKey } from "@/tokens/pillars"

interface PillarFilterBarProps {
  activePillar: PillarKey | "all"
  activeGroup: ActivityGroup | "all"
  searchQuery: string
  onPillarChange: (pillar: PillarKey | "all") => void
  onGroupChange: (group: ActivityGroup | "all") => void
  onSearchChange: (query: string) => void
  lang?: "th" | "en"
}

export default function PillarFilterBar(_props: PillarFilterBarProps) {
  return null
}
