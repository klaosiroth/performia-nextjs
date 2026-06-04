import type { PillarKey, ZoneKey } from "@/tokens/pillars"

interface PillarResult {
  pillar: PillarKey
  score: number
  zone: ZoneKey
}

interface PillarBreakdownProps {
  pillars: PillarResult[]
  lang?: "th" | "en"
}

export default function PillarBreakdown(_props: PillarBreakdownProps) {
  return null
}
