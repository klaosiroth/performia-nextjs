"use client"

interface SituationOption {
  value: number
  labelTh: string
  labelEn: string
}

interface SituationCardsProps {
  questionId: string
  questionText: string
  options: SituationOption[]
  value: number | null
  onChange: (value: number) => void
  lang?: "th" | "en"
}

export default function SituationCards(_props: SituationCardsProps) {
  return null
}
