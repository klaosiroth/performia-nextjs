"use client"

interface DataPoint {
  label: string
  value: number
}

interface ParticipationChartProps {
  type: "line" | "doughnut" | "bar"
  data: DataPoint[]
  title?: string
}

export default function ParticipationChart(_props: ParticipationChartProps) {
  return null
}
