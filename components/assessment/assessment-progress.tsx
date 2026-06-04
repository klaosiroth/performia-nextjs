"use client"

import type { PillarKey } from "@/tokens/pillars"

interface PillarProgress {
  pillar: PillarKey
  status: "done" | "active" | "upcoming"
}

interface AssessmentProgressProps {
  pillars: PillarProgress[]
  currentQuestion: number
  totalQuestions: number
  timeRemainingSeconds: number
  lang?: "th" | "en"
}

export default function AssessmentProgress(_props: AssessmentProgressProps) {
  return null
}
