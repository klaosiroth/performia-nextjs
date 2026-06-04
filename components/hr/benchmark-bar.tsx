import type { PillarKey } from "@/tokens/pillars"

interface BenchmarkBarProps {
  pillar?: PillarKey
  label?: string
  ourScore: number
  industryScore: number
  globalScore: number
}

export default function BenchmarkBar(_props: BenchmarkBarProps) {
  return null
}
