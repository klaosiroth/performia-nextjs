export const PILLAR_KEYS = [
  "Mind",
  "Body",
  "Money",
  "Social",
  "Growth",
  "WorkDesign",
] as const

export type PillarKey = (typeof PILLAR_KEYS)[number]

export const pillars: Record<
  PillarKey,
  { text: string; bg: string; border: string; fallback: string }
> = {
  Mind:       { text: "#6D28D9", bg: "rgba(91,33,182,.08)",  border: "rgba(91,33,182,.2)",  fallback: "#EDE9FE" },
  Body:       { text: "#047857", bg: "rgba(4,120,87,.08)",   border: "rgba(4,120,87,.2)",   fallback: "#D1FAE5" },
  Money:      { text: "#B45309", bg: "rgba(146,64,14,.08)",  border: "rgba(146,64,14,.2)",  fallback: "#FEF3C7" },
  Social:     { text: "#BE185D", bg: "rgba(157,23,77,.08)",  border: "rgba(157,23,77,.2)",  fallback: "#FCE7F3" },
  Growth:     { text: "#1D4ED8", bg: "rgba(30,64,175,.08)",  border: "rgba(30,64,175,.2)",  fallback: "#DBEAFE" },
  WorkDesign: { text: "#C2410C", bg: "rgba(194,65,12,.08)",  border: "rgba(194,65,12,.2)",  fallback: "#FFEDD5" },
}

export const ZONE_KEYS = ["performing", "stable", "watch", "risk", "critical"] as const
export type ZoneKey = (typeof ZONE_KEYS)[number]

export const zones: Record<ZoneKey, string> = {
  performing: "#059669",
  stable:     "#0891B2",
  watch:      "#D97706",
  risk:       "#DC2626",
  critical:   "#7C3AED",
}
