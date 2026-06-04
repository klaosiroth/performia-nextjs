import type { PillarKey, ZoneKey } from "@/tokens/pillars"

interface PillarScoreCardProps {
  pillar: PillarKey
  score: number
  previousScore: number
  zone: ZoneKey
  employeeCount?: number
  lang?: "th" | "en"
}

export default function PillarScoreCard(_props: PillarScoreCardProps) {
  return null
}
