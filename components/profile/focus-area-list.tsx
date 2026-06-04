import type { PillarKey } from "@/tokens/pillars"

interface FocusArea {
  pillar: PillarKey
  labelTh: string
  labelEn: string
  descTh: string
  descEn: string
}

interface FocusAreaListProps {
  areas: FocusArea[]
  lang?: "th" | "en"
}

export default function FocusAreaList(_props: FocusAreaListProps) {
  return null
}
