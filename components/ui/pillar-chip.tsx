import type { PillarKey } from "@/tokens/pillars"

interface PillarChipProps {
  pillar: PillarKey | "all"
  active?: boolean
  onClick?: () => void
  lang?: "th" | "en"
}

export default function PillarChip(_props: PillarChipProps) {
  return null
}
