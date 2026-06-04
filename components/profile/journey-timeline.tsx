interface TimelineEvent {
  date: string
  labelTh: string
  labelEn: string
  dotColor?: string
}

interface JourneyTimelineProps {
  events: TimelineEvent[]
  lang?: "th" | "en"
}

export default function JourneyTimeline(_props: JourneyTimelineProps) {
  return null
}
