import type { PillarKey } from "@/tokens/pillars"

interface Strength {
  pillar: PillarKey
  labelTh: string
  labelEn: string
  descTh: string
  descEn: string
}

interface StrengthsGridProps {
  strengths: Strength[]
  lang?: "th" | "en"
}

export default function StrengthsGrid(_props: StrengthsGridProps) {
  return null
}
