type RiskStatus = "good" | "moderate" | "attention"

interface RiskMetricCardProps {
  nameTh: string
  nameEn: string
  descTh?: string
  descEn?: string
  score: number
  previousScore: number
  status: RiskStatus
  sparkHistory: number[]
  insightTh?: string
  insightEn?: string
  lang?: "th" | "en"
}

export default function RiskMetricCard(_props: RiskMetricCardProps) {
  return null
}
