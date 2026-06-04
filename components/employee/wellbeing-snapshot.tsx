import type { PillarKey, ZoneKey } from "@/tokens/pillars"

interface PillarStatus {
  pillar: PillarKey
  score: number
  zone: ZoneKey
}

interface WellbeingSnapshotProps {
  pillars: PillarStatus[]
  lang?: "th" | "en"
}

export default function WellbeingSnapshot(_props: WellbeingSnapshotProps) {
  return null
}
