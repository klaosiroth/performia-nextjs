import type { PillarKey, ZoneKey } from "@/tokens/pillars"

interface PillarScore {
  pillar: PillarKey
  score: number
  zone: ZoneKey
  labelTh: string
  labelEn: string
}

interface Perform6OverviewProps {
  overallScore: number
  pillars: PillarScore[]
  assessedAt: string
  lang?: "th" | "en"
}

export default function Perform6Overview(_props: Perform6OverviewProps) {
  return null
}
