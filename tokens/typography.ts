// Primary font: "Noto Sans Thai" (weights 300–800)
// Accent font:  "LINE Seed Sans" (login branding only)

export const fontSize = {
  caption: "11px",
  small:   "12px",
  label:   "12px",
  body:    "14px",
  bodyLg:  "15px",
  title:   "18px",
  display: "22px",
  hero:    "clamp(1.7rem, 2.9vw, 2.5rem)",
} as const

export const fontWeight = {
  light:    300,
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
  extrabold: 800,
} as const

export const lineHeight = {
  tight:   1.2,
  snug:    1.4,
  normal:  1.5,
  relaxed: 1.7,
  loose:   1.88,
} as const

export const letterSpacing = {
  label:   "0.04em",
  caption: "0.03em",
  tight:   "-0.015em",
} as const
