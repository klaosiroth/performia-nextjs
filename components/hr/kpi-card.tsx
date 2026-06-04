interface KPICardProps {
  label: string
  value: string | number
  trend?: number
  trendDirection?: "up" | "down" | "flat"
  subLabel?: string
}

export default function KPICard(_props: KPICardProps) {
  return null
}
