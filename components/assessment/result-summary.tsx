import type { ZoneKey } from "@/tokens/pillars"

interface Persona {
  nameTh: string
  nameEn: string
  descTh: string
  descEn: string
  icon: string
}

interface ResultSummaryProps {
  overallScore: number
  zone: ZoneKey
  persona: Persona
  lang?: "th" | "en"
}

export default function ResultSummary(_props: ResultSummaryProps) {
  return null
}
